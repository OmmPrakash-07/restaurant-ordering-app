# 🍕 Restaurant Ordering App

A modern, responsive restaurant online ordering application built with **Next.js, TypeScript, and Tailwind CSS**.

The application allows customers to browse food items, search and filter the menu, manage their cart, place orders, and provides an admin dashboard for managing and updating order statuses.

> 🚧 **Note:** The current version uses a local JSON file for order persistence. This works in local development but is not suitable for persistent storage on Vercel. Database integration with MongoDB Atlas is planned.

---

## 🚀 Live Demo

🔗 **Live Application:**  
https://restaurant-ordering-app-xi.vercel.app/

---

## ✨ Features

### 👨‍🍳 Customer Features

- Browse restaurant menu
- Menu categories
  - Pizza
  - Burgers
  - Beverages
  - Desserts
  - Sides
- Search food items by name
- Filter menu items by category
- View food image, price, and description
- Add items to cart
- Increase/decrease item quantity
- Remove items from cart
- Automatic subtotal calculation
- 5% tax calculation
- Grand total calculation
- Cart persistence using Local Storage
- Responsive design for desktop, tablet, and mobile

### 🛒 Checkout

- Customer name
- Mobile number
- Email address
- Delivery address
- Client-side form validation
- Order submission through API
- Order success confirmation
- Unique order ID generation

### 🔐 Admin Dashboard

- View customer orders
- View customer information
- View ordered items
- View order totals
- Filter orders by status
- Update order status

Available order statuses:

- Pending
- Accepted
- Preparing
- Completed

---

## 🛠️ Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Lucide React Icons

### Backend

- Next.js App Router
- Next.js API Routes
- REST API

### Storage

- JSON-based mock storage for local development
- MongoDB Atlas planned for production persistence

### Deployment

- Vercel

---

## 📁 Project Structure

```text
restaurant-ordering-app/
│
├── app/
│   ├── admin/
│   │   └── orders/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── menu/
│   │   │   └── route.ts
│   │   │
│   │   └── orders/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   │
│   ├── cart/
│   │   └── page.tsx
│   │
│   ├── checkout/
│   │   └── page.tsx
│   │
│   ├── order-success/
│   │   ├── page.tsx
│   │   └── OrderSuccessContent.tsx
│   │
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
🔌 API Endpoints
Get Menu
GET /api/menu

Returns all available menu items.

Get Orders
GET /api/orders

Returns all customer orders.

Create Order
POST /api/orders

Creates a new customer order.

Example request:

{
  "customer": {
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "address": "123 Main Street, Bhubaneswar"
  },
  "items": [
    {
      "menuItemId": "pizza-1",
      "quantity": 2
    }
  ]
}
Update Order Status
PATCH /api/orders/:id

Example:

{
  "status": "Preparing"
}
💻 Getting Started
1. Clone the repository
git clone https://github.com/OmmPrakash-07/restaurant-ordering-app.git
2. Navigate into the project
cd restaurant-ordering-app
3. Install dependencies
npm install
4. Start the development server
npm run dev

Open:

http://localhost:3000
🏗️ Production Build

To create a production build:

npm run build

To start the production server:

npm start
📱 Application Pages
Customer
/                       → Restaurant Menu
/cart                   → Shopping Cart
/checkout               → Checkout
/order-success          → Order Confirmation
Admin
/admin/orders           → Order Management Dashboard
API
/api/menu               → Menu API
/api/orders             → Orders API
/api/orders/[id]        → Update Order Status
🧮 Order Calculation

The application calculates the order total automatically.

Subtotal = Sum of item price × quantity

Tax = Subtotal × 5%

Grand Total = Subtotal + Tax

Example:

Subtotal     ₹500
Tax (5%)      ₹25
------------------
Total        ₹525
📦 Cart Persistence

The shopping cart is stored in the browser using:

localStorage

Cart data remains available even after refreshing the page.

🔄 Order Flow
Customer
   │
   ▼
Browse Menu
   │
   ▼
Search / Filter
   │
   ▼
Add Items to Cart
   │
   ▼
Review Cart
   │
   ▼
Checkout
   │
   ▼
Validate Customer Details
   │
   ▼
POST /api/orders
   │
   ▼
Order Created
   │
   ▼
Order Success Page
   │
   ▼
Admin Dashboard
   │
   ▼
Update Order Status
🎯 Project Goals

This project was developed to demonstrate practical knowledge of:

Next.js App Router
React components
TypeScript
Tailwind CSS
REST API development
Client-side state management
Local Storage
Form validation
API error handling
Responsive web design
Admin dashboard development
Order management workflow
🚧 Future Improvements

Planned improvements include:

 MongoDB Atlas integration
 Persistent production database
 Admin authentication
 Customer authentication
 Payment gateway integration
 Order tracking
 Restaurant profile management
 Menu management from admin dashboard
 Image optimization
 Order notifications
 Improved analytics dashboard
👨‍💻 Author

Omm Prakash Parida

GitHub:
https://github.com/OmmPrakash-07

📄 License

This project is created for educational, assessment, and portfolio purposes.


### One thing before you push this README

The README currently says MongoDB integration is **planned**, which is accurate because we'll do that tomorrow. After we add MongoDB, we'll update that section and remove the Vercel storage warning.

For tonight, your repository can have:

```text
README.md
source code
menu data
images