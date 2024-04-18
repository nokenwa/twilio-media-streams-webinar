require("dotenv").config();
const { WebSocket } = require("ws");
const voiceId = "1TE7ou3jyxHsyRehUuMB"; // replace with your voice_id
const model = "eleven_turbo_v2";
const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}&output_format=ulaw_8000`;

const elevenLabsWebSocket = new WebSocket(wsUrl);

elevenLabsWebSocket.onopen = function (event) {
  console.log("Eleven Labs connection Opened");
  const bosMessage = {
    text: " ",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.8,
    },
    generation_config: {
      chunk_length_schedule: [50],
    },
    xi_api_key: process.env.ELEVEN_LABS_API_KEY, // replace with your API key
  };

  elevenLabsWebSocket.send(JSON.stringify(bosMessage));
};

elevenLabsWebSocket.generateAudio = async function (text) {
  // 3. Send the input text message ("Hello World")
  const textMessage = {
    text: `${text} `,
    flush: true,
  };
  await elevenLabsWebSocket.send(JSON.stringify(textMessage));
};

elevenLabsWebSocket.onmessage = function (event) {
  const response = JSON.parse(event.data);

  if (response.audio) {
    elevenLabsWebSocket.emit("AudioReceived", response.audio);
  }

  if (response.isFinal) {
    console.log("Audio Generated..");
  }
};

// Handle errors
elevenLabsWebSocket.onerror = function (error) {
  console.error(`WebSocket Error: ${error}`);
};

// Handle socket closing
elevenLabsWebSocket.onclose = function (event) {
  if (event.wasClean) {
    console.log(event.reason);
    console.info(
      `Connection closed cleanly, code=${event.code}, reason=${event.reason}`,
    );
  } else {
    console.warn("Connection died");
  }
};

elevenLabsWebSocket.close = async function () {
  const EOS = {
    text: "",
  };
  await elevenLabsWebSocket.send(JSON.stringify(EOS));
  console.log("ElevenLabs Connection closed...");
};

exports.elevenLabs = elevenLabsWebSocket;
