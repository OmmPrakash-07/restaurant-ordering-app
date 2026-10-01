"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { MenuItem } from "@/types/menu";
import { Addon } from "@/data/addons";

export interface CartItem extends MenuItem {
  cartItemId: string;
  quantity: number;
  addons: Addon[];
  itemTotal: number;
}

interface CartContextType {
  cart: CartItem[];

  addToCart: (
    item: MenuItem,
    addons?: Addon[]
  ) => void;

  increaseQuantity: (cartItemId: string) => void;

  decreaseQuantity: (cartItemId: string) => void;

  removeFromCart: (cartItemId: string) => void;

  clearCart: () => void;

  subtotal: number;
  tax: number;
  total: number;
  cartCount: number;
}

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

function createCartItemId(
  item: MenuItem,
  addons: Addon[]
) {
  const addonIds = addons
    .map((addon) => addon.id)
    .sort()
    .join("-");

  return addonIds
    ? `${item.id}__${addonIds}`
    : item.id;
}

function calculateItemTotal(
  item: MenuItem,
  addons: Addon[]
) {
  const addonTotal = addons.reduce(
    (sum, addon) => sum + addon.price,
    0
  );

  return item.price + addonTotal;
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem("foodie-cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          const migratedCart: CartItem[] =
            parsedCart.map((item) => {
              const addons = Array.isArray(item.addons)
                ? item.addons
                : [];

              const itemTotal =
                typeof item.itemTotal === "number"
                  ? item.itemTotal
                  : calculateItemTotal(
                      item,
                      addons
                    );

              return {
                ...item,
                cartItemId:
                  item.cartItemId ??
                  createCartItemId(item, addons),
                addons,
                itemTotal,
                quantity:
                  typeof item.quantity === "number"
                    ? item.quantity
                    : 1,
              };
            });

          setCart(migratedCart);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        "foodie-cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cart, isLoaded]);

  const addToCart = (
    item: MenuItem,
    addons: Addon[] = []
  ) => {
    const cartItemId = createCartItemId(
      item,
      addons
    );

    const itemTotal = calculateItemTotal(
      item,
      addons
    );

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) =>
          cartItem.cartItemId === cartItemId
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.cartItemId === cartItemId
            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          cartItemId,
          quantity: 1,
          addons,
          itemTotal,
        },
      ];
    });
  };

  const increaseQuantity = (
    cartItemId: string
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (
    cartItemId: string
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.cartItemId === cartItemId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (
    cartItemId: string
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.cartItemId !== cartItemId
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.itemTotal * item.quantity,
    0
  );

  const tax = Number(
    (subtotal * 0.05).toFixed(2)
  );

  const total = Number(
    (subtotal + tax).toFixed(2)
  );

  const cartCount = cart.reduce(
    (count, item) =>
      count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        total,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}