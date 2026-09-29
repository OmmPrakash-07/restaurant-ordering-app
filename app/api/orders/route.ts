import { NextResponse } from "next/server";

import menu from "@/data/menu.json";
import { addOrder, getOrders } from "@/lib/orders";
import { Order } from "@/types/order";

export const runtime = "nodejs";

export async function GET() {
  try {
    const orders = await getOrders();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET orders error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.customer ||
      !body.items ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          message: "Invalid order data",
        },
        {
          status: 400,
        }
      );
    }

    const orderItems = body.items.map(
      (item: {
        menuItemId: string;
        quantity: number;
      }) => {
        const menuItem = menu.find(
          (menuItem) =>
            menuItem.id === item.menuItemId
        );

        if (!menuItem) {
          throw new Error(
            `Menu item not found: ${item.menuItemId}`
          );
        }

        if (
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
        ) {
          throw new Error("Invalid item quantity");
        }

        return {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
        };
      }
    );

    const subtotal = orderItems.reduce(
        (sum: number, item: Order["items"][number]) =>
        sum + item.price * item.quantity,
        0
    );

    const tax = Number(
      (subtotal * 0.05).toFixed(2)
    );

    const total = Number(
      (subtotal + tax).toFixed(2)
    );

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customer: {
        name: body.customer.name,
        mobile: body.customer.mobile,
        email: body.customer.email,
        address: body.customer.address,
      },
      items: orderItems,
      subtotal,
      tax,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    await addOrder(newOrder);

    return NextResponse.json(
      {
        message: "Order placed successfully",
        order: newOrder,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("ORDER API ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to place order",
      },
      {
        status: 500,
      }
    );
  }
}