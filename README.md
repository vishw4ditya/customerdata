# Customer Management CRM

A modern website for admins to manage customer data.

## Features

- **Admin Authentication**: Register with an Indian phone number. System generates a unique Admin ID.
- **Password Reset**: Forgot your password? Reset it using your Admin ID.
- **Customer Management**:
  - Add customers with name, phone, and manual address input.
  - Duplicate handling: If a customer with the same name and phone is added, their "times added" count increases.
  - Delete customers easily.
- **Responsive UI**: Built with Tailwind CSS and Lucide icons.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: NeDB (Local file-based database)
- **Icons**: Lucide React

## Getting Started

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Run the development server**:

    ```bash
    npm run dev
    ```

3.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal, e.g., 3001).

## Deployment (Render)

1.  **Push to GitHub**: Push your code to a GitHub repository.
2.  **Connect to Render**:
    - Create a new **Web Service** on [Render](https://render.com).
    - Connect your GitHub repository.
    - Render will automatically detect the settings from `render.yaml`.
3.  **Important Note on Data**:
    - The free tier of Render uses an **ephemeral disk**. This means your customer and admin data will be deleted whenever the server restarts or you redeploy.
    - For permanent storage, you should use Render's **"Disks"** feature (requires a paid plan) or connect to a cloud database like **MongoDB Atlas**.

## Directory Structure

- `app/api`: Backend API routes for auth and customer management.
- `app/dashboard`: Admin dashboard UI.
- `lib/db.ts`: Database configuration and initialization.
- `data/`: Local database files (generated automatically).
