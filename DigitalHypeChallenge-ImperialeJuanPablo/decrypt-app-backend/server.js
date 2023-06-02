const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/decrypt", (req, res) => {
  const { encryptedMessage } = req.body;
  const decryptedMessage = decryptMessage(encryptedMessage);
  // Save the decrypted message in MongoDB
  saveDecryptedMessage(decryptedMessage);
  res.json({ decryptedMessage });
});

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

const saveDecryptedMessage = async (decryptedMessage) => {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://decryptApp:NlsTN0ZhSNhBJavl@cluster0.yfbi4l8.mongodb.net/test",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db("decryptApp");
    const collection = db.collection("decrypted_messages");
    await collection.insertOne(decryptedMessage);
    client.close();
  } catch (error) {
    console.error(error);
  }
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
