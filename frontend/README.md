A full-stack admin dashboard for managing user onboarding requests with an approval workflow, built with React and Supabase.

Features

Authentication — Email/password signup and login via Supabase Auth
Dashboard — At-a-glance stats: total, pending, approved, and rejected indents
Indent Form — Submit a new user onboarding request (name, username, email, password)
Approval Queue — Admin-only view to approve or reject pending indents; approving auto-creates the user's real auth account
Setting — View the logged-in user's profile details (name, email, role, join date)

Tech Stack

Frontend React
Backend/DB Supabase (Postgres + Auth)  
 Styling Inline styles

Setup & Run Locally
clone and install
npm install

Create a Supabase project at

Run the schema— open the SQL Editor in your Supabase dashboard, paste the contents of schema.sql, and run it.

Disable email confirmation (recommended for fast local testing)
Add environment variables — create a .env file in the project root:

VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_KEY=your-anon-public-key

Start the dev server

npm run dev
App runs at http://localhost:5173

Usage Flow

1. Sign up for a new account, then log in.
2. Go to Indent and submit a new onboarding request (name, username, email, password).
3. To act on requests, your account needs the admin role — set this manually in Supabase's Table Editor by editing your row in profiles and changing role from user to admin.
4. Go to Approval, review pending requests, and Approve or Reject them. Approving creates a real Supabase Auth account for that person.
5. Check Dashboard for updated stats, and Settings to view your own profile.

Future Improvements

- Hide the "Approval" link in the sidebar for non-admin users (currently access is blocked at the page level, not hidden in navigation)
- Add pagination/filtering to the Approval Queue and Dashboard
