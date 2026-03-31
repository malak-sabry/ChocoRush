# ChocoRush – Full-Stack E-Commerce Web Application

ChocoRush is a full-stack e-commerce web application specialized in selling chocolate products.
It provides a complete shopping experience for users and a dedicated admin dashboard for managing products and orders.

---

## Project Description

ChocoRush allows users to:

* Browse chocolate products
* Add products to favorites for later access
* Add products to a shopping cart
* Place orders and track their order status

The application also includes an **Admin Dashboard** that allows administrators to:

* Manage products and categories
* View incoming orders
* Confirm or delete orders

---

## Technologies Used

### Frontend

* React (Vite)
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT (JSON Web Token)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/malak-sabry/chocoRush
cd ChocoRush
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on the provided `.env.example` file.

Run the backend server:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 4. Access the Application

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:5000](http://localhost:5000)

---

## Live Demo

[https://choco-rush.kozow.com/](https://choco-rush.kozow.com/)

---

## Admin Access

By default, all registered users are normal users.

To access the **Admin Dashboard**, use the following credentials:

* Email: [admin@gmail.com](mailto:admin@gmail.com)
* Password: 123456

---

## Project Folder Structure

```
ChocoRush/
│
├── backend/
│   ├── auth/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── images/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── Components/
│   │   ├── Pages/
│   │   └── assets/
│
├── .vscode/
└── package.json
```

---

## Main Files Explanation

### Backend

#### server.js

* Entry point of the backend application
* Initializes the Express server
* Connects to MongoDB

#### config/

* Contains database connection configuration

#### models/

* Defines MongoDB schemas:

  * User
  * Product
  * Order
  * Cart
  * Category

#### routes/

* Handles API endpoints:

  * Authentication
  * Products
  * Cart
  * Orders

#### auth/

* Handles authentication and authorization
* Manages JWT tokens and cookies

#### seeders/

* Used to insert sample data into the database

---

### Frontend

#### main.jsx

* Entry point of the React application
* Defines application routes

#### Pages/

* Main pages such as:

  * Home
  * Product Details
  * Cart
  * Checkout

#### Components/

* Reusable UI components:

  * Cards
  * Navbar
  * Buttons
  * Hero sections

#### Auth/

* Authentication logic
* Login and Register context
* Cart context logic

#### Admin/

* Admin dashboard pages:

  * Manage products
  * Manage orders
  * Manage categories

#### assets/

* Static images and assets

---

## Reflection

Working on ChocoRush helped me gain practical experience in building a complete full-stack application from scratch.
Through this project, I learned how to work with NoSQL databases, implement authentication and authorization using JWT, manage tokens securely with cookies, design RESTful APIs, and structure large-scale applications.
I also improved my ability to solve real-world issues that arise when integrating frontend and backend systems.

---

## License

This project is for educational purposes.
