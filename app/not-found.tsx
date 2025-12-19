import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 text-center">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <p className="mt-4 text-gray-600">Could not find requested resource</p>
      <Link href="/" className="mt-4 text-blue-600 hover:underline">
        Return Home
      </Link>
    </div>
  )
}
