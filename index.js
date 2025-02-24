const anju = {
  encrypt: function (config, data, securityKey) {
    try {
      // Handle of Errors
      if (!config || typeof config !== "object") {
        throw new Error("El parámetro 'config' debe ser un objeto válido.");
      }
      if (!data || typeof data !== "string") {
        throw new Error("El parámetro 'data' debe ser una cadena válida.");
      }
      if (!securityKey || typeof securityKey !== "string") {
        throw new Error(
          "El parámetro 'securityKey' debe ser una cadena válida."
        );
      }
      if (
        !config.securityKey ||
        !config.preference ||
        !config.salt ||
        !config.rounds
      ) {
        throw new Error(
          "El objeto 'config' debe contener las propiedades: securityKey, preference, salt y rounds."
        );
      }
      if (config.securityKey !== securityKey) {
        throw new Error("La clave de seguridad proporcionada no es correcta.");
      }


      const letters = [
        ..."0123456789abcdefghijklmnopqrstuvwxyzñçABCDEFGHIJKLMNOPQRSTUVWXYZÑÇ",
      ];
      // # --> Custom Cases <-- # //
      const cases = createCases(config.preference);

      // AnjuCase: Encrypted message
      let anjuCase = "";
      // SaltedCase: Encrypted message with salt
      let saltedCase = "";
      // Encryption of the message and the salt
      for (let i of data) {
        for (let a = 0; a < letters.length; a++) {
          if (i == letters[a]) {
            anjuCase += cases[a];
          }
        }
      }
      for (let i of config.salt) {
        for (let a = 0; a < letters.length; a++) {
          if (i == letters[a]) {
            saltedCase += cases[a];
          }
        }
      }

      // # --> Interleave Process <-- # //
      const inverted = anjuCase.split("").reverse().join("");
      let interleavedData = interleave(anjuCase, inverted);
      interleavedData = interleavedData.join("");
      let saltedAnjuCase = interleave(interleavedData, saltedCase);
      saltedAnjuCase = saltedAnjuCase.join("");

      // # --> Round Iteration <-- # //
      let roundsCounter = 0;
      while (roundsCounter < config.rounds) {
        saltedAnjuCase = leftRotate(saltedAnjuCase);
        roundsCounter++;
      }
      return saltedAnjuCase;
    } catch (error) {
      console.error("Error en el proceso de desencriptación:", error.message);
      return null; 
    }
  },
  decrypt: function (config, data, securityKey) {
    try {
      // Handle of Errors
      if (!config || typeof config !== "object") {
        throw new Error("El parámetro 'config' debe ser un objeto válido.");
      }
      if (!data || typeof data !== "string") {
        throw new Error("El parámetro 'data' debe ser una cadena válida.");
      }
      if (!securityKey || typeof securityKey !== "string") {
        throw new Error("El parámetro 'securityKey' debe ser una cadena válida.");
      }
      if (config.securityKey !== securityKey) {
        throw new Error("La clave de seguridad proporcionada no es correcta.");
      }

      const letters = [
        ..."0123456789abcdefghijklmnopqrstuvwxyzñçABCDEFGHIJKLMNOPQRSTUVWXYZÑÇ",
      ];
      // # --> Custom Cases <-- # //
      const cases = createCases(config.preference);
      // # --> Counter Round Iterations <-- # //
      let roundsCounter = 0;
      while (roundsCounter < config.rounds) {
        data = rightRotate(data);
        roundsCounter++;
      }
      // # --> Have the encrypted message without the salt <-- # //
      let encryptedMessage = [];
      for (let i = 0; i <= data.length; i += 4) {
        encryptedMessage.push(data[i]);
      }
      // # --> Slice the message in groups of 4 <-- # //
      const dividedEncryptedMessage = [];
      for (let i = 0; i < encryptedMessage.length; i += 4) {
        // Junta los elementos del subarray en un número
        const group = encryptedMessage.slice(i, i + 4).join("");
        dividedEncryptedMessage.push(group); // Convierte a número y lo agrega al resultado
      }
      // # --> Decrypt the Message <-- # //
      let decryptedMessage = "";
      for (let i of dividedEncryptedMessage) {
        for (let a = 0; a < cases.length; a++) {
          if (i == cases[a]) {
            decryptedMessage += letters[a];
          }
        }
      }
      return decryptedMessage;
    } catch(error) {
      console.error("Error en el proceso de desencriptación:", error.message);
      return null;
    }
  },
};

// # --> Custom Cases Function <-- # //
function createCases(preference) {
  if (!preference || typeof preference !== "string") {
    throw new Error("El parámetro 'preference' debe ser una cadena válida.");
  }
  const cases = [];
  for (let i = 0; i < preference.length; i += 4) {
    cases.push(preference.slice(i, i + 4));
  }
  return cases;
}

// # --> Rounds managment Function <-- # //
function leftRotate(encryption) {
  return encryption.slice(1) + encryption[0];
}
function rightRotate(encryption) {
  return encryption.slice(-1) + encryption.slice(0, -1);
}

// # --> Interleave Function <-- # //
function interleave(normalCase, contraCase) {
  if (!normalCase || !contraCase) {
    throw new Error("Los parámetros 'normalCase' y 'contraCase' no pueden ser nulos.");
  }
  const result = [];
  const maxLength = Math.max(normalCase.length, contraCase.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < normalCase.length) {
      result.push(normalCase[i]);
    }
    if (i < contraCase.length) {
      result.push(contraCase[i]);
    }
  }
  return result;
}

module.exports = anju;
