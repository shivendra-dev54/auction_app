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