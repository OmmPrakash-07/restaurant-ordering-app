import { NextResponse } from "next/server";

import {
  getOrderById,
  updateOrderStatus,
} from "@/lib/orders";

import { OrderStatus } from "@/types/order";

export const runtime = "nodejs";

const validStatuses: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Completed",
];

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { message: "Invalid order status" },
        { status: 400 }
      );
    }

    const order = await updateOrderStatus(
      id,
      body.status
    );

    if (!order) {
      return NextResponse.json(
        { message: `Order ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update order status",
      },
      { status: 500 }
    );
  }
}