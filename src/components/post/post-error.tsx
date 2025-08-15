import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    RefreshCw,
    AlertCircle,
    ArrowLeft,
    ExternalLink,
} from "lucide-react";

export default function StoryError({ storyId, error }: { storyId: string; error: string }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Failed to Load Story</h1>
                    <p className="text-muted-foreground mb-4">
                        Story #{storyId} could not be loaded
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                        {error}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => window.location.reload()}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Stories
                        </Link>
                    </Button>

                    <Button variant="ghost" asChild>
                        <a
                            href={`https://news.ycombinator.com/item?id=${storyId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                        >
                            <ExternalLink className="h-4 w-4" />
                            View on Hacker News
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}