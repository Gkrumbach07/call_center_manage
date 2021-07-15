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

const kafka = require('kafka-node'),
  Consumer = kafka.Consumer,
  client = new kafka.KafkaClient({
    kafkaHost: kafka_host,
    sslOptions: {
      rejectUnauthorized: false,
      ca: [fs.readFileSync(ssl_path + '/ca.crt', 'utf-8')],
      key: fs.readFileSync(ssl_path + '/user.key', 'utf-8'),
      cert: fs.readFileSync(ssl_path + '/user.crt', 'utf-8'),
},
  }),
  consumer = new Consumer(
      client,
      [
          { topic: kafka_topic}
      ],
      {
          autoCommit: false
      }
  );



const run = async () => {
  consumer.on('message', async function (message) {
      if(message.value !== null && message.value !== undefined) {
        const m = JSON.parse(message.value)
        if(m["id"]
        && m['sentence']
        && m["quality"]
        && m["nouns"]) {
          io.emit("FromKafka", JSON.stringify(m));
        }
      }
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
