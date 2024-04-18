# Project Name

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

This project demonstrates how to connect a Twilio voice call to a web server, transcribe the audio using Deepgram, generate a response to questions with ChatGPT, and generate an audio reply with Eleven Labs.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-project.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-project
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up the required accounts and credentials:

   - Twilio: Sign up for an account at [https://www.twilio.com](https://www.twilio.com) and buy a phone number

   - Deepgram: Sign up for an account at [https://www.deepgram.com](https://www.deepgram.com) and obtain your API key.

   - Eleven Labs: Sign up for an account at [https://www.elevenlabs.com](https://www.elevenlabs.com) and obtain your API key.

   - ChatGPT: Sign up for an account at [https://www.chatgpt.com](https://www.chatgpt.com) and obtain your API key.

5. Configure the project:

   - Create a `.env` file in the project root directory.

   - Add the following environment variables to the `.env` file:

     ```plaintext
     TWILIO_ACCOUNT_SID=your-twilio-account-sid
     TWILIO_AUTH_TOKEN=your-twilio-auth-token
     DEEPGRAM_API_KEY=your-deepgram-api-key
     ELEVENLABS_API_KEY=your-elevenlabs-api-key
     CHATGPT_API_KEY=your-chatgpt-api-key
     ```

6. Start the project:

   ```bash
   npm start
   ```

7. Use ngrok to share your local server over a public URL:

   - Download and install ngrok from [https://ngrok.com](https://ngrok.com).

   - Start ngrok and expose your local server:

     ```bash
     ngrok http 3000
     ```

   - Copy the ngrok URL (e.g., `https://abcdefg.ngrok.io`).

8. Connect Twilio to your ngrok URL:

   - Go to your Twilio account dashboard.

   - Navigate to the "Phone Numbers" section.

   - Click on the phone number you want to use.

   - In the "Voice & Fax" section, update the "A Call Comes In" webhook with your ngrok URL followed by `/voice` (e.g., `https://abcdefg.ngrok.io/voice`).

   - Save the changes.

## Usage

Instructions on how to use the project and any relevant examples.

When you speak on the phone, you should see your words appear in the console. Ask a question, and you should see a ChatGPT-generated response. This response will play back over the phone.

## License

This project is licensed under the [MIT License](LICENSE).

For any questions or inquiries about the webinar, please contact me at nokenwa@twilio.com.
