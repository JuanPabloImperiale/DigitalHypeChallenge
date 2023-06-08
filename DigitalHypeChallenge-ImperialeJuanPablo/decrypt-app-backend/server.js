const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");


const app = express();
const port = 5002;

 

app.use(cors());
app.use(bodyParser.json());


const connectToMongoDB = async () => {
  try {
    const client = await MongoClient.connect(
      "mongodb://root:123456789@localhost:27017/DecryptDigitalHype?authSource=admin",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db("DecryptDigitalHype");
    const collection = db.collection("decrypted_messages");
    return { client, collection };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

 
app.post("/decrypt", async (req, res) => {
  const { encryptedMessage } = req.body;
  const decryptedMessage = decryptMessage(encryptedMessage);
  console.log("request message: ", encryptedMessage)
  try {
    await saveDecryptedMessage(decryptedMessage);
    res.status(200).json({ decryptedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
 

const saveDecryptedMessage = async (decryptedMessage) => {
  try {
    const { client, collection } = await connectToMongoDB();
    const _id = uuidv4();

    // Asignar el _id al documento antes de insertarlo
    const newMessage = { ...decryptedMessage, _id };

    await collection.insertOne(newMessage);

    console.log("Decrypt message save it: ", newMessage);

    client.close();

  } catch (error) {

    console.error(error);

  }

};






app.get("/getMessageByFirstName/:firstName", async (req, res) => {
  const firstName = req.params.firstName;
  try {
    const message = await findMessageByFirstName(firstName);
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

 

const findMessageByFirstName = async (firstName) => {
  try {
    const { client, collection } = await connectToMongoDB();
    const message = await collection.findOne({ first_name: firstName });
    client.close();
    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }
};






const decryptMessage = (encryptedMessage) => {
  // considering a dynamic number of zeros
  const [firstName, lastName, id] = encryptedMessage
    .split(/0+/)
    .filter(Boolean);
  return {
    first_name: firstName,
    last_name: lastName,
    id,
  };
};






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});
