const express = require("express"); // Import Express.js for handling HTTP requests
const OpenAI = require("openai"); // Import OpenAI library for interacting with the OpenAI API
const {
  GenerativeModel,
  GoogleGenerativeAI,
} = require("@google/generative-ai"); // Import Google Generative AI SDK for interacting with Google's models
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const systemPrompt = `You are FitBot, an advanced AI fitness assistant dedicated to helping users achieve their health and fitness goals. Your primary mission is to provide personalized fitness advice, create tailored workout routines, design effective diet plans, and offer guidance on weight management. Ensure that all recommendations are based on the latest scientific research, user preferences, and individual fitness levels. Your responses should be supportive, motivational, and focused on promoting a healthy lifestyle.

Objectives:
Personalized Workout Routines:
Design customized workout plans based on user goals (e.g., muscle gain, fat loss, endurance) and fitness levels.
Offer exercises for different muscle groups, suggest workout schedules, and provide tips on proper form and technique.

Diet and Nutrition Planning:
Create personalized diet plans that align with user goals (e.g., weight loss, muscle gain, maintenance).
Offer advice on macronutrient distribution, meal timing, and healthy food choices.
Accommodate dietary preferences, restrictions, and cultural considerations.

Weight Management:
Provide guidance on effective weight management strategies, including calorie tracking, portion control, and lifestyle modifications.
Support users with strategies to overcome plateaus and sustain long-term progress.

Fitness Consulting:
Answer general fitness-related questions about exercise science, training methods, or supplements.
Address common fitness myths and provide evidence-based information.
Help users stay motivated and consistent with their fitness routines.

Health and Safety:
Ensure that all advice prioritizes user safety, especially for beginners or those with medical conditions.
Recommend consulting a healthcare professional when necessary.`;
// Initialize the Google Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genAiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemPrompt,
});
const startChat = async (req, res) => {
  try {
    const messages = req.body.contents; // Get the 'contents' array from the request body
    console.log("Received messages:", messages); // Log for debugging

    // Validate that 'messages' is an array and has the necessary content
    if (!Array.isArray(messages) || messages.length < 1) {
      return res.status(400).json({
        error: "Invalid input",
        text: "The 'contents' array is missing or empty.",
      });
    }

    // Use slice to get all but the first and last messages for history
    const history = messages.slice(1, messages.length - 1);

    // Send the last message to the AI model
    const theChat = genAiModel.startChat({
      history: history,
    });

    const theResult = await theChat.sendMessage(
      messages[messages.length - 1].parts[0].text
    );
    const theResponse = theResult.response;
    const theText = await theResponse.text();

    // Send back the response from the AI model
    res.status(200).json(theText);
  } catch (error) {
    console.error("Error handling the chat request:", error);
    res.status(400).json({
      error: error.message,
      text: "An error occurred while processing your request.",
    });
  }
};

module.exports = { startChat };
// const startChat = async (req, res) => {
//   try {
//     const messages = req.body;
//     const userMessage = messages[messages.length - 1]?.content || "";

// const requestBody = {
//   contents: [
//     {
//       role: "user",
//       parts: [{ text: userMessage }],
//     },
//   ],
// };

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestBody),
//       }
//     );

//     const data = await response.json();
//     const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
//     if (!responseText) {
//       throw new Error("Invalid response from API");
//     }

//     res.status(200).json({ text: responseText });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(400).json({
//       error: error.message,
//       text: "An error occurred while processing your request.",
//     });
//   }
// };

// module.exports = { startChat };
