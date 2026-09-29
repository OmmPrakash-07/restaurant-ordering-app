import Image from "next/image";
import { Plus } from "lucide-react";
import { MenuItem } from "@/types/menu";

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900">
            {item.name}
          </h3>

          <span className="whitespace-nowrap text-lg font-bold text-orange-600">
            ₹{item.price}
          </span>
        </div>

        <p className="mb-5 min-h-12 text-sm leading-6 text-gray-500">
          {item.description}
        </p>

        <button
          onClick={() => onAdd(item)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98]"
        >
          <Plus size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}