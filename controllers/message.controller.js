const Conversation = require("../models/conversation.modle.js");
const Message = require("../models/message.modle.js");
const { getReceiverSocketId, io } = require("../socket/socket.js");
const jwt = require("jsonwebtoken");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    console.log(receiverId);

    jwt.verify(req.token, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        let conversation = await Conversation.findOne({
          participants: { $all: [data.tokenPayload.id, receiverId] },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [data.tokenPayload.id, receiverId],
          });
        }

        const newMessage = new Message({
          senderId: data.tokenPayload.id,
          receiverId,
          message,
        });
        console.log("here:", newMessage);

        if (newMessage) {
          conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        const messageToSend = {
          _id: newMessage._id,
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
          message: newMessage.message,
          createdAt: newMessage.createdAt,
          updatedAt: newMessage.updatedAt,
        };
        res.status(201).json(messageToSend);
      }
    });
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    jwt.verify(req.token, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const conversation = await Conversation.findOne({
          participants: { $all: [data.tokenPayload.id, userToChatId] },
        }).populate({
          path: "messages",
          select: "-image",
        });

        if (!conversation) return res.status(200).json([]);
        let arr = [];
        arr = conversation;
        console.log(arr);
        res.status(200).send(conversation);
      }
    });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
