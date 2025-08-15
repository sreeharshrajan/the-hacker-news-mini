"use client";

import React, { useEffect, useState } from "react";
import { fetchStory, Story } from "@/lib/hn-api";
import { formatDistanceToNow } from "date-fns";
import CommentWrapper from "@/components/post/comment-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

type CommentProps = {
    id: number;
    level?: number;
};

export default function Comment({ id, level = 0 }: CommentProps) {
    const [comment, setComment] = useState<Story | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetchStory(id)
            .then(data => {
                setComment(data);
                setError(null);
            })
            .catch(err => {
                console.error('Error fetching comment:', err);
                setError(err.message);
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <CommentWrapper level={level}>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-11/12" />
                        <Skeleton className="h-3 w-10/12" />
                    </div>
                </div>
            </CommentWrapper>
        );
    }

    if (error) {
        return (
            <CommentWrapper level={level}>
                <div className="text-sm text-destructive">
                    Failed to load comment: {error}
                </div>
            </CommentWrapper>
        );
    }

    if (!comment || comment.deleted || comment.dead) return null;

    return (
        <CommentWrapper level={level}>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">{comment.by}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(comment.time * 1000), { addSuffix: true })}</span>
                </div>
                
                <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: comment.text || "" }}
                />
                
                {/* Render replies */}
                <div className="space-y-4 pt-2">
                    {comment.kids?.map((kidId: number) => (
                        <Comment key={kidId} id={kidId} level={level + 1} />
                    ))}
                </div>
            </div>
        </CommentWrapper>
    );
}