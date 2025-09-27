# Campaign Strategy AI - Complete Netlify Deployment Guide

## Root Cause Analysis

Based on the console errors showing "OpenAI API key not configured", the primary issue is that the `OPENAI_API_KEY` environment variable is not being properly passed to the Netlify serverless functions.

## Step-by-Step Deployment Fix

### 1. Environment Variable Configuration (CRITICAL)

**In Netlify Dashboard:**

1. Go to your site dashboard on Netlify
2. Navigate to **Site Settings** → **Environment Variables**
3. Click **Add Variable**
4. Set:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your actual OpenAI API key (starts with `sk-`)
   - **Scopes**: Check both "Builds" and "Functions"

**Important Notes:**
- The key must be exactly `OPENAI_API_KEY` (case-sensitive)
- Make sure "Functions" scope is checked - this is crucial for serverless functions
- The value should be your complete OpenAI API key without quotes or extra spaces

### 2. Verify Your OpenAI API Key

Before deploying, verify your API key works:

1. Go to https://platform.openai.com/api-keys
2. Ensure your key has sufficient credits
3. Test the key with a simple curl command:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY_HERE"
```

### 3. Updated netlify.toml Configuration

Ensure your `netlify.toml` file contains:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[context.production.environment]
  NODE_VERSION = "18"

[context.deploy-preview.environment]
  NODE_VERSION = "18"

[context.branch-deploy.environment]
  NODE_VERSION = "18"
```

### 4. Test Function Endpoint

I've created a test endpoint to verify the function setup. After deployment, test:

1. Visit: `https://your-site.netlify.app/.netlify/functions/test-proxy`
2. Check that it returns JSON with `hasOpenAIKey: true`
3. If `hasOpenAIKey: false`, the environment variable is not set correctly

### 5. Deployment Process

1. **Upload the fixed files** to your repository
2. **Set environment variables** in Netlify dashboard (step 1)
3. **Trigger a new deployment**:
   - Either push to your connected Git repository
   - Or manually deploy via Netlify dashboard

### 6. Verification Steps

After deployment:

1. **Test the test endpoint**: `/.netlify/functions/test-proxy`
2. **Check function logs**: 
   - Go to Netlify Dashboard → Functions
   - Click on `openai-proxy` function
   - View recent invocations and logs
3. **Test the actual app**:
   - Fill out the campaign form
   - Try generating recommendations
   - Check browser console for any remaining errors

## Common Issues and Solutions

### Issue: "OpenAI API key not configured"
**Solution**: Environment variable not set correctly in Netlify
- Double-check the variable name is exactly `OPENAI_API_KEY`
- Ensure "Functions" scope is enabled
- Redeploy after setting the variable

### Issue: "Failed to load resource: 500"
**Solution**: Check function logs in Netlify dashboard
- Look for specific error messages
- Verify the OpenAI API key has sufficient credits
- Check if the key has the required permissions

### Issue: Functions not found (404)
**Solution**: Verify function deployment
- Check that `.mjs` files are in `netlify/functions/` directory
- Ensure `netlify.toml` points to correct functions directory
- Verify build completed successfully

## Alternative Approach: Client-Side with CORS Proxy

If serverless functions continue to fail, here's an alternative approach:

### Option A: Use a CORS Proxy Service

1. Use a service like `https://cors-anywhere.herokuapp.com/`
2. Update the `aiService.js` to use:
   ```javascript
   const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://api.openai.com/v1';
   ```

### Option B: Deploy to Vercel Instead

Vercel has more reliable serverless function support:

1. Create account at vercel.com
2. Connect your GitHub repository
3. Set environment variables in Vercel dashboard
4. Deploy automatically

## Files Included in Fix

- `netlify/functions/openai-proxy.mjs` - Updated serverless function
- `netlify/functions/test-proxy.mjs` - Test endpoint
- `netlify.toml` - Updated configuration
- `src/services/aiService.js` - Enhanced error handling

## Expected Results

After proper deployment:
- ✅ No "OpenAI API key not configured" errors
- ✅ Dynamic AI recommendations work
- ✅ Persona generation works
- ✅ Creative image generation works
- ✅ Clear error messages if any issues occur

## Support

If issues persist:
1. Check the test endpoint first
2. Review Netlify function logs
3. Verify OpenAI API key validity and credits
4. Consider the alternative deployment options above
