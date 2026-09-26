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

