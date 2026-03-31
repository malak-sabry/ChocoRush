1. Project Description
ChocoRush is a full-stack e-commerce web application specialized in selling chocolate products.
The system allows users to browse products, add items in their favorites for later access or add items to
their cart, and place orders and tracking their order state.
The application also includes an Admin Dashboard that allows managing products and viewing orders
for confirming or deleting them.
Technologies Used:
• Frontend: React (Vite) , Tailwind CSS
• Backend: Node.js + Express.js
• Database: MongoDB
• Authentication: JWT (JSONWebToken)
2. Setup Steps
1. Clone the Project
git clone https://github.com/malak-sabry/chocoRush
cd ChocoRush
2. Backend Setup
cd backend
npm install
Create .env file:
(look at .env.example file)
Run backend:
npm run dev
3. Frontend Setup
cd frontend
npm install
npm run dev
4. Open the App
• Frontend: http://localhost:5173
• Backend: http://localhost:5000
5. Demo Live: https://choco-rush.kozow.com/
6. Admin Access
By default, users are normal users.
To access the admin dashboard, use:
• Email: admin@gmail.com
• Password: 123456
3. Folder Structure
ChocoRush/
│
├── backend/
│ ├── auth/
│ ├── config/
│ ├── models/
│ ├── routes/
│ ├── seeders/
│ ├── images/
│ └── server.js
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── Admin/
│ │ ├── Auth/
│ │ ├── Components/
│ │ ├── Pages/
│ │ └── assets/
│
├── .vscode/
└── package.json
4. Main Files Explanation
Backend
• server.js
o Entry point of the backend
o Initializes Express server and connects to MongoDB
• config/
o Contains database connection configuration
• models/
o Defines database schemas (User, Product, Order, Cart, Categories)
• routes/
o Handles API endpoints (auth, products, cart, orders)
• auth/
o Handles authentication logic with token and cookie
• seeders/
o Used to insert sample data into the database
Frontend
• main.jsx
o Entry point of the React app and contains routes
• Pages/
o Main pages like Home, Product Details, Cart, Checkout
• Components/
o Reusable UI components (cards, navbar, buttons,hero img and )
• Auth/
o Login and Register context and cart context logic
• Admin/
o Admin dashboard pages (manage products/orders/categories)
• assets/
o Images
5. Reflection
Working on ChocoRush helped me understand how to build a complete full-stack application from
scratch.
I learned how to work with NoSQL databases, how to implement authentication and authorization
systems, and how to handle tokens and store them in cookies.
I also learned how to work with large projects, manage APIs within a project, and solve problems that
arise when connecting the frontend and backend.
