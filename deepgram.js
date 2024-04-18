const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
const deepgramClient = createClient(process.env.DEEPGRAM_SECRET);

const deepgramLive = deepgramClient.listen.live({
  model: "nova-2-phonecall",
  language: "en-GB",
  encoding: "mulaw",
  sample_rate: 8000,
  punctuate: true,
});
deepgramLive.transcript = "";

deepgramLive.on(LiveTranscriptionEvents.Open, () => {
  console.log("Deepgram connection established...");
  deepgramLive.on(LiveTranscriptionEvents.Transcript, (data) => {
    deepgramLive.transcript += data.channel.alternatives[0].transcript + " ";
    deepgramLive.emit("TranscriptReady", deepgramLive.transcript);
  });
  deepgramLive.on(LiveTranscriptionEvents.Error, (data) => {
    console.log(data);
  });
  deepgramLive.on(LiveTranscriptionEvents.Close, () => {
    console.log("Deepgram connection closed...");
  });

  deepgramLive.on("ClearTranscript", () => {
    deepgramLive.transcript = "";
  });
});

deepgramLive.close = function () {
  deepgramLive.send(JSON.stringify({ type: "CloseStream" }));
};

exports.deepgram = deepgramLive;
