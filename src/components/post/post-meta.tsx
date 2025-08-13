// src/components/post/post-meta.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Flame, MessageSquare, User, Clock } from "lucide-react";
import { getTimeAgo } from "@/lib/hn-api";

type PostMetaProps = {
  score: number;
  by: string;
  time: number; // UNIX timestamp
  commentCount?: number;
  className?: string;
};


export default function PostMeta({
  score,
  by,
  time,
  commentCount,
  className = "",
}: PostMetaProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
      {/* Score */}
      <Badge 
        variant="secondary" 
        className="flex items-center gap-1 px-2 py-1"
        aria-label={`${score} points`}
      >
        <Flame className="h-3 w-3 text-orange-500" />
        {score}
      </Badge>

      {/* Author */}
      <Badge 
        variant="outline" 
        className="flex items-center gap-1 px-2 py-1"
        aria-label={`Posted by ${by}`}
      >
        <User className="h-3 w-3" />
        {by}
      </Badge>

      {/* Time */}
      <Badge 
        variant="outline" 
        className="flex items-center gap-1 px-2 py-1"
        aria-label={`Posted ${getTimeAgo(time)}`}
      >
        <Clock className="h-3 w-3" />
        {getTimeAgo(time)}
      </Badge>

      {/* Comments (if available) */}
      {commentCount !== undefined && (
        <Badge 
          variant="outline" 
          className="flex items-center gap-1 px-2 py-1"
          aria-label={`${commentCount} comments`}
        >
          <MessageSquare className="h-3 w-3" />
          {commentCount}
        </Badge>
      )}
    </div>
  );
}