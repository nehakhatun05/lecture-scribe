import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LectureScribe — Convert Audio & Video to Smart Notes",
  description:
    "Transform audio files and video lectures into clean, structured notes with AI-powered transcription and summarization.",
  keywords: ["lecture notes", "AI transcription", "study notes", "audio to text", "video converter", "education"],
  authors: [{ name: "Neha Basandrai" }],
  openGraph: {
    title: "LectureScribe — AI-Powered Lecture Notes",
    description: "Convert audio and video lectures into structured notes instantly",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] min-h-screen overflow-x-hidden flex flex-col`}
      >
        <ErrorBoundary>
          <Navbar />
          <main className="flex-1 w-full flex flex-col items-center transition-all duration-300">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
