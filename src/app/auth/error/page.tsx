import Link from "next/link";

export default function AuthError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Authentication Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            There was a problem with your authentication request. Please try again.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            href="/signin"
            className="block w-full rounded-lg bg-brand-500 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Back to Sign In
          </Link>
          <Link
            href="/"
            className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
