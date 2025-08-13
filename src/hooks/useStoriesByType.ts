// src/hooks/useStoriesByType.ts
import { useQuery } from "@tanstack/react-query";
import { getStoriesByCategory } from "@/lib/hn-api";
import { SortType } from "@/components/common/action-bar";
import { Story } from "@/lib/hn-api";

export function useStoriesByType(type: SortType = "top", limit = 20) {
  return useQuery<Story[]>({
    queryKey: ["stories", type, limit],
    queryFn: async () => {
      // Map our SortType to the category expected by hn-api
      const categoryMap = {
        top: "top",
        new: "new",
        ask: "ask",
        comments: "top", // Comments sorting will be handled in the UI
      } as const;

      const category = categoryMap[type];
      const stories = await getStoriesByCategory(category, 0, limit);
      
      return stories;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}