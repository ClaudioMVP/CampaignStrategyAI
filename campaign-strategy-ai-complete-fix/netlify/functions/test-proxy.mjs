// Simple test endpoint to verify Netlify functions are working
export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const testData = {
      status: 'success',
      message: 'Netlify function is working correctly',
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        openAIKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0
      },
      request: {
        method: event.httpMethod,
        path: event.path,
        headers: Object.keys(event.headers || {}),
        bodyLength: event.body?.length || 0
      }
    };

    console.log('Test endpoint called:', testData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(testData, null, 2)
    };
  } catch (error) {
    console.error('Test endpoint error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: error.message,
        stack: error.stack
      })
    };
  }
};
