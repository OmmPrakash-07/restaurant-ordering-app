# 🍔 Restaurant Ordering App

A modern, responsive full-stack restaurant online ordering and order management application built with **Next.js, TypeScript, Tailwind CSS, and MongoDB Atlas**.

The application allows customers to browse restaurant menu items, search and filter food, manage their cart, place orders, and receive an order confirmation. It also includes an admin dashboard for viewing and managing customer orders.

---

## 🚀 Live Demo

**Live Application:**
https://restaurant-ordering-app-xi.vercel.app

**GitHub Repository:**
https://github.com/OmmPrakash-07/restaurant-ordering-app

---

## ✨ Features

### 👨‍🍳 Customer Features

* Browse restaurant menu
* Restaurant information section
* Food categories
* Search menu items by name
* Filter items by category
* Responsive food cards
* Food images, descriptions, and prices
* Add items to cart
* Increase/decrease item quantity
* Remove items from cart
* Persistent cart using `localStorage`
* Automatic subtotal calculation
* 5% tax calculation
* Grand total calculation
* Responsive cart page
* Checkout form
* Client-side form validation
* Order submission
* Order success confirmation
* Unique Order ID generation

### 🛠️ Admin Features

* Separate admin orders dashboard
* View all customer orders
* Order statistics
* Filter orders by status
* View customer information
* View ordered items
* View order totals
* Update order status
* Supported statuses:

  * Pending
  * Accepted
  * Preparing
  * Completed
* Order status persists in MongoDB

### ⚡ Technical Features

* Next.js App Router
* TypeScript
* Tailwind CSS
* React Context API
* MongoDB Atlas
* Next.js API Routes
* Server and Client Components
* Responsive design
* Loading states
* Empty states
* Error handling
* Environment variable support
* Vercel deployment

---

## 🧰 Tech Stack

| Technology             | Purpose                       |
| ---------------------- | ----------------------------- |
| Next.js                | Full-stack React framework    |
| TypeScript             | Type safety                   |
| React                  | UI development                |
| Tailwind CSS           | Styling and responsive design |
| MongoDB Atlas          | Order database                |
| MongoDB Node.js Driver | Database connection           |
| React Context API      | Cart state management         |
| Lucide React           | Icons                         |
| Vercel                 | Deployment                    |
| Git & GitHub           | Version control               |

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
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── cart/
│       └── CartContext.tsx
│
├── data/
│   └── menu.json
│
├── lib/
│   ├── mongodb.ts
│   └── orders.ts
│
├── public/
│   └── images/
│
├── types/
│   ├── menu.ts
│   └── order.ts
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔄 Application Flow

```text
Customer
   │
   ▼
Home / Menu
   │
   ├── Search
   ├── Category Filter
   └── Add to Cart
          │
          ▼
        Cart
          │
          ├── Increase Quantity
          ├── Decrease Quantity
          └── Remove Item
          │
          ▼
       Checkout
          │
          ├── Customer Details
          └── Validation
          │
          ▼
      POST /api/orders
          │
          ▼
     MongoDB Atlas
          │
          ▼
    Order Success
          │
          ▼
    Admin Dashboard
          │
          ├── View Orders
          ├── Filter Orders
          └── Update Status
```

---

## 🌐 API Endpoints

### Menu API

#### Get Menu

```http
GET /api/menu
```

Returns all available restaurant menu items.

---

### Orders API

#### Get Orders

```http
GET /api/orders
```

Returns all customer orders.

#### Create Order

```http
POST /api/orders
```

Creates a new customer order and stores it in MongoDB.

Example request:

```json
{
  "customer": {
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "address": "Bhubaneswar, Odisha"
  },
  "items": [
    {
      "menuItemId": "pizza-1",
      "quantity": 2
    }
  ]
}
```

---

### Update Order Status

```http
PATCH /api/orders/:id
```

Example request:

```json
{
  "status": "Preparing"
}
```

Supported statuses:

```text
Pending
Accepted
Preparing
Completed
```

---

## 🛒 Cart Persistence

Cart information is stored in the browser using:

```text
localStorage
```

Storage key:

```text
foodie-cart
```

This allows customers to refresh the page without losing their current cart.

---

## 💰 Order Calculation

The application calculates the order amount automatically.

```text
Subtotal = Σ (Item Price × Quantity)

Tax = Subtotal × 5%

Grand Total = Subtotal + Tax
```

Example:

```text
Subtotal:    ₹500
Tax (5%):     ₹25
------------------
Total:       ₹525
```

---

## 🗄️ MongoDB Database

Orders are stored in **MongoDB Atlas**.

Database:

```text
restaurant_ordering
```

Collection:

```text
orders
```

Each order contains:

```text
Order ID
Customer Details
Ordered Items
Subtotal
Tax
Total
Status
Created At
```

MongoDB is used instead of local file storage so that orders can persist correctly in a cloud deployment such as Vercel.

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI="your_mongodb_connection_string"
```

### Important

Never commit `.env.local` to GitHub.

The project uses:

```text
.env.local
```

for local development and Vercel Environment Variables for production.

---

## 💻 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/OmmPrakash-07/restaurant-ordering-app.git
```

### 2. Enter the project

```bash
cd restaurant-ordering-app
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure MongoDB

Create:

```text
.env.local
```

Add:

```env
MONGODB_URI="your_mongodb_connection_string"
```

### 5. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

To run the production server:

```bash
npm start
```

---

## ☁️ Deployment

The application is deployed using **Vercel**.

Deployment architecture:

```text
GitHub
   │
   ▼
Vercel
   │
   ├── Next.js Application
   └── API Routes
          │
          ▼
     MongoDB Atlas
```

The `MONGODB_URI` environment variable is configured in Vercel for production.

---

## 📱 Responsive Design

The application is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📱 Tablet

The UI uses Tailwind CSS responsive utilities to adapt layouts to different screen sizes.

---

## 🧩 Main Pages

| Page             | Description            |
| ---------------- | ---------------------- |
| `/`              | Restaurant menu        |
| `/cart`          | Shopping cart          |
| `/checkout`      | Customer checkout      |
| `/order-success` | Order confirmation     |
| `/admin/orders`  | Admin order management |

---

## 📸 Screenshots

Add screenshots of your application here before final submission.

### Home / Menu

```text
Add screenshot here
```

### Cart

```text
Add screenshot here
```

### Checkout

```text
Add screenshot here
```

### Order Success

```text
Add screenshot here
```

### Admin Dashboard

```text
Add screenshot here
```

---

## 🔮 Future Improvements

Possible future enhancements include:

* Admin authentication
* Customer authentication
* Online payment integration
* Order tracking for customers
* Restaurant open/close status
* Inventory management
* Coupon and discount system
* Email/SMS order notifications
* Customer order history
* Multiple restaurant support
* Advanced admin analytics
* Role-based access control

---

## 🎯 Project Objective

The objective of this project is to demonstrate the development of a complete full-stack restaurant ordering system using modern web technologies.

The project demonstrates:

* Frontend development
* REST API development
* State management
* Form validation
* Database integration
* CRUD operations
* Responsive UI development
* Error handling
* Cloud deployment
* Git/GitHub workflow

---

## 👨‍💻 Developer

**Omm Prakash Parida**

Full Stack Web Developer

* GitHub: [OmmPrakash-07](https://github.com/OmmPrakash-07)

---

## 📄 License

This project was developed for educational and assessment purposes.
