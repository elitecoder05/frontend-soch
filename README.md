# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/cdb30d33-5399-4bb3-8e09-6ca793baebdd

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cdb30d33-5399-4bb3-8e09-6ca793baebdd) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cdb30d33-5399-4bb3-8e09-6ca793baebdd) and click on Share -> Publish.

## Deployment on Vercel (Single Page App routing)

If you deploy this project to Vercel and your app uses client-side routing (React Router), you may see 404 errors if you navigate directly to a route such as `/login` or `/admin`. This happens because Vercel serves static files and doesn't automatically fall back to `index.html` for client-side routed pages.

To fix this, a `vercel.json` file is provided that rewrites non-file requests to `index.html` so the SPAs router can handle routing on the client.

Basic steps to redeploy on Vercel:

1. Make sure the `vercel.json` file is present at the project root.
2. Push your changes to your git branch.
3. Re-deploy from the Vercel dashboard or via the Vercel CLI.

If you have serverless functions under `/api`, the `vercel.json` included preserves `/api/*` routes so they are not rewritten.

If your repository includes both frontend and backend in the same repo (monorepo), make sure your Vercel project settings point the "Root Directory" to `frontend-siddu` so that it builds the front-end app instead of the backend. Example Vercel settings for this project:

- Root directory: `frontend-siddu`
- Install command: `npm install` or `pnpm install`
- Build command: `npm run build`
- Output directory: `dist`

Alternate solution: If you prefer not to use rewrites, you can switch the client router to `HashRouter` (not ideal) which uses the hash portion of the URL and avoids server-side 404s.



## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
# ai-sochh-frontend
# frontend-soch
