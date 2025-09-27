// Simple test script to verify the serverless function
const { handler } = require('./netlify/functions/openai-proxy.mjs');

async function testFunction() {
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({
      endpoint: '/chat/completions',
      data: {
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Say hello' }],
        temperature: 0.7,
        max_tokens: 50
      }
    })
  };

  try {
    const result = await handler(event, {});
    console.log('Function test result:', result.statusCode);
    if (result.statusCode === 200) {
      console.log('✅ Function works correctly');
    } else {
      console.log('❌ Function returned error:', result.body);
    }
  } catch (error) {
    console.error('❌ Function test failed:', error.message);
  }
}

testFunction();
