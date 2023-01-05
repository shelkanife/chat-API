if (process.env.NODE_ENV !== "production")
  require("dotenv").config({ path: ".env" });
const express = require("express");
const app = express();
const server = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONT_URL,
  },
});
const socket = require("./utils/socket");
const PORT = 3000;

app.set("port", PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

socket(io);

app.use("/chat/rooms", require("./routes/rooms").router);

server.listen(app.get("port"), () =>
  console.log("Running on port ", app.get("port"))
);
