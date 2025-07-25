"use client";

import Features from "@/components/Features";
import HowItWorksSection from "@/components/HowItWorksSection";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <main>
      {/* Hero Section */}
      <section>
        <div className="flex flex-col items-center justify-center mt-20 sm:mt-30 px-4 text-center">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Craft the perfect pitch deck in minutes,
              <br className="hidden sm:inline" /> powered by AI
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed">
              Generate a professional startup pitch deck instantly with our
              AI-powered tool. <br className="hidden sm:inline" /> Simply
              describe your startup idea, and let PitchCraft do the rest.
            </p>

            {/* Get Started Button (Sign In link) */}
            <Link href="/sign-in">
              <Button className="px-6 py-2 bg-black text-white font-medium rounded-3xl hover:bg-gray-800 transition mt-10">
                Create new pitch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <section className="mt-30 ml-20">
        <HowItWorksSection />
      </section>
      <section>
        <Features />
      </section>
      <section>
        <Pricing />
      </section>
      <section>
        <Testimonials />
      </section>
    </main>
  );
}
