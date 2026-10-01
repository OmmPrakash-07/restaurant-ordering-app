import clientPromise from "@/lib/mongodb";
import { Order } from "@/types/order";

const DATABASE_NAME = "restaurant_ordering";
const COLLECTION_NAME = "orders";

async function getCollection() {
  const client = await clientPromise;

  const db = client.db(DATABASE_NAME);

  return db.collection<Order>(COLLECTION_NAME);
}

export async function getOrders(): Promise<Order[]> {
  const collection = await getCollection();

  return collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getOrderById(
  id: string
): Promise<Order | null> {
  const collection = await getCollection();

  return collection.findOne({ id });
}

export async function addOrder(order: Order): Promise<Order> {
  const collection = await getCollection();

  await collection.insertOne(order);

  return order;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | null> {
  const collection = await getCollection();

  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        status,
      },
    },
    {
      returnDocument: "after",
    }
  );

  return result ?? null;
}