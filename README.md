## Human Resource Management System

A comprehensive Human Resource Management System (HRMS). This application streamlines employee management, attendance tracking, leave management, and payroll processing for modern organizations.

## Features

- **Authentication & Role-Based Access**: Secure login/signup with role-specific dashboards (Employee, HR).
- **Employee Management**: Manage employee profiles, details, and roles.
- **Attendance Tracking**: Real-time attendance marking and history.
- **Leave Management**: Request leave, approval workflows, and leave balance tracking.
- **Payroll Management**: Automated payroll calculation and salary slip generation.
- **Dashboard**: Interactive dashboards for admins and employees with key metrics.
- **Settings**: Configurable application settings.

## Tech Stack

### Client (Frontend)
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React (Icons)
- **State/Data**: React Hook Form, Zod (Validation), Recharts (Charts), jsPDF(Slip Generation)
- **Routing**: React Router DOM

### Server (Backend)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT, bcryptjs

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (Local or AtlasURI)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Setup Client**
   Install dependencies for the frontend:
   ```bash
   npm install
   ```
   
   Create a `.env` file in the root directory if needed (refer to project config).

3. **Setup Server**
   Navigate to the server directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

### Running the Application

1. **Start the Backend Server**
   In the `server` directory:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

2. **Start the Frontend Client**
   In the root directory:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173` (or the port shown in terminal).

## Scripts

### Client
- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run lint`: Lint the codebase.
- `npm run preview`: Preview the production build locally.

### Server
- `npm run dev`: Start the server with Nodemon (auto-restart).
- `npm start`: Start the server in production mode.

## Project Structure

- `src/`: Frontend source code (Pages, Components, Contexts).
- `server/`: Backend source code (Models, Routes, Controllers, Data).
- `public/`: Static assets.
"# hrms-frontend" 
"# hrms-frontend" 
