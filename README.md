# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# CPSC 329 Cryptography Tools

## Description

This project is a web application built with React that provides several interactive tools for exploring and understanding fundamental concepts in cryptography. It allows users to encrypt, decrypt, and analyze text using various ciphers and techniques.

## Features

The application includes the following cryptography tools:

* **Caesar Cipher Translator:**
    * Encrypt or decrypt text using the classic Caesar cipher.
    * Allows users to specify a shift value between 1 and 25.
    * Includes an explanation of how the Caesar cipher works.
* **Frequency Analysis Tool:**
    * Analyzes the frequency of letters in a given text.
    * Displays the results as a bar chart for visualization.
    * Offers options for case-sensitivity, ignoring non-alphabetic characters, and analyzing every K-th letter with a specified offset (useful for polyalphabetic ciphers).
    * Provides educational context on frequency analysis.
* **Established Ciphers:**
    * Encrypt and decrypt text using:
        * One-Time Pad (OTP) with XOR operation.
        * AES-GCM (Advanced Encryption Standard - Galois/Counter Mode) using the browser's Web Crypto API.
    * Requires a key/password for operations. AES uses PBKDF2 for key derivation from the password.
    * Supports different output/input formats (Hex, Base64) for ciphertext.
    * Includes explanations of OTP and AES-GCM, including concepts like IV and key derivation.

## Tech Stack

* React
* JavaScript
* JSX
* CSS
* Chart.js (for Frequency Analysis visualization)
* Web Crypto API (for AES-GCM implementation)

## Project Structure

* `src/`
    * `components/`: Contains the individual React components for each cryptography tool.
        * `CaesarCipher.jsx`
        * `FrequencyAnalysis.jsx`
        * `EstablishedCiphers.jsx`
    * `App.js`: The main application component, manages tabs and routing between tools.
    * `index.js`: The entry point for the React application.
    * `index.css`: Global styles for the application.
    * `reportWebVitals.js`: For measuring web performance metrics.
    * `setupTests.js`: Jest test setup.

## Getting Started (Standard React Setup)

To run this project locally (assuming you have Node.js and npm installed):

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
    This will typically open the application in your default web browser at `http://localhost:3000`.