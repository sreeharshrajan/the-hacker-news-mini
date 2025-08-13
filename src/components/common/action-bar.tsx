// src/components/common/action-bar.tsx
"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "@/utils/debounce";
import { useState, useEffect } from "react";

export type SortType = "top" | "new" | "comments" | "ask";

type Props = {
  onSearch: (query: string) => void;
  onSort: (sortBy: SortType) => void;
  initialSort?: SortType;
};

export default function ActionBar({
  onSearch,
  onSort,
  initialSort = "top"
}: Props) {
  const [input, setInput] = useState("");
  const [sortValue, setSortValue] = useState<SortType>(initialSort);
  const [isMounted, setIsMounted] = useState(false);

  // Debounce search input
  const debouncedSearch = debounce(onSearch, 300);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSortChange = (val: string) => {
    const sortType = val as SortType;
    setSortValue(sortType);
    onSort(sortType);
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between py-4">
        <Input className="max-w-sm" placeholder="Search stories..." />
        <div className="w-[160px] h-10 bg-gray-100 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between py-4">
      <Input
        type="text"
        placeholder="Search stories..."
        value={input}
        onChange={(e) => {
          const val = e.target.value;
          setInput(val);
          debouncedSearch(val);
        }}
        className="max-w-sm"
      />

      <div className="relative w-[160px]">
        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            align="end"
            sideOffset={4}
            className="z-50"
            style={{
              width: 'var(--radix-select-trigger-width)',
              // Prevent any default transforms that might cause jumps
              transform: 'none !important',
              // Ensure consistent positioning
              position: 'relative',
              top: '0',
              left: '0'
            }}
          >
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="new">Newest</SelectItem>
            <SelectItem value="comments">Most Comments</SelectItem>
            <SelectItem value="ask">Ask HN</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}