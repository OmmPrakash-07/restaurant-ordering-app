# 🍕 Restaurant Ordering App

A modern and responsive restaurant online ordering application built with **Next.js, TypeScript, and Tailwind CSS**.

Customers can browse the menu, search and filter food items, manage their cart, place orders, and view order confirmation. An admin dashboard is also included for managing customer orders and updating order status.

> 🚧 **Note:** The current version uses JSON-based storage for orders during local development. MongoDB Atlas integration will be added for reliable production persistence.

## 🚀 Live Demo

https://restaurant-ordering-app-xi.vercel.app/

## ✨ Features

- 🍕 Browse restaurant menu
- 🔎 Search food items
- 🏷️ Filter by category
- 🛒 Add/remove items from cart
- ➕ Increase/decrease quantity
- 💰 Automatic subtotal, 5% tax and total calculation
- 💾 Cart persistence using Local Storage
- 📱 Responsive design for desktop, tablet and mobile
- 📝 Checkout form with validation
- 📦 Order creation through REST API
- ✅ Order success confirmation with unique Order ID
- 🔐 Admin order dashboard
- 🔄 Filter orders by status
- ⚡ Update order status
- ⏳ Loading, empty and error states

### Order Status

- Pending
- Accepted
- Preparing
- Completed

## 🛠️ Tech Stack

- **Next.js 16**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**
- **Next.js App Router**
- **Next.js API Routes**
- **REST API**
- **Local Storage**
- **JSON Storage**
- **Vercel**

## 🎯 Project Goals

This project demonstrates practical implementation of:

- Next.js App Router
- React component architecture
- TypeScript
- Tailwind CSS
- REST API development
- Client-side state management
- Local Storage persistence
- Form validation
- API error handling
- Responsive web design
- Admin dashboard development
- Order management workflow

## 📁 Project Structure

```text
restaurant-ordering-app/
│
├── app/
│   ├── admin/orders/
│   ├── api/
│   │   ├── menu/
│   │   └── orders/
│   ├── cart/
│   ├── checkout/
│   ├── order-success/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   └── cart/
│       └── CartContext.tsx
│
├── data/
│   ├── menu.json
│   └── orders.json
│
├── lib/
│   └── orders.ts
│
├── public/
│   └── images/
│
├── types/
│   ├── menu.ts
│   └── order.ts
│
├── package.json
├── tsconfig.json
└── README.md