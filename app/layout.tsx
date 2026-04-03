import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AppProvider } from "@/lib/context";
import { AuroraLogo } from "@/components/aurora-logo";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Aurora Ensemble — Group Experience Coordination",
  description:
    "Multi-party experience coordination for Aurora. AI-powered preference reconciliation for group dinners, travel, and experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <AppProvider>
          {/* Header */}
          <header className="border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <AuroraLogo />
                <div className="w-px h-5 bg-white/10" />
                <span className="text-[10px] font-light uppercase tracking-[0.1em] text-white/40">
                  Ensemble
                </span>
              </Link>
              <div className="w-8 h-8 rounded-full bg-[#A0784A]/15 text-[#A0784A] flex items-center justify-center text-xs font-medium">
                SC
              </div>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">{children}</div>
          </main>

          {/* Footer */}
          <footer className="border-t border-white/[0.06] py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
              <span className="text-[11px] text-white/20">
                Powered by Aurora Ensemble — Multi-party coordination, handled.
              </span>
              <span className="text-[11px] text-white/20">
                joinaurora.co
              </span>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
