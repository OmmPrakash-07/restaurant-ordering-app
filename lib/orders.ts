import { promises as fs } from "fs";
import path from "path";

import { Order } from "@/types/order";

const ordersFile = path.join(
  process.cwd(),
  "data",
  "orders.json"
);

async function ensureOrdersFile() {
  try {
    await fs.access(ordersFile);
  } catch {
    await fs.writeFile(
      ordersFile,
      "[]",
      "utf-8"
    );
  }
}

export async function getOrders(): Promise<Order[]> {
  await ensureOrdersFile();

  const file = await fs.readFile(
    ordersFile,
    "utf-8"
  );

  return JSON.parse(file);
}

export async function addOrder(
  order: Order
): Promise<Order> {
  const orders = await getOrders();

  const updatedOrders = [order, ...orders];

  await fs.writeFile(
    ordersFile,
    JSON.stringify(updatedOrders, null, 2),
    "utf-8"
  );

  return order;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | null> {
  const orders = await getOrders();

  const orderIndex = orders.findIndex(
    (order) => order.id === id
  );

  if (orderIndex === -1) {
    return null;
  }

  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
  };

  await fs.writeFile(
    ordersFile,
    JSON.stringify(orders, null, 2),
    "utf-8"
  );

  return orders[orderIndex];
}