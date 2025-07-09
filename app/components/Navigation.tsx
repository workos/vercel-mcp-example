'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { User } from '@/lib/auth/types';

interface NavigationProps {
  user: User | null;
}

export default function Navigation({ user }: NavigationProps) {
  return (
    <nav className="border-b border-neutral-800 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* Brand Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/workos-logo-vector.svg"
                alt="WorkOS Logo"
                width={40}
                height={40}
                priority
              />
            </Link>
            {/* Primary Navigation */}
            <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <li>
                <Link
                  href="/getting-started"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Getting Started
                </Link>
              </li>
              <li>
                <a
                  href="https://workos.com/docs/user-management/mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Auth Status & Theme Toggle */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {/* GitHub Repo Badge */}
            <a
              href="https://github.com/workos/vercel-mcp-example"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center space-x-2 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-full transition-colors"
            >
              {/* GitHub logo */}
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
              <span className="text-sm font-medium">GitHub</span>
            </a>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white dark:bg-neutral-900 border border-green-200/50 dark:border-green-700/40 rounded-full px-4 py-2">
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
                      d="M3 11V9a4 4 0 014-4 4 4 0 014 4v2m-7 0h14a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2z"
                    />
                  </svg>
                  <div className="text-sm">
                    <div className="font-medium text-green-700 dark:text-green-300">
                      {user.firstName || user.email}
                    </div>
                    <div className="text-green-600 dark:text-green-500 text-xs">
                      Authenticated
                    </div>
                  </div>
                </div>
                <a
                  href="/logout"
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Sign Out
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white dark:bg-neutral-900 border border-gray-300/60 dark:border-neutral-700/60 rounded-full px-4 py-2">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c1.657 0 3-1.343 3-3V7a3 3 0 00-6 0v1c0 1.657 1.343 3 3 3zm0 0v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 dark:text-neutral-300">
                      Guest
                    </div>
                    <div className="text-gray-500 dark:text-neutral-500 text-xs">
                      Unauthenticated
                    </div>
                  </div>
                </div>
                <a
                  href="/login"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
