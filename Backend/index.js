import express from "express";
import http from "http";
import { Server } from "socket.io";

var os = require('os');
var pty = require('node-pty');

const app = express()
const server = http.createServer(app)
const io = new Server({
    cors: '*'
})

io.attach(server)


server.listen(9000, () => console.log(`🐋 Docker Server running on port 9000`))

io.on('connection', (socket) => {
    console.log(`socket connected`, socket.id);
  });
  