const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require('fs')

const port = process.env.PORT || 8080;
const host = process.env.IP || '0.0.0.0';

const index = require("./routes/index");
var cors = require('cors');

const app = express();
app.use(index);
app.use(cors());

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

// kafka setup
const kafka_host = process.env.KAFKA_HOST;
const kafka_topic = process.env.KAFKA_TOPIC;
const ssl_path = process.env.SSL_PATH;

var kafka = require('kafka-node'),
     Consumer = kafka.Consumer,
     client = new kafka.KafkaClient(
       {
         kafkaHost: `${kafka_host}`,
         sslOptions: {
           rejectUnauthorized: false,
           ca: fs.readFileSync(ssl_path, 'utf-8'),
         },
         ssl: {
           rejectUnauthorized: false,
           ca: fs.readFileSync(ssl_path, 'utf-8'),
         },
       }
     ),
     consumer = new Consumer(
         client,
         [
             { topic: kafka_topic}
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

  // kafka Consumer
  consumer.on('message', function (message) {
     console.log(message);
     socket.emit("FromKafka", message.value);
   });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, host);
console.log('Listening on: ' + host + ':' + port);
