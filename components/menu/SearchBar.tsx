"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for pizza, burger, dessert..."
        className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}