"use client";

import { ThemeModeToggle } from "@/components/common/theme-mode-toggle";
import Link from "next/link";

export function Header() {
    return (
        <header className="w-full border-b p-4 flex justify-between items-center">
            <Link href="/" className="text-lg font-semibold">
                The Hacker News Mini
            </Link>
            <ThemeModeToggle />
        </header>
    );
}