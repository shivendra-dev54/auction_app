# Backend

## API endpoints

### Auth endpoints

**1. Sign Up**
 - path: `/api/auth/signup`
 - method: POST
 - body:
 ```JSON
{
"username": "shiv",
"email": "shiv@example.com",
"password": "strongpassword123"
}
```

**2. Sign In**
 - path: `/api/auth/signin`
 - method: POST
 - body:
 ```JSON
{
"email": "shiv@example.com",
"password": "strongpassword123"
}
```

**3. Refresh**: to refresh the auth cookies
 - path: `/api/auth/refresh`
 - method: POST
 - body:
 ```JSON
{}
```

**4. logout**
 - path: `/api/auth/logout`
 - method: POST
 - body:
 ```JSON
{}
```

### Item endpoints

**1. Create Item**

* path: `/api/items`
* method: POST
* body:

```JSON
{
  "itemname": "RTX 5090"
}
```

**2. Get All Items**

* path: `/api/items`
* method: GET
* body:

```JSON
{}
```

**3. Get Item**

* path: `/api/items/:id`
* method: GET
* body:

```JSON
{}
```

Example:

```text
/api/items/1
```

**4. Update Item**

* path: `/api/items/:id`
* method: PATCH
* body:

```JSON
{
  "itemname": "RTX 5090 Founders Edition"
}
```

**5. Delete Item**

* path: `/api/items/:id`
* method: DELETE
* body:

```JSON
{}
```

### Auction endpoints

**1. Create Auction**
* path: `/api/auctions`
* method: POST
* body:
```JSON
{
  "itemId": 1,
  "startingBid": 500
}

```

**2. Get Ongoing Auctions**

* path: `/api/auctions/ongoing`
* method: GET
* body:

```JSON
{}

```

**3. Get Auction History**

* path: `/api/auctions/history`
* method: GET
* body:

```JSON
{}

```

**4. Get Auction Details**

* path: `/api/auctions/:id`
* method: GET
* body:

```JSON
{}

```

## WebSocket endpoints

### Live Auction Room

- path: `/ws/auctions/:auctionId`
- protocol: WS
- auth: Handshake authenticated via `access_token` cookie

#### Client -> Server Messages

**1. Place Bid**
```JSON
{
  "type": "PLACE_BID",
  "payload": {
    "amount": 650
  }
}

```

**2. Finalize Winner (Host Only)**

```JSON
{
  "type": "FINALIZE_WINNER"
}

```

#### Server -> Client Events

**1. Initial State (Sent upon connection)**

```JSON
{
  "type": "INIT_ROOM_STATE",
  "payload": {
    "auctionId": "c8d8b9d6-5452-47d3-9f79-994df58a44ec",
    "itemId": 1,
    "itemName": "RTX 5090",
    "hostId": 2,
    "startingBid": 500,
    "currentBid": 500,
    "currentBidderId": null,
    "totalBids": 0,
    "maxBidsLimit": 100,
    "participantsCount": 1,
    "recentBids": []
  }
}

```

**2. User Joined Notification**

```JSON
{
  "type": "USER_JOINED",
  "payload": {
    "userId": 3,
    "username": "alex",
    "participantsCount": 2
  }
}

```

**3. New Bid Placed**

```JSON
{
  "type": "NEW_BID",
  "payload": {
    "userId": 3,
    "username": "alex",
    "amount": 650,
    "createdAt": "2026-09-27T10:47:00.000Z",
    "totalBids": 1
  }
}

```

**4. Auction Completed (Winner Selected or 100 Bids Reached)**

```JSON
{
  "type": "AUCTION_COMPLETED",
  "payload": {
    "persistedAuctionId": 14,
    "winnerId": 3,
    "winningBid": 650
  }
}

```

**5. Auction Cancelled (Host Disconnected)**

```JSON
{
  "type": "AUCTION_CANCELLED",
  "payload": {
    "reason": "Host disconnected from the auction."
  }
}

```

**6. Error Notification**

```JSON
{
  "type": "ERROR",
  "payload": {
    "message": "Bid must be strictly higher than current bid: 650"
  }
}

```