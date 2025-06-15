
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1a7fad3d-d926-4c1b-92f7-5166e071d8dd

## Overview

This project is a modern web application that uses emotion recognition AI to analyze users' emotional states via camera or uploaded images. It leverages a FastAPI backend for AI-powered inference and Supabase for authentication, real-time database, and profile management.

## Technologies Used

- **React** / **TypeScript** (frontend)
- **Vite** (build tool)
- **Supabase** (database, auth, real-time)
- **Shadcn UI** & **Tailwind CSS** (UI/Styling)
- **FastAPI** (AI backend, must be run separately)
- **Recharts** (charts/visualizations)

## Running Locally

1. **Clone this repo and install dependencies:**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   npm install
   ```

2. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

3. **Make sure the FastAPI server is running** on `localhost:8000`.

4. **Configure Supabase** secrets and settings as needed (see `/supabase` folder).

## Deployment & Domains

- You can deploy the project via the [Lovable Editor](https://lovable.dev/projects/1a7fad3d-d926-4c1b-92f7-5166e071d8dd).
- Custom domains are supported; see Project > Settings > Domains in the Lovable dashboard.

## Security Notes

- Row Level Security (RLS) is enabled for the `profiles` table in Supabase.
- For additional best practices, review [Supabase Security Advisor](https://supabase.com/docs/guides/platform/security-advisor).

## Useful Links

- [Lovable Docs](https://docs.lovable.dev/)
- [Supabase Docs](https://supabase.com/docs/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)

---

*For any improvements or issues, please collaborate via pull requests or reach out on the project chat in Lovable.*

