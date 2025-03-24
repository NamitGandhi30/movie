"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ArrowDownAZIcon } from "lucide-react";

export type SortOption = {
  label: string;
  value: string;
};

// Default sort options
export const SORT_OPTIONS: SortOption[] = [
  { label: "Popularity", value: "popularity.desc" },
  { label: "Rating", value: "vote_average.desc" },
  { label: "Release Date (New)", value: "release_date.desc" },
  { label: "Release Date (Old)", value: "release_date.asc" },
  { label: "Title A-Z", value: "original_title.asc" },
  { label: "Title Z-A", value: "original_title.desc" },
];

export interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
  className?: string;
}

export function SortSelector({ 
  value, 
  onChange,
  options = SORT_OPTIONS,
  className
}: SortSelectorProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <ArrowDownAZIcon className="w-4 h-4 text-muted-foreground" />
        <Select defaultValue={value} onValueChange={onChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
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