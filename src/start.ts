import Server from './Server'

const port = parseInt(process.env.PORT || '8080');
const server = new Server();
server.start(port);
