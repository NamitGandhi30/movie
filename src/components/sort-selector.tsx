"use client";

import * as React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SortAscIcon } from "lucide-react";

interface SortOption {
  label: string;
  value: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { label: "Popularity Desc", value: "popularity.desc" },
  { label: "Popularity Asc", value: "popularity.asc" },
  { label: "Rating Desc", value: "vote_average.desc" },
  { label: "Rating Asc", value: "vote_average.asc" },
  { label: "Release Date Desc", value: "release_date.desc" },
  { label: "Release Date Asc", value: "release_date.asc" },
  { label: "Title A-Z", value: "original_title.asc" },
  { label: "Title Z-A", value: "original_title.desc" }
];

interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SortSelector({ value, onChange, className }: SortSelectorProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <SortAscIcon className="w-4 h-4 text-muted-foreground" />
        <Select defaultValue={value} onValueChange={onChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 