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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
