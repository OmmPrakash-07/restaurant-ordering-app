# 🍔 Restaurant Ordering App

A modern, responsive **full-stack restaurant online ordering and order management application** built with **Next.js, TypeScript, Tailwind CSS, and MongoDB Atlas**.

The application provides a complete food-ordering experience where customers can browse and customize menu items, manage their cart, place orders, track order status, and view order history. It also includes a dedicated admin dashboard for managing customer orders and updating their status.

---

## 🚀 Live Demo

**Live Application:**
https://restaurant-ordering-app-xi.vercel.app

**GitHub Repository:**
https://github.com/OmmPrakash-07/restaurant-ordering-app

---

## ✨ Features

### 👨‍🍳 Customer Features

* 🍕 Browse restaurant menu
* 🔎 Search menu items by name and description
* 🏷️ Filter menu items by category
* 🖼️ Food images, descriptions, prices, and categories
* ⭐ Trending / popular food section
* ❤️ Add and remove favourite items
* 🧀 Customize food with add-ons
* 🛒 Add customized items to cart
* ➕ Increase item quantity
* ➖ Decrease item quantity
* 🗑️ Remove items from cart
* 💾 Persistent cart using `localStorage`
* 💰 Automatic subtotal calculation
* 🧾 Automatic 5% tax calculation
* 💵 Automatic grand total calculation
* 📱 Responsive cart experience
* 📝 Checkout form
* ✅ Client-side form validation
* 📦 Place customer orders
* 🆔 Unique order ID generation
* 🎉 Order confirmation page
* 📍 Real-time-style order status tracking
* 🔄 Automatic order status refresh
* 📜 Customer order history
* 🔁 Reorder previous orders
* ⭐ Customer reviews section
* 📱 Responsive mobile navigation

### 🛠️ Admin Features

* 📊 Dedicated admin order dashboard
* 📦 View all customer orders
* 📈 Order statistics
* 💰 Total order/revenue information
* 🔎 Search orders
* 🏷️ Filter orders by status
* 👤 View customer information
* 📋 View ordered items
* 🧀 View selected add-ons
* 💵 View subtotal, tax, and total
* 🔄 Update order status
* 💾 Order status persists in MongoDB
* 📱 Responsive admin dashboard

### 📌 Supported Order Statuses

```text
Pending
Accepted
Preparing
Completed
```

### ⚡ Technical Features

* Next.js App Router
* TypeScript
* React
* Tailwind CSS
* React Context API
* MongoDB Atlas
* MongoDB Node.js Driver
* Next.js API Routes
* Server Components
* Client Components
* `localStorage` persistence
* REST-style API endpoints
* Form validation
* Reusable React components
* Responsive UI
* Loading states
* Empty states
* Error handling
* API validation
* Environment variable support
* Vercel deployment

---

## 🧰 Tech Stack

| Technology                 | Purpose                       |
| -------------------------- | ----------------------------- |
| **Next.js**                | Full-stack React framework    |
| **React**                  | UI development                |
| **TypeScript**             | Type safety                   |
| **Tailwind CSS**           | Styling and responsive design |
| **MongoDB Atlas**          | Cloud database                |
| **MongoDB Node.js Driver** | Database connectivity         |
| **React Context API**      | Cart state management         |
| **React Hook Form**        | Form management               |
| **Zod**                    | Form/schema validation        |
| **Lucide React**           | Icons                         |
| **Vercel**                 | Production deployment         |
| **Git & GitHub**           | Version control               |

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
│   ├── order-history/
│   │   └── page.tsx
│   │
│   ├── order-success/
│   │   ├── page.tsx
│   │   └── OrderSuccessContent.tsx
│   │
│   ├── order-tracking/
│   │   └── page.tsx
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
│   ├── addons.ts
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
                         CUSTOMER
                            │
                            ▼
                     Home / Menu Page
                            │
              ┌─────────────┼─────────────┐
              │             │             │
           Search       Categories    Favorites
              │             │             │
              └─────────────┼─────────────┘
                            │
                            ▼
                    Customize Food
                            │
                       Add-ons
                            │
                            ▼
                          Cart
                            │
              ┌─────────────┼─────────────┐
              │             │             │
         Quantity       Remove Item    Persistence
                            │
                            ▼
                        Checkout
                            │
                   Customer Details
                            │
                       Validation
                            │
                            ▼
                    POST /api/orders
                            │
                            ▼
                      MongoDB Atlas
                            │
                            ▼
                    Order Confirmation
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       Order Tracking                Order History
              │                           │
              ▼                           ▼
       Status Updates                  Reorder
              │
              ▼
       Pending → Accepted
              → Preparing
              → Completed
                            │
                            ▼
                    ADMIN DASHBOARD
                            │
              ┌─────────────┼─────────────┐
              │             │             │
           View Orders    Search       Filter
                            │
                            ▼
                    Update Order Status
                            │
                            ▼
                      MongoDB Atlas
```

---

## 🌐 API Endpoints

### Menu API

#### Get Menu

```http
GET /api/menu
```

Returns the available restaurant menu items from the application's menu data source.

---

### Orders API

#### Get Orders

```http
GET /api/orders
```

Returns customer orders stored in MongoDB.

#### Create Order

```http
POST /api/orders
```

Creates a new customer order after validating menu items, quantities, and selected add-ons.

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
      "quantity": 2,
      "addons": [
        {
          "id": "extra-cheese"
        }
      ]
    }
  ]
}
```

---

### Order API

#### Get Single Order

```http
GET /api/orders/:id
```

Returns details of a specific order.

