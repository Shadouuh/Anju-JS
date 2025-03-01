# AnjuJS

AnjuJS is a lightweight and efficient library for password encryption. It allows developers to create customizable encryption systems with salt, preferences, and a security key. Designed for fast, secure encryption, AnjuJS is easy to implement and provides a flexible solution for password management.

## Features

- **Customizable Encryption**: Set your own encryption preferences, salt, and security key.
- **Fast & Secure**: Optimized for performance while maintaining the highest security standards.
- **Flexible Integration**: Simple API that can be seamlessly integrated into any project.
- **Environment Configuration**: Easily manage settings through environment variables for better security and scalability.

## Installation

To install AnjuJS, you can use npm:
npm install anju-js

## Usage
### Example: Encryption and Decryption
Here’s an example of how to use AnjuJS for encrypting and decrypting a message:

const anju = require("anju-js");
require('dotenv').config();

// Configuration
const config = {
  preference: process.env.PREFERENCE,
  rounds: 32,
  salt: process.env.SALT,
  securityKey: process.env.SECURITY_KEY,
};

// Message to encrypt
const message = "EncryptedMessage";

// Encrypt the message
const encryptedMessage = anju.encrypt(config, message, process.env.SECURITY_KEY);
console.log("The encrypted message is: " + encryptedMessage);

// Decrypt the message
const decryptedMessage = anju.decrypt(config, encryptedMessage, process.env.SECURITY_KEY);
console.log("The decrypted message is: " + decryptedMessage);

## How It Works:
- Configuration: The config object allows you to define encryption settings such as preference, salt, rounds, and securityKey—which can be safely loaded from your environment variables (using the dotenv package for example).
- encrypt(config, message, key): Encrypts the provided message using the configuration and a security key.
- decrypt(config, encryptedMessage, key): Decrypts the previously encrypted message using the same configuration and security key.

Make sure to set up your .env file with the necessary environment variables like PREFERENCE, SALT, and SECURITY_KEY.

## Contributing
We welcome contributions from the community! To contribute to AnjuJS, please follow these steps:

- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Commit your changes (git commit -am 'Add new feature').
- Push to the branch (git push origin feature-branch).
- Create a new pull request.

Please feel free to open an issue if you encounter any bugs, need help, or have suggestions for new features.
