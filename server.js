require("dotenv").config();
const express = require("express");
const { WebSocketServer } = require("ws");
const app = express();
const server = require("node:http").createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 3000;

const fs = require("fs");
const wavefile = require("wavefile");
let audioFile = fs.readFileSync("./audio.wav");

const wav = new wavefile.WaveFile(audioFile);
wav.toBitDepth(8);
wav.toSampleRate(8000);
wav.toMuLaw();

const audioData = Buffer.from(wav.data.samples).toString("base64");

app.all("/twilio", async (req, res) => {
  res.type("text/xml");
  res.send(`<Response>
    <Connect>
      <Stream url="wss://nokenwa.ngrok.io" name="webinar" track="inbound_track"/>
    </Connect>
  </Response>`);
});

wss.on("connection", (ws) => {
  let streamSid;

  const { deepgram } = require("./deepgram");
  const { elevenLabs } = require("./elevenlabs");
  const { gpt4Reply } = require("./chatgpt");

  deepgram.on("TranscriptReady", async (transcript) => {
    console.log(`Caller: ${transcript}`);

    if (transcript.includes("?")) {
      const gptReply = await gpt4Reply(transcript);
      elevenLabs.generateAudio(gptReply);
      deepgram.emit("ClearTranscript");
    }
  });

  //Send Audio to Twilio when Generated Audio from Eleven Labs is Complete
  elevenLabs.on("AudioReceived", (audio) => {
    ws.send(
      JSON.stringify({
        event: "media",
        streamSid,
        media: {
          payload: audio,
        },
      }),
    );
  });

  ws.on("message", (message) => {
    const msg = JSON.parse(message);

    switch (msg.event) {
      case "start":
        console.log("Twilio Media Starting");
        streamSid = msg.start.streamSid;

        // Uncomment to Play audio file loaded from file system
        // ws.send(
        //   JSON.stringify({
        //     event: "media",
        //     streamSid,
        //     media: {
        //       payload: audioData,
        //     },
        //   }),
        // );

        break;
      case "media":
        if (deepgram.getReadyState() === 1) {
          const audio = Buffer.from(msg.media.payload, "base64");
          deepgram.send(audio);
        }
        break;
      case "stop":
        console.log("Phone Call has ended");
        break;
    }
  });
});

server.listen(PORT, () => {
  console.log(`App listening at PORT ${PORT}`);
});
