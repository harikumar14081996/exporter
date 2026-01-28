# SR Pharmagical Exporter - Deployment Guide

This guide explains how to deploy the SR Pharmagical Exporter application. We will use **Vercel** for the Full Stack application (Frontend + Backend) and **Neon** for the PostgreSQL Database.

## Prerequisites

1.  **GitHub Account**: Your code must be pushed to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **Neon Account**: Sign up at [neon.tech](https://neon.tech).

---

## Part 1: Database Setup (Neon)

Neon is a serverless PostgreSQL provider that works perfectly with Vercel.

### Step 1: Create a Project
1.  Log in to the [Neon Console](https://console.neon.tech).
2.  Click **"New Project"**.
3.  Name it (e.g., `pharma-exporter`).
4.  Choose a region close to you (e.g., `US East (N. Virginia)`).
5.  Click **Create Project**.

### Step 2: Get Connection Details
1.  Once created, you will see a **Connection String** on the dashboard.
2.  It looks like this: `postgres://neondb_owner:AbCd123...@ep-cool-frog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
3.  **Copy this string**. You will need it for Vercel environment variables.

### Step 3: Initialize the Database
You need to create the tables in your new Neon database.

1.  Open the **"SQL Editor"** in the Neon Dashboard sidebar.
2.  Open your local file: `backend/schema.sql`.
3.  Copy the entire content of `schema.sql`.
4.  Paste it into the Neon SQL Editor.
5.  Click **Run**.
6.  You should see success messages (tables created).

---

## Part 2: Deploying to Vercel

We will deploy both the React Frontend and the Express Backend to Vercel in a single project.

### Step 1: Push to GitHub
Ensure all your latest code is pushed to your GitHub repository.

### Step 2: Import Project to Vercel
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Find your `exporter` repository and click **Import**.

### Step 3: Configure Project
Vercel should automatically detect that this is a **Vite** project.

*   **Project Name**: `sr-pharmagical-exporter` (or similar)
*   **Framework Preset**: `Vite` (Leave as is)
*   **Root Directory**: `./` (Leave as is)
*   **Build Command**: `npm run build` (Leave as is)
*   **Output Directory**: `dist` (Leave as is)

### Step 4: Environment Variables (Crucial!)
Expand the **Environment Variables** section and add the following.
**IMPORTANT**: Get the Database details from your Neon Connection String.
*Example String*: `postgres://[USER]:[PASSWORD]@[HOST]/[DBNAME]?sslmode=require`

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `DB_USER` | `neondb_owner` (from Neon) | Database User |
| `DB_PASSWORD` | `AbCd123...` (from Neon) | Database Password |
| `DB_HOST` | `ep-xyz...neon.tech` (from Neon) | Database Host |
| `DB_NAME` | `neondb` (from Neon) | Database Name |
| `DB_PORT` | `5432` | Database Port |
| `VITE_API_URL` | `/` | **Critical**: Sets API calls to relative path so they hit your own backend |
| `JWT_SECRET` | `any_long_random_string` | For admin sessions |
| `SUPER_ADMIN_PASSWORD` | `YourSecretPass` | For super admin actions |
| `CORS_ORIGIN` | `https://YOUR_VERCEL_PROJECT_URL.vercel.app` | (Optional) Restricts API access |

> **Note on VITE_API_URL**: Setting this to `/` is the best practice for this setup. The request `DELETE /api/products/1` will automatically go to your backend Serverless Function because of the rule we added in `vercel.json` (`/api/(.*)` -> `backend/server.js`).

### Step 5: Deploy
1.  Click **Deploy**.
2.  Vercel will:
    *   Build the Frontend (Vite).
    *   Build the Backend (Serverless Function).
3.  Wait for the "Congratulations!" screen.

---

## Part 3: Verify & Troubleshoot

### Verify
1.  Click the screenshot image to open your new site.
2.  The homepage should load products from your Neon database.
3.  Go to `/admin/login` and try to log in.

### Troubleshooting
*   **"Connection Refused" / Database errors**:
    *   Check your `DB_PASSWORD` and `DB_HOST` in Vercel Settings.
    *   Redeploy if you change environment variables.
*   **API returns 404**:
    *   Check `vercel.json` in your repository root. It must have the `routes` configuration to rewrite `/api/*` to `backend/server.js`.
*   **API returns 500**:
    *   Go to Vercel Dashboard -> Project -> **Logs**.
    *   Filter by **Functions**.
    *   You will see the backend error logs there (e.g., "password authentication failed").

### Updating the Site
Whenever you want to update the site:
1.  Make changes locally.
2.  `git add .`, `git commit -m "update"`, `git push`.
3.  Vercel will automatically redeploy.
