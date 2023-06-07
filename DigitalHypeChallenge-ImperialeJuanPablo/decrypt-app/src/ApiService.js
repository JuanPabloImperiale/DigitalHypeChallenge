import axios from "axios";

const urlApiBackend = "http://localhost:5000/decrypt";

const ApiService = {
  decryptMessage: async (encryptedMessage) => {
    try {
      const response = await axios.post(urlApiBackend, {
        encryptedMessage,
      });
      return response.data.decryptedMessage;
    } catch (error) {
      throw error;
    }
  },
};

export default ApiService;