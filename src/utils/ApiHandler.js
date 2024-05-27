import axios from 'axios';

export function getHeaderConfig(contentType, apiKey){
    if (contentType == null) {
        contentType = 'application/json';
    }
    if (!apiKey){
        apiKey = localStorage.getItem(import.meta.env.VITE_TOKEN_NAME);
    }
    let config = {
        headers: {
            Authorization: "Bearer " + apiKey,
            'content-type': contentType
        }
    }
    return config;
}
  
export async function getChatGPTResponse(prompt){
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        }, getHeaderConfig(null, ''));
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching chat response:', error);
        throw error;
    }
};