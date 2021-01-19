const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

// kafka setup
const KAFKA_HOST = process.env.NODE_ENV;
var kafka = require('kafka-node'),
     Consumer = kafka.Consumer,
     client = new kafka.KafkaClient(
       {
         kafkaHost: `${KAFKA_HOST}:443"`,
         ssl: true
       }
     ),
     consumer = new Consumer(
         client,
         [
             { topic: 'decoded-speech', partition: 0 }
         ],
         {
             autoCommit: false
         }
     );


let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

// kafka Consumer
consumer.on('message', function (message) {
   console.log(message);
   socket.emit("FromKafka", message.value);
 });

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
