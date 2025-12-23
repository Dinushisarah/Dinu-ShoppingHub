\# Dinu ShoppingHub 🛒



Full-stack MERN e-commerce application with admin dashboard.



\## *FEATURES*



\### Customer Features

\- 🔐 User authentication (Register/Login)

\- 🛍️ Browse products with search \& filter

\- 🛒 Shopping cart functionality

\- 💳 Checkout process

\- 📦 Order history \& tracking

\- 👤 User profile management

\- 🔑 Password change



\### Admin Features

\- 📊 Dashboard with statistics

\- 📦 Product management (CRUD)

\- 🛒 Order management (Update status, Mark as paid)

\- 👥 User management (Change roles)



\## Tech Stack



\*\*Frontend:\*\*

\- React.js

\- React Router

\- Context API

\- Axios

\- CSS3



\*\*Backend:\*\*

\- Node.js

\- Express.js

\- MongoDB

\- Mongoose

\- JWT Authentication

\- bcrypt



\## Installation



\### Prerequisites

\- Node.js (v14+)

\- MongoDB

\- Git



\### Backend Setup



1\. Navigate to backend folder:

```bash

cd backend

```



2\. Install dependencies:

```bash

npm install

```



3\. Create `.env` file with:

```

PORT=5000

MONGO\_URI=your\_mongodb\_connection\_string

JWT\_SECRET=your\_jwt\_secret\_key

```



4\. Start backend:

```bash

npm run dev

```



\### Frontend Setup



1\. Navigate to frontend folder:

```bash

cd frontend

```



2\. Install dependencies:

```bash

npm install

```



3\. Start frontend:

```bash

npm start

```



\## Usage



1\. Backend runs on: `http://localhost:5000`

2\. Frontend runs on: `http://localhost:3000`

3\. Register a new account

4\. Browse products and add to cart

5\. Checkout and place orders



\### Admin Access



To access admin features:

1\. Go to MongoDB and change a user's `role` to `"admin"`

2\. Login with that user

3\. Access admin dashboard from navbar



\## Currency



Sri Lankan Rupees (Rs)



\## Author



Dinushi - SLIIT (Information Technology)



\## License



MIT