#### Update Order Status

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

## 🛒 Cart System

The application uses **React Context API** to manage cart state across the application.

Cart data is persisted in the browser using:

```text
localStorage
```

Storage key:

```text
foodie-cart
```

This allows customers to refresh or revisit the page without immediately losing their current cart.

The cart also supports customized items.

For example:

```text
Margherita Pizza
├── Extra Cheese
└── Extra Mushroom
```

Different add-on combinations are treated as separate cart items.

---

## 💰 Order Calculation

The application automatically calculates the order amount.

```text
Item Total = Item Price + Selected Add-ons

Subtotal = Σ (Item Total × Quantity)

Tax = Subtotal × 5%

Grand Total = Subtotal + Tax
```

### Example

```text
Pizza                  ₹249
Extra Cheese            ₹40
Quantity                 ×2
--------------------------------
Item Total             ₹289 × 2
Subtotal               ₹578
Tax (5%)                ₹28.90
--------------------------------
Grand Total            ₹606.90
```

The final amount is recalculated on the server before the order is stored.

---

## 🗄️ MongoDB Database

Orders are stored in **MongoDB Atlas**.

### Database

```text
restaurant_ordering
```

### Collection

```text
orders
```

Each order contains:

```text
Order ID
Customer Details
Ordered Items
Selected Add-ons
Item Quantities
Subtotal
Tax
Total
Order Status
Created At
```

MongoDB is used instead of local file storage so that customer orders persist correctly in a cloud deployment such as Vercel.

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI="your_mongodb_connection_string"
```

### Important

Never commit `.env.local` or your MongoDB credentials to GitHub.

For production deployment, configure the same variable in:

```text
Vercel → Project Settings → Environment Variables
```

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

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## ☁️ Deployment

The application is deployed using **Vercel**.

### Deployment Architecture

```text
                    GitHub
                       │
                       ▼
                    Vercel
                       │
             ┌─────────┴─────────┐
             │                   │
        Next.js App          API Routes
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                 MongoDB Atlas
```

The production `MONGODB_URI` is configured through Vercel Environment Variables.

---

## 📱 Responsive Design

The application is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📱 Tablet

Tailwind CSS responsive utilities are used to adapt layouts, navigation, cards, forms, dashboards, and modals across different screen sizes.

---

## 🧩 Main Pages

| Route             | Description                      |
| ----------------- | -------------------------------- |
| `/`               | Restaurant homepage and menu     |
| `/cart`           | Shopping cart                    |
| `/checkout`       | Customer checkout                |
| `/order-success`  | Order confirmation               |
| `/order-tracking` | Track current order status       |
| `/order-history`  | View previous orders             |
| `/admin/orders`   | Admin order management dashboard |

---

## 📊 Order Management

The admin dashboard provides an overview of customer orders.

Administrators can:

```text
View Orders
     ↓
Search Orders
     ↓
Filter by Status
     ↓
View Order Details
     ↓
View Customer Details
     ↓
View Items & Add-ons
     ↓
Update Order Status
```

Order status changes are stored in MongoDB and are reflected on the customer order-tracking page.

---

## 📸 Screenshots

Add screenshots of the deployed application here.

### 🏠 Home / Menu

```text
Add screenshot here
```

### 🛒 Cart

```text
Add screenshot here
```

### 📝 Checkout

```text
Add screenshot here
```

### 🎉 Order Success

```text
Add screenshot here
```

### 📍 Order Tracking

```text
Add screenshot here
```

### 📜 Order History

```text
Add screenshot here
```

### 👨‍💼 Admin Dashboard

```text
Add screenshot here
```

---

## 🔮 Future Improvements

Possible future enhancements include:

* 🔐 Admin authentication
* 👤 Customer authentication
* 💳 Online payment integration
* 🎟️ Coupon and discount system
* 📦 Inventory management
* 🔔 Email/SMS order notifications
* 🏪 Restaurant open/close status
* 📊 Advanced admin analytics
* 👥 Role-based access control
* 🏬 Multiple restaurant support
* 📈 Sales and revenue reports
* 🔔 Real-time notifications using WebSockets
* 💳 Payment gateway integration
* 🚚 Delivery partner management

---

## 🎯 Project Objective

The objective of this project is to demonstrate the development of a complete **full-stack restaurant ordering and order management system** using modern web technologies.

### This project demonstrates:

* Frontend development
* Responsive UI development
* React state management
* REST API development
* TypeScript type safety
* Form validation
* Database integration
* CRUD operations
* Server-side validation
* Client-side validation
* Local storage persistence
* Order management
* Admin dashboard development
* Error handling
* Loading and empty states
* Cloud database integration
* Vercel deployment
* Git/GitHub workflow

---

## 💡 Key Highlights

### Customer Experience

```text
Browse → Search → Customize → Cart
       → Checkout → Order
       → Track → Order History
```

### Admin Experience

```text
Orders → Search → Filter
       → View Details
       → Update Status
       → MongoDB
```

### Data Flow

```text
Next.js Frontend
       │
       ▼
Next.js API Routes
       │
       ▼
Validation & Calculation
       │
       ▼
MongoDB Atlas
       │
       ▼
Admin Dashboard
       │
       ▼
Customer Order Tracking
```

---

## 👨‍💻 Developer

### Omm Prakash Parida

**Full Stack Web Developer**

* GitHub: https://github.com/OmmPrakash-07
* Live Project: https://restaurant-ordering-app-xi.vercel.app

---

## 📄 License

This project was developed for **educational and assessment purposes**.

---

⭐ If you found this project interesting, consider giving the repository a star!
