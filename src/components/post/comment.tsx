"use client";

import React, { useEffect, useState } from "react";
import { fetchStory, Story } from "@/lib/hn-api";
import { formatDistanceToNow } from "date-fns";

type CommentProps = {
    id: number;
    level?: number; // For nested indentation
};

export default function Comment({ id, level = 0 }: CommentProps) {
    const [comment, setComment] = useState<Story | null>(null);

    useEffect(() => {
        fetchStory(id).then(setComment);
    }, [id]);

    if (!comment || comment.deleted || comment.dead) return null;

    return (
        <div style={{ marginLeft: level * 20 }} className="mb-4 border-l border-gray-300 pl-4 dark:border-zinc-700">
            <p className="text-xs text-muted-foreground mb-1">
                {comment.by} • {formatDistanceToNow(new Date(comment.time * 1000), { addSuffix: true })}
            </p>
            <div
                className="prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: comment.text || "" }}
            />
            {/* Render replies recursively */}
            {comment.kids?.map((kidId: number) => (
                <Comment key={kidId} id={kidId} level={level + 1} />
            ))}
        </div>
    );
}