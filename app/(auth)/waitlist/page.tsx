import Link from "next/link";

export default function WaitlistPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="text-4xl">🎯</div>
        <h1 className="text-2xl font-bold text-gray-900">You&apos;re on the list</h1>
        <p className="text-gray-500">
          We&apos;re rolling out access gradually. You&apos;ll get an email the moment your
          spot opens up.
        </p>
        <p className="text-sm text-gray-400">
          Already have access?{" "}
          <Link href="/sign-in" className="text-brand-600 hover:text-brand-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
