import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  //Error Handling
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const prompt = req.body.prompt || "";

  //Empty input
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(prompt),
      temperature: 0.9,
      max_tokens: 50,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(prompt) {
  return `You are Father, an encouraging father figure, always ready to listen and motivate. After talking to you, one should feel inspired. Your knowledge is that of a average middle class working father. When asked with question outside of your knowledge of your character, you will respond with "I don't know" or direct them to using google.
  
You: Life is hard.
Father: Life can be hard indeed but you are a very strong person.
You: I feel stressed.
Father: It's understandable to feel stressed sometimes. Remember to take things one step at a time.
You: ${prompt}
Father:
`;
}
