"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 sm:px-10 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 text-foreground hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
              <Shield className="size-5" />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">CHRONONAV</h2>
          </Link>
        </div>

        <nav aria-label="Main Navigation" className="flex items-center gap-4 sm:gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">Home</Link>
            <Link href="/privacy" className="text-primary font-semibold">Privacy Policy</Link>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-primary-foreground text-sm font-semibold transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex justify-center px-4 sm:px-8 md:px-16 lg:px-40 py-8">
        <article className="flex flex-col w-full max-w-[960px] space-y-6">
          <div className="border-b border-border pb-4">
            <Link href="/" className="inline-flex items-center text-xs font-medium text-secondary hover:text-primary mb-3">
              <ArrowLeft className="mr-1 size-3" /> Back to Application
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
            <p className="text-secondary text-sm pt-2">
              Effective Date: January 1, 2024 | Last Updated: January 1, 2024
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Welcome</h2>
            <p className="text-foreground/90 leading-relaxed">
              Welcome to the CHRONONAV Privacy Policy. This policy explains how we collect, use, and protect your information when you use our web application. By using CHRONONAV, you agree to the terms outlined in this policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Information We Collect</h2>
            <p className="text-foreground/90 leading-relaxed">
              We collect several types of information to provide and improve our services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and role.</li>
              <li><strong>Schedule Information:</strong> We collect data related to your class schedules, including course names, times, and room locations.</li>
              <li><strong>Location Information:</strong> To help you navigate campus, we process indoor location data while you actively use navigation features.</li>
              <li><strong>Device Information:</strong> We collect non-identifiable browser and device telemetry to ensure responsive map performance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">How We Use Your Information</h2>
            <p className="text-foreground/90 leading-relaxed">
              We use the information we collect to:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Provide and maintain the CHRONONAV application.</li>
              <li>Help you manage your class schedules and receive timely class reminders.</li>
              <li>Provide optimal indoor turn-by-turn navigation assistance on campus.</li>
              <li>Improve system features and enhance map accuracy.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Data Storage and Security</h2>
            <p className="text-foreground/90 leading-relaxed">
              We take the security of your information seriously. We use industry-standard encryption measures and Supabase Row-Level Security (RLS) policies to protect your data from unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Contact Us</h2>
            <p className="text-foreground/90 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us at:<br />
              <span className="font-semibold">Email:</span> privacy@chrononav.com<br />
              <span className="font-semibold">Address:</span> University of Cebu Main Campus, Sanciangko St, Cebu City
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
