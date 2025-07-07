const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = 'AIzaSyB4L51zVkZZMfd2CqFC-dKYsfPM3TZUFqg';

app.post('/api/generate-story', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    res.json(response.data);
  } catch (err) {
    if (err.response && err.response.data) {
      res.status(500).json({ error: err.response.data.error, details: err.response.data.details });
    } else {
      res.status(500).json({ error: err.message, details: err.response?.data });
    }
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 