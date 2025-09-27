// Netlify serverless function to proxy OpenAI API calls
// Ultra-robust version with comprehensive error handling

export const handler = async (event, context) => {
  // Enable CORS for all origins
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('=== Function Start ===');
    console.log('Event:', {
      httpMethod: event.httpMethod,
      headers: Object.keys(event.headers || {}),
      bodyLength: event.body?.length || 0,
      path: event.path,
      queryStringParameters: event.queryStringParameters
    });

    // Get the OpenAI API key from environment variables
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    console.log('Environment check:', {
      hasApiKey: !!OPENAI_API_KEY,
      keyLength: OPENAI_API_KEY ? OPENAI_API_KEY.length : 0,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    });
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'OpenAI API key not configured',
          debug: 'Environment variable OPENAI_API_KEY is missing'
        })
      };
    }

    // Validate request body exists
    if (!event.body) {
      console.error('No request body provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'No request body provided',
          debug: 'Request body is null or undefined'
        })
      };
    }

    // Parse the request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
      console.log('Request body parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError.message);
      console.error('Raw body:', event.body?.substring(0, 500));
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid JSON in request body',
          debug: parseError.message
        })
      };
    }

    const { endpoint, data } = requestBody;

    console.log('Request details:', { 
      endpoint, 
      dataKeys: Object.keys(data || {}),
      hasData: !!data
    });

    // Validate the endpoint
    const allowedEndpoints = ['/chat/completions', '/images/generations'];
    if (!endpoint || !allowedEndpoints.includes(endpoint)) {
      console.error('Invalid endpoint:', endpoint);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid endpoint',
          debug: `Endpoint '${endpoint}' not in allowed list: ${allowedEndpoints.join(', ')}`
        })
      };
    }

    // Validate required data
    if (!data) {
      console.error('Missing data in request');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing data in request',
          debug: 'The data field is required in the request body'
        })
      };
    }

    // Additional validation for chat completions
    if (endpoint === '/chat/completions') {
      if (!data.messages || !Array.isArray(data.messages) || data.messages.length === 0) {
        console.error('Invalid messages array for chat completions');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid messages for chat completion',
            debug: 'messages must be a non-empty array'
          })
        };
      }
    }

    // Additional validation for image generation
    if (endpoint === '/images/generations') {
      if (!data.prompt || typeof data.prompt !== 'string' || data.prompt.trim().length === 0) {
        console.error('Invalid prompt for image generation');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid prompt for image generation',
            debug: 'prompt must be a non-empty string'
          })
        };
      }
    }

    // Make the request to OpenAI API using built-in fetch
    const openaiUrl = `https://api.openai.com/v1${endpoint}`;
    console.log(`Making request to: ${openaiUrl}`);
    
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'User-Agent': 'Campaign-Strategy-AI/1.0'
      },
      body: JSON.stringify(data)
    };

    console.log('Fetch options:', {
      method: fetchOptions.method,
      headers: Object.keys(fetchOptions.headers),
      bodyLength: fetchOptions.body.length,
      url: openaiUrl
    });

    let response;
    try {
      response = await fetch(openaiUrl, fetchOptions);
      console.log('Fetch completed, response status:', response.status, response.statusText);
    } catch (fetchError) {
      console.error('Fetch error:', fetchError.message);
      console.error('Fetch error stack:', fetchError.stack);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to connect to OpenAI API',
          debug: fetchError.message,
          type: 'FETCH_ERROR'
        })
      };
    }

    // Check if response is ok
    if (!response.ok) {
      console.error('OpenAI API returned error status:', response.status, response.statusText);
      
      let errorData;
      try {
        errorData = await response.json();
        console.error('OpenAI error details:', errorData);
      } catch (jsonError) {
        console.error('Failed to parse error response as JSON:', jsonError.message);
        const textResponse = await response.text();
        console.error('Raw error response:', textResponse.substring(0, 1000));
        
        return {
          statusCode: response.status,
          headers,
          body: JSON.stringify({ 
            error: 'OpenAI API error (non-JSON response)',
            status: response.status,
            statusText: response.statusText,
            debug: textResponse.substring(0, 500)
          })
        };
      }

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'OpenAI API error', 
          details: errorData,
          status: response.status,
          statusText: response.statusText
        })
      };
    }

    // Parse successful response
    let responseData;
    try {
      responseData = await response.json();
      console.log('Response parsed successfully');
    } catch (jsonError) {
      console.error('Failed to parse successful response as JSON:', jsonError.message);
      const textResponse = await response.text();
      console.error('Raw successful response:', textResponse.substring(0, 500));
      
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid response from OpenAI API',
          debug: 'Response was not valid JSON',
          type: 'PARSE_ERROR'
        })
      };
    }

    // Validate response structure
    if (endpoint === '/chat/completions') {
      if (!responseData.choices || !Array.isArray(responseData.choices) || responseData.choices.length === 0) {
        console.error('Invalid chat completion response structure:', responseData);
        return {
          statusCode: 502,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid response structure from OpenAI API',
            debug: 'Missing or empty choices array',
            type: 'STRUCTURE_ERROR'
          })
        };
      }
    }

    if (endpoint === '/images/generations') {
      if (!responseData.data || !Array.isArray(responseData.data) || responseData.data.length === 0) {
        console.error('Invalid image generation response structure:', responseData);
        return {
          statusCode: 502,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid response structure from OpenAI API',
            debug: 'Missing or empty data array',
            type: 'STRUCTURE_ERROR'
          })
        };
      }
    }

    console.log('OpenAI API request successful, returning response');
    console.log('=== Function End ===');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };

  } catch (error) {
    console.error('=== CRITICAL ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error cause:', error.cause);
    console.error('=== END CRITICAL ERROR ===');
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        type: error.name,
        debug: 'Check function logs for detailed error information'
      })
    };
  }
};
