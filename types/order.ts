export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Preparing"
  | "Completed";

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Customer {
  name: string;
  mobile: string;
  email: string;
  address: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}