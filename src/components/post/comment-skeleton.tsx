import { Skeleton } from "@/components/ui/skeleton";
import CommentWrapper from "@/components/post/comment-wrapper";


export default function CommentSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, i) => (
                <CommentWrapper key={i}>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-3 w-16 rounded" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-full rounded" />
                            <Skeleton className="h-3 w-11/12 rounded" />
                            <Skeleton className="h-3 w-10/12 rounded" />
                        </div>
                    </div>
                </CommentWrapper>
            ))}
        </div>
    );
}