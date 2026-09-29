"use client";

import { MenuItem } from "@/types/menu";
import MenuCard from "./MenuCard";

interface MenuGridProps {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
}

export default function MenuGrid({
  items,
  onAdd,
}: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
        <div className="mb-3 text-4xl">🍽️</div>

        <h3 className="text-lg font-semibold text-gray-900">
          No items found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Try another search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}