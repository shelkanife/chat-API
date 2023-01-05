const router = require("express").Router();
let activeRooms = [];

const getRoomInfo = (roomName) => {
  const filteredRooms = activeRooms.filter((room) => room.name === roomName);
  if (filteredRooms.length) return filteredRooms;
  return null;
};

const getRoomUsers = (roomName) => {
  const roomInfo = getRoomInfo(roomName);
  if (roomInfo === null) return [];
  else {
    return roomInfo[0].users;
  }
};

router.post("/create", (req, res) => {
  const { roomName, nickname } = req.body;
  const roomInfo = getRoomInfo(roomName);
  if (roomInfo !== null)
    return res.status(200).send({
      msg: "There is already a room with this name, please select another",
    });
  else {
    const newRoom = {
      id: `${roomName}${Date.now()}`,
      name: roomName,
      users: [nickname],
    };
    activeRooms.push(newRoom);
    return res.status(201).send({ msg: "Room created" });
  }
});

router.get("/", (req, res) => {
  const roomNames = activeRooms.map((room) => room.name);
  return res.status(200).send({ roomNames });
});

router.post("/join", (req, res) => {
  const { roomName } = req.body;
  const roomInfo = getRoomInfo(roomName);
  if (roomInfo === null)
    return res.status(404).send({ msg: "This room does not exists anymore" });
  else {
    const { nickname } = req.body;
    if (!roomInfo[0].users.some((user) => user === nickname)) {
      roomInfo[0].users.push(nickname);
      return res.status(200).send();
    }
  }
  return res.status(403).send({
    msg: "There is a user with the same name inside this room. Please select another one.",
  });
});

router.post("/:roomName/disconect", (req, res) => {
  const roomInfo = getRoomInfo(req.body.roomName);
  if (roomInfo === null) return res.status(404).send();
  else {
    const roomUsers = roomInfo[0].users;
    const filteredUsers = roomUsers.filter(
      (username) => username !== req.body.nickname
    );
    if (filteredUsers.length) roomInfo[0].users = filteredUsers;
    else {
      activeRooms = activeRooms.filter((room) => room.id !== roomInfo[0].id);
    }
    return res.status(200).send();
  }
});

router.get("/:roomName", (req, res) => {
  const roomInfo = getRoomInfo(req.params.roomName);
  if (roomInfo) return res.status(200).send();
  return res.status(404).send();
});

module.exports = { router, getRoomUsers };
