const socketIo = require("socket.io");
const schema = require("../database/schema");
const Message = schema.Message;

const connection = async function (server) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("sendMessage", async (data) => {
      const message = new Message(data);
      await message.save();
      io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

let getMsgs = async function (req, res, next) {
  let body = req.body;
  let data = {};
  try {
    data.messages = await Message.find();

    return res.status(200).json({
      statusMessage: "Messages get successfully!",
      data: data,
    });
  } catch (error) {
    return res.status(501).json({
      statusMessage: "error",
      data: error,
    });
  }
};
module.exports = {
  connection,
  getMsgs,
};
