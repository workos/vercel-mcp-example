import Link from 'next/link';
import Navigation from '../components/Navigation';
import { getAuthenticatedUser } from '../../lib/with-authkit';

// This page reads cookies via getAuthenticatedUser(), so it must be rendered dynamically
export const dynamic = 'force-dynamic';

const steps = [
  {
    slug: 'clone-and-run',
    title: 'Clone & Run',
    description:
      'Get the template running locally and understand the basic setup',
    duration: '3 min',
    icon: (
      <svg
        className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    slug: 'understand-the-pattern',
    title: 'Understand the AuthHandler Pattern',
    description:
      'Learn how the authHandler wrapper transforms any MCP server into an authenticated service',
    duration: '3 min',
    icon: (
      <svg
        className="w-8 h-8 text-blue-600 dark:text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    slug: 'implement-your-tools',
    title: 'Implement Your Own Tools',
    description:
      'Replace the example tools with your own business logic and learn key patterns',
    duration: '10 min',
    icon: (
      <svg
        className="w-8 h-8 text-purple-600 dark:text-purple-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
        />
      </svg>
    ),
  },
  {
    slug: 'organize-your-code',
    title: 'Organize Your Code',
    description:
      'Learn where to put utilities, business logic, and how to structure larger MCP servers',
    duration: '5 min',
    icon: (
      <svg
        className="w-8 h-8 text-green-600 dark:text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    slug: 'connect-mcp-clients',
    title: 'Connect MCP Clients',
    description:
      'Configure Claude, Cursor, and other MCP clients to use your server',
    duration: '8 min',
    icon: (
      <svg
        className="w-8 h-8 text-orange-600 dark:text-orange-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
        />
      </svg>
    ),
  },
  {
    slug: 'deploy-to-production',
    title: 'Deploy to Production',
    description:
      'Deploy your authenticated MCP server to Vercel with proper environment configuration',
    duration: '5 min',
    icon: (
      <svg
        className="w-8 h-8 text-red-600 dark:text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
  },
  {
    slug: 'verify-your-server',
    title: 'Verify Your Server',
    description:
      'Test your deployed MCP server using the official Model Context Protocol Inspector',
    duration: '5 min',
    icon: (
      <svg
        className="w-8 h-8 text-violet-600 dark:text-violet-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default async function GettingStartedPage() {
  const user = await getAuthenticatedUser();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navigation user={user} />

      <div className="max-w-4xl mx-auto pt-24 px-4 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Getting Started Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Learn how to build your own enterprise-ready MCP server with WorkOS
            authentication. Each step guides you through implementing your own
            business logic while leveraging the powerful authHandler pattern.
          </p>
        </div>

        {/* Steps - Progressive Flow */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.slug} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-12 bg-gray-300 dark:bg-neutral-600"></div>
              )}

              <Link
                href={`/getting-started/steps/${step.slug}`}
                className="group flex items-start space-x-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 hover:shadow-lg"
              >
                {/* Step Number & Icon */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-3">
                    {index + 1}
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-neutral-400 mb-4 leading-relaxed text-lg">
                    {step.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-neutral-500 text-sm font-medium">
                      Estimated time: {step.duration}
                    </span>
                    <div className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
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
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link
            href="/getting-started/steps/clone-and-run"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Building Your MCP Server
            <svg
              className="ml-3 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <p className="text-gray-500 dark:text-neutral-500 mt-4 text-sm">
            Complete guide • 30 minutes • From zero to production
          </p>
        </div>
      </div>
    </div>
  );
}
