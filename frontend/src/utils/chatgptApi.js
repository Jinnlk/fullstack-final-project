export const fetchMoodFromChatGPT = async (prompt) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100,
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch mood from ChatGPT');
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching mood from ChatGPT:', error);
    }
  };
  