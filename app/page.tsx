import Image from 'next/image';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';

import Navigation from './components/Navigation';
import TestingSection from './components/TestingSection';
import { getAuthenticatedUser } from '../lib/with-authkit';

// Register TypeScript syntax
SyntaxHighlighter.registerLanguage('typescript', typescript);

export default async function Home() {
  const user = await getAuthenticatedUser();

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black font-untitled text-gray-900 dark:text-neutral-200">
        {/* Navigation */}
        <Navigation user={user} />

        {/* Hero Section */}
        <div
          id="get-started"
          className="relative overflow-hidden bg-gray-50 dark:bg-black"
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
            <div className="text-center">
              {/* Logos Section */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-6 mb-4">
                  {/* Vercel Logo */}
                  <Image
                    src="/vercel-logo.svg"
                    alt="Vercel Logo"
                    width={54}
                    height={54}
                  />
                  <span className="text-5xl">⚡</span>
                  {/* WorkOS Logo */}
                  <Image
                    src="/workos-logo-vector.svg"
                    alt="WorkOS Logo"
                    width={54}
                    height={54}
                  />
                </div>
              </div>
              <div className="mb-6">
                <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  <span className="block">Secure Your</span>
                  {/* Animated flipping word */}
                  <span className="block">
                    <span className="inline-flex items-baseline space-x-1">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB300] via-[#FF8F00] to-[#FF6F00]">
                        MCP
                      </span>
                      <span className="relative w-[7ch] h-[1.2em] align-middle inline-block leading-[1.2] pb-0.5">
                        {/* Fallback static word - visible second half of cycle, and always if animations unsupported */}
                        <span className="flip-word-0 inline-flex items-center text-[1.15em] space-x-1">
                          <span
                            role="img"
                            aria-label="mobile app"
                            className="px-1"
                          >
                            📱
                          </span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B4D8] via-[#00CFFB] to-[#00E0FF]">
                            apps
                          </span>
                        </span>
                        {/* Animated words */}
                        <span className="flip-word-1 inline-flex items-center text-[1.15em] space-x-1">
                          <span
                            role="img"
                            aria-label="computer"
                            className="px-1"
                          >
                            🖥️
                          </span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B5CFF] via-[#7B61FF] to-[#A259FF]">
                            servers
                          </span>
                        </span>
                        <span className="flip-word-2 inline-flex items-center text-[1.15em] space-x-1">
                          <span
                            role="img"
                            aria-label="lightning bolt"
                            className="px-1"
                          >
                            ⚡️
                          </span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF56A1] via-[#FF6E7F] to-[#FF9359]">
                            tools
                          </span>
                        </span>
                        <span className="flip-word-3 inline-flex items-center text-[1.15em] space-x-1">
                          <span role="img" aria-label="robot" className="px-1">
                            🤖
                          </span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B4D8] via-[#00CFFB] to-[#00E0FF]">
                            users
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                  <span className="block text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#3EC8FF] via-[#6B5CFF] to-[#00E0FF]">
                    With the Vercel MCP Adapter and WorkOS
                  </span>
                </h1>

                <p className="mt-4 text-lg text-gray-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                  <strong>The authHandler pattern</strong> transforms any MCP
                  server into an enterprise-ready service. Test both public and
                  authenticated endpoints below, then explore the complete
                  implementation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gray-50 dark:bg-black">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
              <div className="text-center">
                {user ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-3xl p-6 max-w-3xl mx-auto shadow-xl backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="relative">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center border border-green-300/60 dark:border-green-700/50">
                          <svg
                            className="w-4 h-4 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 12V10a4 4 0 014-4 4 4 0 014 4v2m-7 0h14a2 2 0 012 2v6a2 2 0 01-2-2v-6a2 2 0 012-2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                        Signed In
                      </span>
                    </div>
                    <p className="text-green-800 dark:text-green-200 text-lg mb-6">
                      Welcome back,{' '}
                      <span className="font-semibold">
                        {user.firstName || user.email}
                      </span>
                      ! Your session is authenticated—test the pattern below.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <a
                        href="/getting-started"
                        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-600 hover:border-green-300 dark:hover:border-green-500 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <span>Full Implementation Guide</span>
                        </span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center mt-4">
                    <a
                      href="/login"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 inline-flex items-center space-x-3"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign In with AuthKit to begin testing</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Testing Section */}
        <TestingSection user={user} />

        {/* Implementation Guide */}
        <section className="py-20 bg-gray-50 dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Implementation Guide
              </h2>
              <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-3xl mx-auto">
                Transform any MCP server into an enterprise-ready, authenticated
                service
              </p>
            </div>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-700 rounded-3xl p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Build your MCP handler
                    </h3>
                    <p className="text-gray-700 dark:text-neutral-300 mb-6 text-lg">
                      Create your normal MCP server with tools using
                      `createMcpHandler()` - mix public and authenticated tools
                    </p>
                    <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-neutral-700 border-b border-gray-300 dark:border-neutral-600">
                        <span className="text-sm font-medium text-gray-600 dark:text-neutral-300">
                          app/mcp/route.ts
                        </span>
                        <button className="text-xs bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 text-gray-700 dark:text-neutral-200 px-3 py-1 rounded transition-colors">
                          Copy
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language="typescript"
                        style={oneLight}
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          fontSize: '0.875rem',
                          padding: '1.5rem',
                        }}
                        showLineNumbers={false}
                        wrapLines={true}
                        wrapLongLines={true}
                      >
                        {`import { createMcpHandler } from '@vercel/mcp-adapter';

// Create your regular MCP handler with tools
const handler = createMcpHandler((server) => {
  // Public tool - works without authentication
  server.tool(
    'ping',
    'Ping the MCP server to check if it is alive.',
    {},
    async () => {
      return {
        content: [{ type: 'text', text: JSON.stringify({ result: 'pong' }, null, 2) }],
      };
    },
  );

  // Authenticated tool - requires user context
  server.tool(
    'getUserProfile',
    "Returns the authenticated user's profile information.",
    {},
    async (args, { authInfo }) => {
      // authInfo.extra contains user data from auth wrapper
      const user = getUserFromAuthInfo(authInfo);
      return {
        content: [{ type: 'text', text: JSON.stringify(user, null, 2) }],
      };
    },
  );
});`}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-700 rounded-3xl p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Wrap with `experimental_withMcpAuth`
                    </h3>
                    <p className="text-gray-700 dark:text-neutral-300 mb-6 text-lg">
                      Transform your handler into an `authHandler` that
                      optionally validates JWTs—public tools work without auth,
                      secured tools get user data
                    </p>
                    <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-neutral-700 border-b border-gray-300 dark:border-neutral-600">
                        <span className="text-sm font-medium text-gray-600 dark:text-neutral-300">
                          Authentication wrapper
                        </span>
                        <button className="text-xs bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 text-gray-700 dark:text-neutral-200 px-3 py-1 rounded transition-colors">
                          Copy
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language="typescript"
                        style={oneLight}
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          fontSize: '0.875rem',
                          padding: '1.5rem',
                        }}
                        showLineNumbers={false}
                        wrapLines={true}
                        wrapLongLines={true}
                      >
                        {`// 🔐 THE AUTHHANDLER PATTERN 🔐
// Wrap your MCP handler with optional enterprise authentication
const authHandler = experimental_withMcpAuth(
  handler, // Your regular MCP handler from step 1
  async (request, token) => {
    // No token? Return undefined (allows public tools like ping)
    if (!token) {
      return undefined;
    }

    // Verify the JWT using WorkOS JWKS
    const { payload } = await jwtVerify(token, JWKS);
    
    if (!payload.sub) {
      throw new Error('Invalid token: missing sub claim');
    }

    // Fetch user profile from WorkOS
    const userProfile = await workos.userManagement.getUser(payload.sub);
    
    const user = {
      id: userProfile.id,
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      profilePictureUrl: userProfile.profilePictureUrl,
    };

    // Return AuthInfo with user data in extra field
    return {
      token,
      clientId: clientId!,
      scopes: [],
      extra: { user, claims: payload }, // Available in authInfo.extra
    };
  },
  { required: false } // Optional auth: tools decide if they need it
);`}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-700 rounded-3xl p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Expose authenticated MCP server
                    </h3>
                    <p className="text-gray-700 dark:text-neutral-300 mb-6 text-lg">
                      Export the `authHandler` as HTTP endpoints to expose your
                      authenticated MCP server
                    </p>
                    <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-neutral-700 border-b border-gray-300 dark:border-neutral-600">
                        <span className="text-sm font-medium text-gray-600 dark:text-neutral-300">
                          Expose authenticated MCP server
                        </span>
                        <button className="text-xs bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 text-gray-700 dark:text-neutral-200 px-3 py-1 rounded transition-colors">
                          Copy
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language="typescript"
                        style={oneLight}
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          fontSize: '0.875rem',
                          padding: '1.5rem',
                        }}
                        showLineNumbers={false}
                        wrapLines={true}
                        wrapLongLines={true}
                      >
                        {`// Expose the authenticated MCP server as HTTP endpoints
export { authHandler as GET, authHandler as POST };

// How it works:
// • ping tool → works for everyone (no auth required)
// • getUserProfile tool → requires authentication
// • authHandler validates JWT → calls handler with user in authInfo.extra`}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <a
                href="/getting-started"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                View Full Implementation Guide
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white py-16 border-t border-gray-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#6B5CFF] via-[#7B61FF] to-[#A259FF] rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">W</span>
                  </div>
                  <span className="text-xl font-bold">WorkOS AuthKit MCP</span>
                </div>
                <p className="text-gray-600 dark:text-neutral-400 mb-6 max-w-md">
                  Live demo and template showing the authHandler pattern: secure
                  any MCP server with WorkOS AuthKit in minutes.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="/getting-started"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Get Started
                  </a>
                  <a
                    href="https://github.com/workos/mcp-server-example"
                    className="border border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      className="w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.56 7.56 0 012.01-.27 7.56 7.56 0 012.01.27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.001 8.001 0 0016 8c0-4.42-3.58-8-8-8z"
                      />
                    </svg>
                    <span>View Template</span>
                  </a>
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Resources
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://workos.com/docs/user-management/mcp"
                      className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      AuthKit MCP Guide
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://modelcontextprotocol.io"
                      className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      MCP Spec
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Examples
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Support
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://workos.com/support"
                      className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://workos.com/slack"
                      className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Community
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://workos.com/blog"
                      className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://status.workos.com"
                      className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Status
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-800 mt-12 pt-8 text-center">
              <p className="text-gray-500 dark:text-neutral-500 text-sm">
                © 2024 WorkOS. Built with Next.js, TypeScript, and Tailwind
                CSS.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';
