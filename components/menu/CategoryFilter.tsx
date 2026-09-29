"use client";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const active = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}