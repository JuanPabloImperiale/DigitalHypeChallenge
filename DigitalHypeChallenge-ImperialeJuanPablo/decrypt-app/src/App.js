import React, { useState, useEffect } from "react";
import Spinner from './Spinner';
import axios from "axios";
import "./App.css";

const urlApiBackend = "http://localhost:5000/decrypt"

function App() {
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleDecrypt = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(urlApiBackend, {
        encryptedMessage,
      });
      setDecryptedMessage(response.data.decryptedMessage);
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    //validation for empty string in input, disable and enable button
    setIsInputEmpty(encryptedMessage.trim() === "");
  }, [encryptedMessage]);

  return (
    <div className="app">
      <div className="content">
        <h1 className="title">Tech Challenge for Fullstack Devs.</h1>
        <h2 className="subtitle">DigitalHype by Juan Pablo Imperiale</h2>
        <input
          type="text"
          placeholder="Enter encrypted message"
          value={encryptedMessage}
          onChange={(e) => setEncryptedMessage(e.target.value)}
        />
        <button
          id="decryptButton"
          onClick={handleDecrypt}
          disabled={isInputEmpty}
        >
          Decrypt
        </button>
        {!isLoading && decryptedMessage && (
         <div className="card">
         <h2 className="card-title">Decrypted Message:</h2>
         <div className="card-content">
           <p className="card-subtitle">First Name: {decryptedMessage.first_name || "Emtpy First Name"}</p>
           <p className="card-subtitle">Last Name: {decryptedMessage.last_name || "Empty Last Name"}</p>
           <p className="card-subtitle">ID: {decryptedMessage.id || "Empty ID"}</p>
         </div>
       </div>
        )}
        {isLoading && <Spinner />}
      </div>
    </div>
  );
}

export default App;
