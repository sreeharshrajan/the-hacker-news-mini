import { fetchStory } from "@/lib/hn-api";
import { Suspense } from "react";
import Comment from "@/components/post/comment";
import type { Metadata } from "next";
import PostMeta from "@/components/post/post-meta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ExternalLink,
    MessageSquare,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import CommentSkeleton from "@/components/post/comment-skeleton";
import StoryError from "@/components/post/post-error";
import { FormattedText } from "@/components/ui/formatted-text";

type PageProps = {
    params: { id: string };
};

// Get story type badge
function getStoryTypeBadge(story: any) {
    if (story.type === 'job') return <Badge variant="secondary">Job</Badge>;
    if (story.type === 'poll') return <Badge variant="outline">Poll</Badge>;
    if (story.title?.toLowerCase().startsWith('ask hn:')) {
        return <Badge variant="default">Ask HN</Badge>;
    }
    if (story.title?.toLowerCase().startsWith('show hn:')) {
        return <Badge variant="default">Show HN</Badge>;
    }
    return <Badge variant="outline">Story</Badge>;
}

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    try {
        // Validate story ID
        const storyId = Number(params.id);
        if (isNaN(storyId) || storyId <= 0) {
            return {
                title: "Invalid Story | HackerPulse",
                description: "The requested story ID is invalid."
            };
        }

        const story = await fetchStory(storyId);
        if (!story) {
            return {
                title: "Story Not Found | HackerPulse",
                description: "The requested story could not be found."
            };
        }

        const commentCount = story.kids?.length || 0;
        const description = story.text
            ? `${story.text.replace(/<[^>]*>/g, '').slice(0, 150)}...`
            : `Posted by ${story.by} • ${story.score} points • ${commentCount} comments`;

        return {
            title: `${story.title} | HackerPulse`,
            description,
            openGraph: {
                title: story.title,
                description,
                type: 'article',
                authors: [story.by],
                publishedTime: new Date(story.time * 1000).toISOString(),
            },
            twitter: {
                card: 'summary_large_image',
                title: story.title,
                description,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: "Error Loading Story | HackerPulse",
            description: "An error occurred while loading the story."
        };
    }
}

export default async function StoryPage({ params }: PageProps) {
    // Validate story ID
    const storyId = Number(params.id);
    if (isNaN(storyId) || storyId <= 0) {
        return <StoryError storyId={params.id} error="Invalid story ID format" />;
    }

    let story;
    let error: string | null = null;

    try {
        console.log(`Fetching story ${storyId}...`);
        story = await fetchStory(storyId);

        if (!story) {
            return <StoryError storyId={params.id} error="Story not found or may have been deleted" />;
        }

        console.log(`Successfully loaded story: ${story.title}`);
    } catch (err) {
        console.error('Error fetching story:', err);
        error = err instanceof Error ? err.message : 'Unknown error occurred';
        return <StoryError storyId={params.id} error={error} />;
    }

    const commentCount = story.kids?.length || 0;
    const storyTypeBadge = getStoryTypeBadge(story);

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            {/* Back Navigation */}
            <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Stories
                        </Button>
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto p-4 space-y-8 overflow-x-hidden">
                {/* Story Header */}
                <header className="space-y-4">
                    {storyTypeBadge}
                    <div className="flex items-start gap-3">
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight break-words">
                            {story.title}
                        </h1>
                    </div>

                    {/* Story Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <PostMeta
                            score={story.score}
                            by={story.by}
                            time={story.time}
                            commentCount={story.descendants}
                            className="mt-2"
                        />
                    </div>
                </header>

                <Separator />

                {/* Story Content */}
                <div className="space-y-6">
                    {/* Story Text (for Ask HN/Show HN posts) */}
                    {story.text && (
                        <article className="prose prose-gray dark:prose-invert max-w-none">
                            <FormattedText text={story.text} />
                        </article>
                    )}

                    {/* External Link */}
                    {story.url && (
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="gap-2">
                                <a
                                    href={story.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Visit Original Site
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={`https://web.archive.org/web/*/${story.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Archive
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Comments Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Comments
                            <Badge variant="secondary">
                                {story.descendants || 0}
                            </Badge>
                        </h2>
                    </div>

                    {story.descendants ? (
                        <div className="space-y-6">
                            <Suspense fallback={<CommentSkeleton count={5} />}>
                                {story.kids?.length ? (
                                    story.kids.map((kidId: number) => (
                                        <Comment key={kidId} id={kidId} />
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        Comments not loaded
                                    </div>
                                )}
                            </Suspense>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No comments yet</h3>
                            <p className="text-muted-foreground">
                                Be the first to start the discussion!
                            </p>
                        </div>
                    )}
                </section>

                {/* Footer Actions */}
                <div className="pt-8 border-t">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                        <div className="text-sm text-muted-foreground">
                            <p>Story #{story.id} • HackerPulse</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={`https://news.ycombinator.com/item?id=${story.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View on HN
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}