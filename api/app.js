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

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [kafka_host],
  ssl: {
    rejectUnauthorized: false,
    ca: [fs.readFileSync('/etc/ca-kafka/ca-kafka', 'utf-8')],
  },
})

const run = async (socket) => {
  const consumer = kafka.consumer({ groupId: socket.id })
  await consumer.connect()
  await consumer.subscribe({ topic: kafka_topic, fromBeginning: false })

  return consumer
}

io.on("connection", (socket) => {
  console.log("New client connected");
  consumer = run(socket).catch(e => console.error(`[example/consumer] ${e.message}`, e))
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    consumer.disconnect()
  });
  
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
       socket.emit("FromKafka", message.value.toString());
    },
  })
  
});

server.listen(port, host);
console.log('Listening on: ' + host + ':' + port);
