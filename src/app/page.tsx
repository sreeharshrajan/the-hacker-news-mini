// app/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import PostMeta from "@/components/post/post-meta";
import ActionBar, { SortType } from "@/components/common/action-bar";
import { useState } from "react";
import { useStoriesByType } from "@/hooks/useStoriesByType";
import {
  Loader,
  Flame,
  MessageSquare,
  User,
  ArrowUp,
  AlertCircle,
  ExternalLink,
  MessageCircle
} from "lucide-react";

// Helper function to get display name for sort type
const getSortDisplayName = (sortType: SortType): string => {
  switch (sortType) {
    case "top":
      return "Top";
    case "new":
      return "New";
    case "comments":
      return "Most Comments";
    case "ask":
      return "Ask HN";
    default:
      return "";
  }
};

export default function HomePage() {
  const [sortBy, setSortBy] = useState<SortType>("top");
  const { data: stories = [], isLoading, error } = useStoriesByType(sortBy);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <Loader className="animate-spin h-5 w-5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center gap-2 text-red-500">
        <AlertCircle className="h-5 w-5" />
        <span>Failed to load stories.</span>
      </div>
    );
  }

  const filteredData = stories.filter((story) => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = sortBy === "ask"
      ? story.title.toLowerCase().startsWith("ask hn:")
      : true;
    return matchesSearch && matchesType;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "new":
        return b.time - a.time;
      case "comments":
        return (b.descendants || 0) - (a.descendants || 0);
      default:
        return b.score - a.score;
    }
  });

  return (
    <main className="p-4 max-w-2xl mx-auto space-y-4">
      <ActionBar
        onSearch={setSearchQuery}
        onSort={setSortBy}
        initialSort={sortBy} // Pass the current sort value
      />
      <motion.h1
        className="text-2xl font-bold mb-4 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Flame className="h-5 w-5 text-orange-500" />
        {getSortDisplayName(sortBy)} Hacker News Stories
      </motion.h1>

      {/* Rest of your component remains the same */}
      {sortedData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <MessageSquare className="h-8 w-8 mb-2" />
          <p>No stories found</p>
        </div>
      )}

      {sortedData.map((story, i) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.04 }}
        >
          <Card className="p-4 hover:shadow transition group">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <a
                  href={story.url ?? `/post/${story.id}`}
                  target={story.url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className={`flex items-start gap-1 ${!story.url ? 'text-orange-500 hover:text-orange-600' : 'hover:underline'}`}
                >
                  <h2 className="text-lg font-semibold flex-1">
                    {story.title}
                  </h2>
                  {story.url && <ExternalLink className="h-4 w-4 text-gray-400 mt-1" />}
                </a>
                <PostMeta
                  score={story.score}
                  by={story.by}
                  time={story.time}
                  commentCount={story.descendants}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </main>
  );
}