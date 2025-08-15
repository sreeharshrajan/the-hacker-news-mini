
"use client";

import { formatText } from "@/lib/format-text";
import { cn } from "@/lib/utils";

interface FormattedTextProps {
    text?: string | null;
    className?: string;
}

export function FormattedText({ text, className }: FormattedTextProps) {
    const formatted = formatText(text);

    return (
        <div
            className={cn(
                "prose prose-sm dark:prose-invert max-w-none",
                "[&_.hn-paragraph]:mb-3 [&_.hn-paragraph]:leading-relaxed",
                "[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded",
                "[&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto",
                className
            )}
            dangerouslySetInnerHTML={{ __html: formatted }}
        />
    );
}