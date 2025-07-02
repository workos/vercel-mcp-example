# Deployment

This guide covers how to deploy your authenticated MCP server to production.

## Vercel Deployment

The easiest way to deploy this template is with [Vercel](https://vercel.com/).

1.  **Push your code to a Git repository:**

    Create a new repository on GitHub, GitLab, or Bitbucket and push your code.

2.  **Import your project into Vercel:**
    - From the Vercel dashboard, click "Add New... > Project".
    - Import your Git repository.
    - Vercel will automatically detect that you are using Next.js and configure the build settings.

3.  **Configure environment variables:**

    In the "Settings > Environment Variables" section of your Vercel project, add the same environment variables that you defined in your `.env.local` file:
    - `WORKOS_API_KEY`
    - `WORKOS_CLIENT_ID`
    - `WORKOS_COOKIE_PASSWORD`

    If you are using the OpenAPI integration, you will also need to set the following:
    - `OPENAPI_SPEC_URL`
    - `OPENAPI_BASE_URL`
    - `OPENAPI_API_KEY`
    - `OPENAPI_USER_ID_HEADER`
    - `OPENAPI_AUTH_HEADER`

    Vercel will automatically set the `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` environment variable for you.

4.  **Update your WorkOS redirect URI:**

    In your WorkOS AuthKit settings, add your production URL to the list of allowed redirect URIs. The production URL will be in the format `https://your-project-name.vercel.app/callback`.

5.  **Deploy:**

    Trigger a new deployment in Vercel. Your authenticated MCP server is now live!

## Production Considerations

- **Logging:** Consider using a logging service to monitor your MCP server in production. You can add logging within your tool handlers to capture important events and errors.
- **Security:** Ensure that your API keys and other secrets are stored securely as environment variables and are not exposed to the client-side.
- **Scaling:** If you expect a high volume of traffic, you may need to scale your database or other backend services that your MCP tools interact with.

## Monitoring

You can monitor the health and usage of your MCP server using Vercel's analytics and logging features. Additionally, you can add your own monitoring to your tool handlers to track usage and performance.
