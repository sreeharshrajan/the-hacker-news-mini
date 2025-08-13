// components/post/comment-wrapper.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CommentWrapperProps {
  children: ReactNode;
  level?: number;
  className?: string;
}

export default function CommentWrapper({ 
  children, 
  level = 0, 
  className 
}: CommentWrapperProps) {
  return (
    <div 
      className={cn(
        "w-full overflow-hidden",
        "break-words overflow-wrap-anywhere",
        // Add left border and padding for nested comments
        level > 0 && "ml-4 pl-4 border-l-2 border-muted/50",
        // Reduce margin for deeply nested comments
        level > 3 && "ml-2 pl-2",
        className
      )}
      style={{
        // Ensure nested comments don't exceed viewport
        maxWidth: level > 0 ? `calc(100% - ${Math.min(level * 1.5, 6)}rem)` : '100%'
      }}
    >
      <div className="space-y-3 comment-content">
        {children}
      </div>
    </div>
  );
}