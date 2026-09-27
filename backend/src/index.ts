import app from "./app";
import http from 'http';
import { PORT } from "./constants/dotenv_constants";
import { setupAuctionWebSocket } from "./ws/auction.ws";

const server = http.createServer(app);

setupAuctionWebSocket(server);

server.listen(PORT, () => {
  console.log(`started server on port ${PORT}...`);
})