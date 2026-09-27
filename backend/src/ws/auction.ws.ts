import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/user.schema";
import { activeAuctions, type InMemBid } from "./auction.store";
import { persistCompletedAuction } from "../services/auction_finalizer.service";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const MAX_BIDS_LIMIT = 100;

interface AuthUser {
  id: number;
  username: string;
}

const parseAuth = async (reqHeaders: any): Promise<AuthUser | null> => {
  try {
    const userId = Number(reqHeaders["x-user-id"]);

    const [user] = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user || null;
  } catch {
    return null;
  }
};

const sendJson = (ws: WebSocket, data: object) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
};

const broadcast = (auctionId: string, data: object) => {
  const room = activeAuctions.get(auctionId);
  if (!room) return;

  const payload = JSON.stringify(data);
  for (const clientSockets of room.clients.values()) {
    for (const ws of clientSockets) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
  }
};

const endAndPersistAuction = async (
  auctionId: string,
  winnerId: number,
  winningBid: number,
) => {
  const room = activeAuctions.get(auctionId);
  if (!room) return;

  try {
    const persistedAuctionId = await persistCompletedAuction(
      room,
      winnerId,
      winningBid,
    );

    broadcast(auctionId, {
      type: "AUCTION_COMPLETED",
      payload: {
        persistedAuctionId,
        winnerId,
        winningBid,
      },
    });
  } catch (error) {
    broadcast(auctionId, {
      type: "ERROR",
      payload: { message: "Failed to persist auction state to database." },
    });
  } finally {
    // Close sockets and purge in-memory room
    for (const clientSockets of room.clients.values()) {
      for (const ws of clientSockets) {
        ws.close(1000, "Auction ended");
      }
    }
    activeAuctions.delete(auctionId);
  }
};

export const setupAuctionWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (request, socket, head) => {
    const url = new URL(request.url || "", `http://${request.headers.host}`);
    const pathname = url.pathname;

    // Route format: /ws/auctions/:auctionId
    const match = pathname.match(/^\/ws\/auctions\/([^/]+)$/);
    if (!match) {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.destroy();
      return;
    }

    const auctionId = match[1];
    const room = activeAuctions.get(auctionId!);

    if (!room) {
      socket.write("HTTP/1.1 404 Auction Not Found\r\n\r\n");
      socket.destroy();
      return;
    }

    const user = await parseAuth(request.headers);
    if (!user) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, user, auctionId);
    });
  });

  wss.on(
    "connection",
    (ws: WebSocket, _request: any, user: AuthUser, auctionId: string) => {
      const room = activeAuctions.get(auctionId);
      if (!room) {
        ws.close(1008, "Auction no longer exists");
        return;
      }

      // Add socket to room
      if (!room.clients.has(user.id)) {
        room.clients.set(user.id, new Set());
      }
      room.clients.get(user.id)!.add(ws);
      room.participants.add(user.id);

      // Send initial room snapshot
      sendJson(ws, {
        type: "INIT_ROOM_STATE",
        payload: {
          auctionId: room.id,
          itemId: room.itemId,
          itemName: room.itemName,
          hostId: room.hostId,
          startingBid: room.startingBid,
          currentBid: room.currentBid,
          currentBidderId: room.currentBidderId,
          totalBids: room.bids.length,
          maxBidsLimit: MAX_BIDS_LIMIT,
          participantsCount: room.participants.size,
          recentBids: room.bids.slice(-10),
        },
      });

      // Broadcast join event
      broadcast(auctionId, {
        type: "USER_JOINED",
        payload: {
          userId: user.id,
          username: user.username,
          participantsCount: room.participants.size,
        },
      });

      // Message Handling
      ws.on("message", async (data: string) => {
        try {
          const message = JSON.parse(data.toString());
          const currentRoom = activeAuctions.get(auctionId);
          if (!currentRoom) return;

          switch (message.type) {
            case "PLACE_BID": {
              if (user.id === currentRoom.hostId) {
                sendJson(ws, {
                  type: "ERROR",
                  payload: { message: "Host cannot place bids on their own auction" },
                });
                return;
              }

              const amount = Number(message.payload?.amount);
              if (isNaN(amount) || amount <= currentRoom.currentBid) {
                sendJson(ws, {
                  type: "ERROR",
                  payload: {
                    message: `Bid must be strictly higher than current bid: ${currentRoom.currentBid}`,
                  },
                });
                return;
              }

              const newBid: InMemBid = {
                userId: user.id,
                username: user.username,
                amount,
                createdAt: new Date(),
              };

              currentRoom.bids.push(newBid);
              currentRoom.currentBid = amount;
              currentRoom.currentBidderId = user.id;

              broadcast(auctionId, {
                type: "NEW_BID",
                payload: {
                  ...newBid,
                  totalBids: currentRoom.bids.length,
                },
              });

              // Check if 100 bids limit reached
              if (currentRoom.bids.length >= MAX_BIDS_LIMIT) {
                await endAndPersistAuction(
                  auctionId,
                  user.id,
                  currentRoom.currentBid,
                );
              }
              break;
            }

            case "FINALIZE_WINNER": {
              if (user.id !== currentRoom.hostId) {
                sendJson(ws, {
                  type: "ERROR",
                  payload: { message: "Only the host can finalize the auction" },
                });
                return;
              }

              if (!currentRoom.currentBidderId || currentRoom.bids.length === 0) {
                sendJson(ws, {
                  type: "ERROR",
                  payload: { message: "Cannot finalize an auction with no bids" },
                });
                return;
              }

              await endAndPersistAuction(
                auctionId,
                currentRoom.currentBidderId,
                currentRoom.currentBid,
              );
              break;
            }

            default:
              sendJson(ws, {
                type: "ERROR",
                payload: { message: `Unknown message type: ${message.type}` },
              });
          }
        } catch {
          sendJson(ws, {
            type: "ERROR",
            payload: { message: "Malformed JSON message" },
          });
        }
      });

      // Disconnect handling
      ws.on("close", () => {
        const currentRoom = activeAuctions.get(auctionId);
        if (!currentRoom) return;

        const userSockets = currentRoom.clients.get(user.id);
        if (userSockets) {
          userSockets.delete(ws);
          if (userSockets.size === 0) {
            currentRoom.clients.delete(user.id);
          }
        }

        // Host left the auction -> Cancel auction and delete from memory
        if (user.id === currentRoom.hostId) {
          const hostSocketsRemaining = currentRoom.clients.get(user.id)?.size || 0;
          if (hostSocketsRemaining === 0) {
            broadcast(auctionId, {
              type: "AUCTION_CANCELLED",
              payload: { reason: "Host disconnected from the auction." },
            });

            for (const clientSockets of currentRoom.clients.values()) {
              for (const socket of clientSockets) {
                socket.close(1000, "Host left");
              }
            }

            activeAuctions.delete(auctionId);
          }
        }
      });
    },
  );
};