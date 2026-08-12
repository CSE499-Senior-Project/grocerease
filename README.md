# GrocerEase Platform

## About the Project
GrocerEase is a comprehensive e-commerce platform tailored specifically for local, small grocery stores. Originally conceived as a SaaS solution, the platform empowers independent grocers to bring their inventory online, seamlessly manage products, and fulfill customer orders. While this iteration serves as a functional mock of the platform, the architecture is designed so that styling (typography and color schemes) can be dynamically tailored to match an individual grocery store's brand.

## Key Features

### 🛒 Core Functionality
* **Intuitive Product Catalog:** Users can effortlessly search for items, filter by grocery categories (e.g., Fresh Produce, Dairy, Bakery), and manage a real-time shopping cart.
* **Secure Authentication:** Robust user registration and login system that saves order history, manages delivery addresses, and maintains active, secure sessions.
* **Mock Checkout Flow:** A seamless checkout process that allows users to review their cart, submit a simulated payment to finalize the order, and track their order status (e.g., "Shopping", "Out for Delivery").
* **Merchant Dashboard:** A dedicated administrative portal for store managers to update product listings, adjust pricing, track stock levels, and monitor incoming delivery queues.

### ✨ Enhancements
* **Flexible Delivery Windows:** Customers can select specific delivery slots during checkout, including standard scheduling (later in the day, early next day) or a premium "ASAP (in 1 hour)" expedited option.
* **Dynamic Service Fee Calculation:** An algorithm automatically calculates the total service cost by applying a dynamic shopping and delivery fee based on the selected delivery window and the items in the cart, providing a transparent invoice breakdown.

## Tech Stack
* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Backend / Database:** Supabase (PostgreSQL)
* **Styling & UI:** Plus Jakarta Sans (Typography) and custom CSS modules.
* **Deployment:** Vercel

## Architecture
The project utilizes a modern client-server web architecture. The client is a highly responsive, single-page web application rendered via Next.js that interacts with Supabase, a Backend-as-a-Service (BaaS), for persistent relational data storage, secure user authentication, and API routing.

## Team & Workflow
Rather than adhering to rigid, siloed roles, our team adopted a flexible, agile workflow. We collaborated dynamically by assigning specific features to one another. Each team member took full ownership of their assigned features, driving them from backend logic and database integration all the way through to frontend implementation and UI refinement.

![](https://geps.dev/progress/96)