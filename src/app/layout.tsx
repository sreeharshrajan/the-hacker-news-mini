import { ThemeProvider } from "@/providers/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { PageTransition } from "@/components/common/page-transition";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The Hacker News Mini",
  description:
    "A modern, lightning-fast Hacker News client built with Next.js 15, TypeScript, and Shadcn UI. Experience Hacker News like never before with infinite scrolling, intelligent caching, nested comment threads, and a beautiful responsive interface that works seamlessly across all devices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex justify-center items-center`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            <PageTransition>{children}</PageTransition>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}