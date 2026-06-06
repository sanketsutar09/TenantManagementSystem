# Deployment Instructions

## Deploy to Vercel

1.  **Install Vercel CLI** (if not already installed):
    ```bash
    npm i -g vercel
    ```
    *Alternatively, you can use `npx` without installing globally.*

2.  **Login to Vercel**:
    ```bash
    npx vercel login
    ```

3.  **Deploy**:
    Run the following command in the project root:
    ```bash
    npx vercel
    ```

4.  **Production Deployment**:
    ```bash
    npx vercel --prod
    ```

## Notes
- The project is configured for Angular SSR.
- Build artifacts are located in `dist/FRONTEND`.
