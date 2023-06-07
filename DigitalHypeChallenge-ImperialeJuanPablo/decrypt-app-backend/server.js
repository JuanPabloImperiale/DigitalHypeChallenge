const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000;

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
    await collection.insertOne(decryptedMessage);
    client.close();
  } catch (error) {
    console.error(error);
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

app.post("/decrypt", async (req, res) => {
  const { encryptedMessage } = req.body;
  const decryptedMessage = decryptMessage(encryptedMessage);

  try {
    await connectToMongoDB(decryptedMessage);
    res.status(200).json({ decryptedMessage }); // Código de estado 200 (OK)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" }); // Código de estado 500 (Error interno del servidor)
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
