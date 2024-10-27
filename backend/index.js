const express = require('express');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors'); // Import the cors module
const { exec } = require('child_process');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Initialize GoogleGenerativeAI with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Async function to generate content based on prompt
async function generateContent(prompt) {
  try {
    // Get the generative model
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content based on the prompt
    const result = await model.generateContent(prompt);

    return result.response.text();  // Return the generated text
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error('Content generation failed');
  }
}
app.post('/ready',async (req,res)=>{
  const {siteName}=req.body;

  // Command to create a new React app
  const command = `npx create-react-app ./${siteName}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Standard Error: ${stderr}`);
      return;
    }
    res.status(200).send("react app created successfuly");
    console.log(`Standard Output:\n${stdout}`);
  });
  
})
// POST endpoint to receive prompt and siteName
app.post('/generate-js', async (req, res) => {
  const { prompt, siteName } = req.body;

  if (!prompt || !siteName) {
    return res.status(400).send("Both 'prompt' and 'siteName' are required");
  }

  try {
    // Generate content from the prompt
    const jsContent = await generateContent(prompt);

    // Define folder and file paths
    const folderPath = path.join(__dirname, siteName+'/src');
    const filePath = path.join(folderPath, 'App.js');

    // Create folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`Folder '${siteName}' created.`);
    }

    // Write the generated content to a .js file
    fs.writeFile(filePath, jsContent, (err) => {
      if (err) throw err;
      console.log(`File 'App.js' created inside '${siteName}'.`);
      res.status(200).send(`File created successfully in ${siteName}`);
    });
  } catch (error) {
    res.status(500).send("Error generating file");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
