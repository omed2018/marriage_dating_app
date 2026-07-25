import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-rose-600">MarriageApp</h1>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your <span className="text-rose-600">Life Partner</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A serious platform for those seeking marriage. Connect with
            compatible profiles and build a meaningful relationship.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Your Journey
            </Button>
          </Link>
        </section>

        <section className="bg-white border-t border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Serious Intentions</h3>
              <p className="text-gray-600">
                Every member is here for marriage. No games, no swiping for fun.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Report and block features keep you safe. Your privacy matters.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Real Connections</h3>
              <p className="text-gray-600">
                Chat with your matches in real-time. Get to know each other.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6">
        <p className="text-center text-gray-500 text-sm">
          © 2026 MarriageApp. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
