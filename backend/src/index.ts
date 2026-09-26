import app from "./app";
import http from 'http';
import { PORT } from "./constants/dotenv_constants";

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`started server on port ${PORT}...`);
})