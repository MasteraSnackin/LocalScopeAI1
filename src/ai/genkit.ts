import axios from 'axios';

export const ai = {
  async generate({ prompt }) {
    // Replace this with your Perplexity API endpoint and key if needed
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar-pro',
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return { text: response.data.choices[0].message.content };
  }
};
