const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
router.post("/summarize", async (req, res) => {
  try {

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Content is required"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an AI assistant inside a productivity application.

Summarize the user's notes in a clean and organized format.

Rules:
- Do not say "Here's a summary."
- Do not add any introduction.
- Use short bullet points.
- Keep it under 8 bullets.
- Focus only on the important information.
- If there are tasks, include them under a "Pending Tasks" heading.
- Use markdown formatting.

Notes:

${content}
`
    });

    res.json({
      summary: response.text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong"
    });
  }
});

module.exports = router;