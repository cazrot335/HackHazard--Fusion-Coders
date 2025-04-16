"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3ebff]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-800">
          DevNest AI
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-purple-800 hover:text-purple-900">
            Home
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="rounded-full border-purple-300 text-purple-800 hover:bg-purple-100">
              Signup
            </Button>
          </Link>
          <Link href="/login">
            <Button className="rounded-full bg-purple-800 hover:bg-purple-900">Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900 leading-tight">
              Real Time collaborative Editor with AI Assistance
            </h1>
            <p className="text-xl text-purple-800">Code Smarter, Build Faster — Powered by AI.</p>
            <Button className="rounded-full bg-purple-800 hover:bg-purple-900 px-8 py-6 text-lg">Try it Now</Button>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/editor-screenshot.png"
                alt="Code editor screenshot"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <Image
                src="/robot-mascot.png"
                alt="AI Robot Assistant"
                width={200}
                height={200}
                className="absolute -bottom-10 -right-10"
              />
            </div>
          </div>
        </div>
        {/* Curved white background in bottom-right corner only */}
        <div className="absolute bottom-0 right-0 w-[50%] h-[30%] bg-white rounded-tl-[100px] z-0"></div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-900 mb-8">
            Features Of Our Application
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <FeatureCard icon="/ai-chip-icon.svg" title="AI Autocompletion" />
            <FeatureCard icon="/bug-fixing-icon.svg" title="AI-Powered Linting & Bug Fixing" />
            <FeatureCard icon="/docs-icon.svg" title="Auto-Generated Docs" />
            <FeatureCard icon="/collaboration-icon.svg" title="Real-Time Collaboration" />
          </div>
        </div>
      </section>

      {/* What our Application does Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Image
                src="/editor-in-action.png"
                alt="DevNest AI Editor in action"
                width={600}
                height={500}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-900">What our Application really do?</h2>
              <p className="text-lg text-gray-700">
                DevNest AI is an AI-powered code editor that provides real-time code suggestions, bug fixes, and
                documentation using Code Llama on Groq. It boosts productivity with intelligent linting, autocompletion,
                live collaboration, and seamless Git integration — all in one smart workspace.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex flex-col items-center text-center p-3 md:p-4">
      <div className="w-12 h-12 md:w-14 md:h-14 mb-2 md:mb-3">
        <Image src={icon || "/placeholder.svg"} alt={title} width={56} height={56} />
      </div>
      <h3 className="text-sm md:text-base font-semibold text-purple-800">{title}</h3>
    </div>
  )
}
