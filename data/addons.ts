import { MenuItem } from "@/types/menu";

export interface Addon {
  id: string;
  name: string;
  price: number;
}

const addonsByCategory: Record<string, Addon[]> = {
  Pizza: [
    {
      id: "extra-cheese",
      name: "Extra Cheese",
      price: 40,
    },
    {
      id: "jalapeno",
      name: "Extra Jalapeño",
      price: 30,
    },
    {
      id: "mushroom",
      name: "Extra Mushroom",
      price: 35,
    },
    {
      id: "capsicum",
      name: "Extra Capsicum",
      price: 25,
    },
  ],

  Burgers: [
    {
      id: "burger-cheese",
      name: "Extra Cheese",
      price: 30,
    },
    {
      id: "extra-egg",
      name: "Extra Egg",
      price: 30,
    },
    {
      id: "extra-sauce",
      name: "Extra Sauce",
      price: 20,
    },
    {
      id: "extra-lettuce",
      name: "Extra Lettuce",
      price: 15,
    },
  ],

  Beverages: [
    {
      id: "extra-ice",
      name: "Extra Ice",
      price: 0,
    },
    {
      id: "extra-lemon",
      name: "Extra Lemon",
      price: 10,
    },
    {
      id: "flavour-shot",
      name: "Flavour Shot",
      price: 20,
    },
  ],

  Desserts: [
    {
      id: "extra-chocolate",
      name: "Extra Chocolate",
      price: 30,
    },
    {
      id: "extra-ice-cream",
      name: "Extra Ice Cream",
      price: 40,
    },
    {
      id: "extra-nuts",
      name: "Extra Nuts",
      price: 25,
    },
  ],

  Sides: [
    {
      id: "side-cheese",
      name: "Extra Cheese",
      price: 30,
    },
    {
      id: "spicy-sauce",
      name: "Spicy Sauce",
      price: 20,
    },
    {
      id: "mayo",
      name: "Mayonnaise",
      price: 15,
    },
  ],
};

export function getAddonsForItem(
  item: MenuItem
): Addon[] {
  return addonsByCategory[item.category] ?? [];
}

export function getAddonById(
  item: MenuItem,
  addonId: string
): Addon | undefined {
  return getAddonsForItem(item).find(
    (addon) => addon.id === addonId
  );
}