// lib/hn-api.ts - Robust implementation with better error handling

const BASE_URL = "https://hacker-news.firebaseio.com/v0";
const TIMEOUT = 10000; // 10 seconds timeout

// Types
export interface HNItem {
  id: number;
  deleted?: boolean;
  type?: "job" | "story" | "comment" | "poll" | "pollopt";
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export interface Story extends HNItem {
  type: "story";
  title: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
}

export interface Comment extends HNItem {
  type: "comment";
  by: string;
  time: number;
  parent: number;
}

// Cache implementation
class APICache {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  get(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

const cache = new APICache<unknown>();

// Fetch with timeout and retry logic
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out after 10 seconds");
    }

    throw error;
  }
}

// Generic fetch with caching and retry
async function fetchWithCacheAndRetry<T>(
  url: string,
  cacheKey: string,
  maxRetries = 3,
): Promise<T> {
  const cached = cache.get<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; ++attempt) {
    try {
      const response = await fetchWithTimeout(url);
      const data = (await response.json()) as T;
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      lastError = error;
      const message =
        (error instanceof Error ? error.message : String(error)) || "";
      if (message.includes("404") || message.includes("400")) break;
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 5000);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  throw new Error(
    `Failed to fetch after ${maxRetries} attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

// Fetch individual item (story, comment, etc.)
export async function fetchItem(id: number): Promise<HNItem | null> {
  if (!id || id <= 0) {
    throw new Error(`Invalid item ID: ${id}`);
  }

  try {
    const item = await fetchWithCacheAndRetry<HNItem | null>(
      `${BASE_URL}/item/${id}.json`,
      `item_${id}`,
    );

    // HN API returns null for non-existent items
    if (item === null) {
      console.log(`Item ${id} not found (API returned null)`);
      return null;
    }

    return item;
  } catch (error) {
    console.error(`Failed to fetch item ${id}:`, error);
    throw error;
  }
}

// Fetch story specifically with validation
export async function fetchStory(id: number): Promise<Story | null> {
  try {
    const item = await fetchItem(id);

    if (!item) {
      console.log(`Story ${id} not found`);
      return null;
    }

    // Validate that it's actually a story
    if (item.type && item.type !== "story") {
      console.warn(`Item ${id} is not a story (type: ${item.type}), skipping`);
      return null;
    }

    // Validate required story fields
    if (!item.title) {
      console.warn(`Story ${id} is missing required title field, skipping`);
      return null;
    }

    if (!item.by) {
      console.warn(`Story ${id} is missing required author field, skipping`);
      return null;
    }

    if (typeof item.score !== "number") {
      console.warn(`Story ${id} has invalid score, defaulting to 0`);
      item.score = 0;
    }

    if (typeof item.time !== "number") {
      console.warn(`Story ${id} is missing required time field, skipping`);
      return null;
    }
    console.log(`Successfully validated story ${id}: "${item.title}"`);
    return item as Story;
  } catch (error) {
    console.error(`Failed to fetch story ${id}:`, error);
    throw error;
  }
}

// Fetch comment specifically
export async function fetchComment(id: number): Promise<Comment | null> {
  try {
    const item = await fetchItem(id);

    if (!item) {
      return null;
    }

    // Handle deleted/dead comments
    if (item.deleted || item.dead) {
      console.log(`Comment ${id} is deleted or dead`);
      return {
        id: item.id,
        by: "[deleted]",
        time: item.time || 0,
        parent: item.parent || 0,
        type: "comment",
        deleted: item.deleted,
        dead: item.dead,
      } as Comment;
    }

    // Validate comment fields
    if (!item.by) {
      console.warn(`Comment ${id} missing author, using fallback`);
      item.by = "[unknown]";
    }

    if (!item.text && !item.deleted && !item.dead) {
      console.warn(`Comment ${id} missing text content`);
    }

    return item as Comment;
  } catch (error) {
    console.error(`Failed to fetch comment ${id}:`, error);
    throw error;
  }
}

// Fetch top stories IDs
export async function fetchTopStories(): Promise<number[]> {
  try {
    const stories = await fetchWithCacheAndRetry<number[]>(
      `${BASE_URL}/topstories.json`,
      "topstories",
    );

    if (!Array.isArray(stories)) {
      throw new Error("Invalid response format for top stories");
    }

    return stories.filter((id) => typeof id === "number" && id > 0);
  } catch (error) {
    console.error("Failed to fetch top stories:", error);
    throw error;
  }
}

// Fetch new stories IDs
export async function fetchNewStories(): Promise<number[]> {
  try {
    const stories = await fetchWithCacheAndRetry<number[]>(
      `${BASE_URL}/newstories.json`,
      "newstories",
    );

    if (!Array.isArray(stories)) {
      throw new Error("Invalid response format for new stories");
    }

    return stories.filter((id) => typeof id === "number" && id > 0);
  } catch (error) {
    console.error("Failed to fetch new stories:", error);
    throw error;
  }
}

// Fetch ask stories IDs
export async function fetchAskStories(): Promise<number[]> {
  try {
    const stories = await fetchWithCacheAndRetry<number[]>(
      `${BASE_URL}/askstories.json`,
      "askstories",
    );

    if (!Array.isArray(stories)) {
      throw new Error("Invalid response format for ask stories");
    }

    return stories.filter((id) => typeof id === "number" && id > 0);
  } catch (error) {
    console.error("Failed to fetch ask stories:", error);
    throw error;
  }
}

// Fetch show stories IDs
export async function fetchShowStories(): Promise<number[]> {
  try {
    const stories = await fetchWithCacheAndRetry<number[]>(
      `${BASE_URL}/showstories.json`,
      "showstories",
    );

    if (!Array.isArray(stories)) {
      throw new Error("Invalid response format for show stories");
    }

    return stories.filter((id) => typeof id === "number" && id > 0);
  } catch (error) {
    console.error("Failed to fetch show stories:", error);
    throw error;
  }
}

// Fetch job stories IDs
export async function fetchJobStories(): Promise<number[]> {
  try {
    const stories = await fetchWithCacheAndRetry<number[]>(
      `${BASE_URL}/jobstories.json`,
      "jobstories",
    );

    if (!Array.isArray(stories)) {
      throw new Error("Invalid response format for job stories");
    }

    return stories.filter((id) => typeof id === "number" && id > 0);
  } catch (error) {
    console.error("Failed to fetch job stories:", error);
    throw error;
  }
}

// Get stories by category with validation
export async function getStoriesByCategory(
  category: "top" | "new" | "ask" | "show" | "jobs",
  page: number = 0,
  limit: number = 30,
): Promise<Story[]> {
  try {
    if (page < 0) throw new Error("Page number must be non-negative");
    if (limit <= 0 || limit > 100)
      throw new Error("Limit must be between 1 and 100");

    let storyIds: number[] = [];

    switch (category) {
      case "top":
        storyIds = await fetchTopStories();
        break;
      case "new":
        storyIds = await fetchNewStories();
        break;
      case "ask":
        storyIds = await fetchAskStories();
        break;
      case "show":
        storyIds = await fetchShowStories();
        break;
      case "jobs":
        storyIds = await fetchJobStories();
        break;
      default:
        throw new Error(`Invalid category: ${category}`);
    }

    // Paginate
    const start = page * limit;
    const end = start + limit;
    const pageIds = storyIds.slice(start, end);

    if (pageIds.length === 0) {
      console.log(`No more stories for page ${page} in category ${category}`);
      return [];
    }

    console.log(
      `Fetching ${pageIds.length} stories for page ${page} in category ${category}`,
    );

    // Fetch stories in parallel with error handling
    const storyPromises = pageIds.map(async (id) => {
      try {
        return await fetchStory(id);
      } catch (error) {
        console.error(`Failed to fetch story ${id}:`, error);
        return null; // Continue with other stories
      }
    });

    const stories = await Promise.all(storyPromises);
    const validStories = stories.filter(
      (story): story is Story => story !== null,
    );

    console.log(
      `Successfully loaded ${validStories.length}/${pageIds.length} stories`,
    );
    return validStories;
  } catch (error) {
    console.error(`Failed to get stories for category ${category}:`, error);
    throw error;
  }
}

// Utility functions
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export function formatScore(score: number): string {
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}k`;
  }
  return score.toString();
}

export function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp * 1000) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

// Cache management utilities
export function clearCache(): void {
  cache.clear();
  console.log("API cache cleared");
}

export function getCacheStats(): { size: number } {
  return { size: cache.size() };
}
