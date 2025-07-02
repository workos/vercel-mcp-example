'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from "@/lib/auth/types";

interface TestingSectionProps {
  user: User | null;
}

export default function TestingSection({ user }: TestingSectionProps) {
  const [pingOutput, setPingOutput] = useState('Click "Test Now" to see the response');
  const [debugOutput, setDebugOutput] = useState(
    user ? 'Click "Test Now" to get your user profile via MCP' : 'Sign in first to test this endpoint'
  );
  const [pingLoading, setPingLoading] = useState(false);
  const [debugLoading, setDebugLoading] = useState(false);
  const [mcpUrl, setMcpUrl] = useState('http://localhost:3000/mcp');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setMcpUrl(isLocalhost ? 'http://localhost:3000/mcp' : `https://${window.location.host}/mcp`);
    }
  }, []);

  const testPing = async () => {
    setPingLoading(true);
    try {
      const response = await fetch('/api/ping-mcp');
      const data = await response.json();
      setPingOutput(JSON.stringify(data, null, 2));
    } catch (error) {
      setPingOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setPingLoading(false);
    }
  };

  const testUserProfile = async () => {
    setDebugLoading(true);
    try {
      const response = await fetch('/api/user-profile', {
        credentials: 'include'
      });
      const data = await response.json();
      
      // Show friendly error messages if available
      if (!response.ok && data.message) {
        setDebugOutput(JSON.stringify({
          error: data.error,
          message: data.message,
          status: response.status
        }, null, 2));
      } else {
        setDebugOutput(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setDebugOutput(JSON.stringify({
        error: 'Network error',
        message: `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`
      }, null, 2));
    } finally {
      setDebugLoading(false);
    }
  };

  return (
    <section className="py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Test the AuthHandler Pattern
          </h2>
          <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-3xl mx-auto">
            This demo implements the exact authHandler pattern described above. Test both endpoints to see how authentication works in practice—one is public, one requires WorkOS login.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Public Endpoint */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gray-200 dark:bg-neutral-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Public Health Check</h3>
                <p className="text-gray-600 dark:text-neutral-400">Works for everyone • No login required</p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-neutral-300 mb-6">
              This calls the MCP <code className="px-2 py-1 bg-gray-200 dark:bg-neutral-700 rounded text-sm">ping</code> tool, which demonstrates a <strong>public endpoint</strong> in your MCP server. 
              Notice it works whether you&apos;re signed in or not—ideal for health checks and monitoring.
            </p>

            <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg p-4 mb-6">
              <div className="mb-2">
                <span className="text-sm font-mono text-gray-600 dark:text-neutral-400">MCP Response:</span>
              </div>
              <pre className="text-sm text-gray-800 dark:text-neutral-200 font-mono whitespace-pre-wrap break-words min-h-[80px]">
                {pingOutput}
              </pre>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-neutral-400">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Available to all users
              </div>
              <button 
                onClick={testPing}
                disabled={pingLoading}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                {pingLoading ? 'Testing...' : 'Test Public Tool'}
              </button>
            </div>
          </div>

          {/* Authenticated Endpoint */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Authenticated Profile Access</h3>
                <p className="text-blue-600 dark:text-blue-400">Enterprise security • WorkOS verification required</p>
              </div>
            </div>
            
            <p className="text-blue-800 dark:text-blue-200 mb-6">
              This calls the MCP <code className="px-2 py-1 bg-blue-200/50 dark:bg-blue-800/50 rounded text-sm">getUserProfile</code> tool, demonstrating the <strong>authHandler pattern</strong>. 
              It validates your JWT, fetches your profile from WorkOS, and returns authenticated user data.
            </p>

            <div className="bg-white dark:bg-neutral-800 border border-blue-300 dark:border-blue-600 rounded-lg p-4 mb-6">
              <div className="mb-2">
                <span className="text-sm font-mono text-blue-600 dark:text-blue-400">MCP Response:</span>
              </div>
              <pre className="text-sm text-blue-800 dark:text-blue-200 font-mono whitespace-pre-wrap break-words min-h-[80px]">
                {debugOutput}
              </pre>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                {user ? (
                  <>
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Authenticated as {user.firstName || user.email}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Sign in to test authenticated tools
                  </>
                )}
              </div>
              
              <div className="flex space-x-3">
                {user ? (
                  <>
                    <button 
                      onClick={testUserProfile}
                      disabled={debugLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      {debugLoading ? 'Testing...' : 'Test Authenticated Tool'}
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={testUserProfile}
                      disabled={debugLoading}
                      className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                      title="Test what happens when calling an authenticated tool without being signed in"
                    >
                      {debugLoading ? 'Testing...' : 'Test Unauthenticated'}
                    </button>
                    <a
                      href="/login"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center space-x-2 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign In with WorkOS</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* MCP Inspector Testing - List Tools */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100">MCP Inspector</h3>
                <p className="text-purple-600 dark:text-purple-400">Official testing tool • Test connectivity</p>
              </div>
            </div>
            
            <p className="text-purple-800 dark:text-purple-200 mb-6">
              Use the official MCP Inspector to <strong>list available tools</strong> and verify your server is responding. 
              This tests basic connectivity without requiring authentication.
            </p>

            <div className="bg-white dark:bg-neutral-800 border border-purple-300 dark:border-purple-600 rounded-lg p-4 mb-6">
              <div className="mb-2">
                <span className="text-sm font-mono text-purple-600 dark:text-purple-400">Command:</span>
              </div>
              <pre className="text-sm text-purple-800 dark:text-purple-200 font-mono whitespace-pre-wrap break-words">
                npx @modelcontextprotocol/inspector --cli {mcpUrl} --method tools/list --transport http
              </pre>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Available to all users
              </div>
              <Link
                href="/getting-started/steps/verify-your-server"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium flex items-center"
              >
                Full Testing Guide
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* MCP Inspector Testing - Authenticated Tools */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100">Inspector + Auth</h3>
                <p className="text-purple-600 dark:text-purple-400">Test with authentication tokens</p>
              </div>
            </div>
            
            <p className="text-purple-800 dark:text-purple-200 mb-6">
              Test <strong>authenticated MCP tools</strong> using the Inspector with your auth token. 
              {user ? 'You can get your current session token from the browser.' : 'Sign in first to get a valid token.'}
            </p>

            <div className="bg-white dark:bg-neutral-800 border border-purple-300 dark:border-purple-600 rounded-lg p-4 mb-6">
              <div className="mb-2">
                <span className="text-sm font-mono text-purple-600 dark:text-purple-400">Command:</span>
              </div>
              <pre className="text-sm text-purple-800 dark:text-purple-200 font-mono whitespace-pre-wrap break-words">
                npx @modelcontextprotocol/inspector --cli {mcpUrl} --method tools/call --tool-name getUserProfile --transport http --header &quot;Authorization=Bearer YOUR_TOKEN&quot;
              </pre>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                {user ? (
                  <>
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Ready to test with auth
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Sign in to get auth token
                  </>
                )}
              </div>
              
              {user ? (
                <button
                  onClick={() => {
                    const instructions = `To get your auth token:
1. Open browser dev tools (F12)
2. Go to Application → Cookies → ${window.location.hostname}
3. Copy the value of &apos;workos-session&apos;
4. Replace YOUR_TOKEN in the command above`;
                    alert(instructions);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Get Auth Token
                </button>
              ) : (
                <a
                  href="/login"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center space-x-2 text-sm font-medium"
                >
                  <span>Sign In First</span>
                </a>
              )}
            </div>
          </div>
        </div>

        

        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 dark:text-neutral-400 mb-8 max-w-3xl mx-auto">
            This demonstrates the core value proposition: add authentication to any MCP server with minimal code changes using the authHandler pattern.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/get-started"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              Implementation Guide
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="https://workos.com/docs/user-management/mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-neutral-600 hover:border-gray-400 dark:hover:border-neutral-500 text-gray-700 dark:text-neutral-200 hover:text-gray-900 dark:hover:text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              WorkOS Docs
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 