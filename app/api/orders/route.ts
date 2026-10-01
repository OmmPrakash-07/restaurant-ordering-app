import { NextResponse } from "next/server";

import menu from "@/data/menu.json";
import { getAddonById, Addon } from "@/data/addons";
import { addOrder, getOrders } from "@/lib/orders";
import { Order, OrderStatus } from "@/types/order";

export const runtime = "nodejs";

const validStatuses: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Completed",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim().toLowerCase();

    let orders = await getOrders();

    // Filter by status
    if (
      status &&
      status !== "All" &&
      validStatuses.includes(status as OrderStatus)
    ) {
      orders = orders.filter(
        (order) => order.status === status
      );
    }

    // Search by order ID or customer details
    if (search) {
      orders = orders.filter((order) => {
        const orderId = order.id.toLowerCase();
        const customerName =
          order.customer.name.toLowerCase();
        const customerEmail =
          order.customer.email.toLowerCase();
        const customerMobile =
          order.customer.mobile.toLowerCase();

        return (
          orderId.includes(search) ||
          customerName.includes(search) ||
          customerEmail.includes(search) ||
          customerMobile.includes(search)
        );
      });
    }

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

    const orderItems: Order["items"] = body.items.map(
      (item: {
        menuItemId: string;
        quantity: number;
        addons?: { id: string }[];
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

        const requestedAddons = Array.isArray(
          item.addons
        )
          ? item.addons
          : [];

        const validatedAddons: Addon[] = [];

        for (const requestedAddon of requestedAddons) {
          const addon = getAddonById(
            menuItem,
            requestedAddon.id
          );

          if (!addon) {
            throw new Error(
              `Invalid add-on for ${menuItem.name}: ${requestedAddon.id}`
            );
          }

          validatedAddons.push(addon);
        }

        const addonTotal = validatedAddons.reduce(
          (sum, addon) => sum + addon.price,
          0
        );

        const itemTotal =
          menuItem.price + addonTotal;

        return {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
          addons: validatedAddons,
          itemTotal,
        };
      }
    );

    const subtotal = Number(
      orderItems
        .reduce(
          (sum, item) =>
            sum + item.itemTotal * item.quantity,
          0
        )
        .toFixed(2)
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