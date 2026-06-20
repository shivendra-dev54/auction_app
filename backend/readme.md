# Backend

### starting the server

- make sure you have go installed on your machine.
- setup the enviroment variables.

```bash
./backend/.env

DATABASE_STRING="host=localhost user=user password=pass dbname=postgres_db port=5432 sslmode=disable"
PORT=64001
COOKIE_SECRET=this_is_some_random_thing_of_l32
```

- download the dependencies.

```bash
go mod download
```

- start the project

```bash
make dev
```

If the system shows that the port is already busy then use following command to kill all the escaped processes of server.

```bash
make kill
```

---

---

### setting up enviroment variables

```bash
./backend/.env

DATABASE_STRING="host=localhost user=user password=pass dbname=postgres_db port=5432 sslmode=disable"
PORT=64001
COOKIE_SECRET=this_is_some_random_thing_of_l32
```

- you can use the included docker-compose file to easily start the server.
- the given DB string is accurate as per that dockerized server.
- the length of cookie secret mush be 32.

---

---

### API endpoints

| endpoint            | method | desc                                                         |
| ------------------- | ------ | ------------------------------------------------------------ |
| `/api/health`       | GET    | to check if server is running properly.                      |
| `/api/auth/sign_up` | POST   | to create user account.                                      |
| `/api/auth/sign_in` | POST   | to log in.                                                   |
| `/api/auth/refresh` | POST   | to refresh the auth cookies                                  |
| `/api/auth/logout`  | POST   | to log out of account.                                       |
| `/api/item/`        | POST   | to create a new item entry.                                  |
| `/api/item/`        | GET    | to read all the item of logged in user.                      |
| `/api/item/:id`     | PUT    | to update item.                                              |
| `/api/item/:id`     | DELETE | to delete item.                                              |
| `/api/purchased`    | GET    | to read all the purchased items (purchased through auction.) |
