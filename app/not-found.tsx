import Link from 'next/link'
import { MagnifyingGlassIcon, HomeIcon, BookOpenIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            Sorry, we could not find the page you are looking for.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all"
          >
            <HomeIcon className="h-5 w-5" />
            Go Home
          </Link>
          <Link
            href="/resources"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
          >
            <BookOpenIcon className="h-5 w-5" />
            Browse Resources
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            Search
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Popular Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            <Link href="/dashboard" className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900">Dashboard</p>
              <p className="text-sm text-gray-500">View your personalized dashboard</p>
            </Link>
            <Link href="/categories" className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900">Categories</p>
              <p className="text-sm text-gray-500">Browse by category</p>
            </Link>
            <Link href="/about" className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900">About Us</p>
              <p className="text-sm text-gray-500">Learn more about our library</p>
            </Link>
            <Link href="/bookmarks" className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900">Bookmarks</p>
              <p className="text-sm text-gray-500">View your saved resources</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
