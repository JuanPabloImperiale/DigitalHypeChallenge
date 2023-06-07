import React, { useState, useEffect } from "react";
import Spinner from './Spinner';
import "./App.css";
import ApiService from "./ApiService";

const encryptedMessageRegex = /^([^\d]+)0+([^\d]+)0+(\d+)$/;

function App() {
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [error, setError] = useState("");
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleDecrypt = async () => {
    try {
      setIsLoading(true);
      const decryptedMessage = await ApiService.decryptMessage(encryptedMessage);
      setDecryptedMessage(decryptedMessage);
      setError(""); 
    } catch (error) {
      console.error(error);
      setError("An error occurred trying connect to API. Please try again."); // Set error message
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isInputEmpty = encryptedMessage.trim() === "";
  
    // Validar el formato del mensaje con una expresión regular
    const isValidFormat = encryptedMessageRegex.test(encryptedMessage);
  
    setIsInputEmpty(isInputEmpty || !isValidFormat);
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
        {error && <p className="error">{error}</p>}
        {!error && !isLoading && decryptedMessage && (
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
