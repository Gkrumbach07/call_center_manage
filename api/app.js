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

function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// kafka setup
const kafka_host = process.env.KAFKA_HOST;
const kafka_topic = process.env.KAFKA_TOPIC;
const ssl_path = process.env.SSL_PATH;

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'audio-decoder',
  brokers: [kafka_host],
  ssl: {
    rejectUnauthorized: false,
    ca: [fs.readFileSync(ssl_path + '/ca.crt', 'utf-8')],
    key: fs.readFileSync(ssl_path + '/user.key', 'utf-8'),
    cert: fs.readFileSync(ssl_path + '/user.crt', 'utf-8'),
    passphrase: fs.readFileSync(ssl_path + '/user.password', 'utf-8')
  },
})


const consumer = kafka.consumer({ groupId: 'audio-decoder-consumer' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: kafka_topic, fromBeginning: false })

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if(message.value !== null && message.value !== undefined) {
        const m = JSON.parse(message.value)
        console.log(m)
        if(m["id"]
        && m['sentence']
        && m["quality"]
        && m["nouns"]) {
          console.log(m['id'], m['sentence'])
          io.emit("FromKafka", JSON.stringify(m));
        }
      }
    },
  })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });

});

server.listen(port, host);
console.log('Listening on: ' + host + ':' + port);
