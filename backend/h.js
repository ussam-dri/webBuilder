// Import necessary modules
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();  // Load environment variables from .env file

// Initialize GoogleGenerativeAI with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Define the prompt
const prompt = "generate a home.js react homepage";

// Async function to generate content
async function generateStory() {
  try {
    // Get the generative model
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content based on the prompt
    const result = await model.generateContent(prompt);

    // Output the generated response text
    console.log(result.response.text());
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

// Call the function
generateStory();
