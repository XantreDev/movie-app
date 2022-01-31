import react from 'react';

export const generateBaseRequest = (baseUrl, apiKey) => ({
    "baseURL": baseUrl,
    headers: {
        Authorization: `Bearer ${apiKey}`
    },
})
