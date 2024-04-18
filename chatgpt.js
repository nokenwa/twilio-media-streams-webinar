const { OpenAI } = require("openai");

const gpt4Reply = async function (incomingMessage) {
  const openai = new OpenAI();

  const prompts = [
    {
      role: "system",
      content:
        "You are a helping assistant giving information about arsenal football club. Answer the questions in 1 sentence.",
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 1.2,
    frequency_penalty: 0.2,
    messages: [...prompts, { role: "user", content: incomingMessage }],
    temperature: 0.2,
    frequency_penalty: 0.7,
  });
  const reply = response.choices[0];

  console.log("Received AI reply: " + reply.message.content);
  return reply.message.content;
};
exports.gpt4Reply = gpt4Reply;
