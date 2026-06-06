# Deployment Guide: Tenant Management System Online

This guide explains how to deploy your Tenant Management System online using free-tier services: **MongoDB Atlas** (database), **Render** (backend server), and **Vercel** (frontend and admin portals).

---

## 1. Set Up Database (MongoDB Atlas)

To make your database accessible online, host it on MongoDB Atlas (free tier):

1. **Sign Up/Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. **Create a Cluster**:
   - Choose the **M0 (Free)** tier.
   - Select a region close to you (e.g., AWS / Mumbai or N. Virginia).
   - Click **Create Cluster**.
3. **Configure Security (Crucial)**:
   - Under **Database Access**: Create a database user (e.g., `dbUser`) and write down the password.
   - Under **Network Access**: Click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`). (This allows Render and Vercel servers to connect to the database).
4. **Get Connection String**:
   - Click **Connect** on your Cluster dashboard.
   - Select **Drivers** (Node.js).
   - Copy the connection string. It will look like this:
     ```text
     mongodb+srv://<dbUser>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<dbUser>` and `<password>` with your created database credentials.

---

## 2. Host the Backend (Render)

Render is great for hosting Node.js/Express applications:

1. **Create Account**: Go to [Render](https://render.com) and sign up (link it to your GitHub account).
2. **Create a Web Service**:
   - Click **New +** and select **Web Service**.
   - Connect your GitHub repository containing the project.
3. **Configure Settings**:
   - **Name**: `tenant-management-backend` (or similar).
   - **Root Directory**: `BACKEND`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: **Free**
4. **Configure Environment Variables**:
   - Go to the **Environment** tab on Render.
   - Add the following keys:
     - `MONGODB_URI`: `<Your MongoDB Atlas connection string obtained in step 1>`
     - `BASE_URL`: `<Your Render Web Service URL>` (You will see this at the top of the Render page once created, e.g. `https://tenant-management-backend.onrender.com`)
5. **Deploy**: Click **Deploy Web Service**.

---

## 3. Update Frontend & Admin Production Config

Now that you have your backend URL (e.g., `https://tenant-management-backend.onrender.com`), configure your Angular applications to point to it:

### A. Frontend Application
Open [FRONTEND/src/environments/environment.prod.ts](file:///d:/SANKET/TenancyManagement/BACKUP/PROECT%20II-TMS/FRONTEND/src/environments/environment.prod.ts) and replace the placeholders:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://<your-render-backend-url>/api',
  uploadsUrl: 'https://<your-render-backend-url>/uploads'
};
```

### B. Admin Application
Open [ADMIN/src/environments/environment.prod.ts](file:///d:/SANKET/TenancyManagement/BACKUP/PROECT%20II-TMS/ADMIN/src/environments/environment.prod.ts) and replace the placeholders:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://<your-render-backend-url>/api',
  uploadsUrl: 'https://<your-render-backend-url>/uploads'
};
```

---

## 4. Host Portals (Vercel)

Vercel natively supports Angular builds and Server-Side Rendering (SSR).

### A. Deploy Frontend Portal
1. Open your terminal and change directory to the frontend folder:
   ```bash
   cd FRONTEND
   ```
2. Run Vercel CLI (or connect your repo on vercel.com):
   ```bash
   npx vercel --prod
   ```
3. Follow the prompt instructions. Make sure to specify the project root folder as `FRONTEND`. Vercel will build and host it automatically.

### B. Deploy Admin Portal
1. Change directory to the admin folder:
   ```bash
   cd ../ADMIN
   ```
2. Run Vercel CLI (or configure a separate project on vercel.com):
   ```bash
   npx vercel --prod
   ```
3. Follow the prompt instructions. Make sure to specify the project root folder as `ADMIN`.

---

## Note on Ephemeral File Systems

Render's Free tier hosts applications on a container with an **ephemeral file system**. This means any files uploaded to `uploads/` or `userUpload/` will be deleted whenever the server restarts (which Render does periodically or when it enters sleep mode). 

For a permanent production app, you can integrate cloud file storage (such as Cloudinary or AWS S3) in your `multer` configs.
