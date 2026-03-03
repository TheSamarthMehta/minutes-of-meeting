# OAuth Setup Guide

This guide will help you set up Google, GitHub, and GitLab OAuth authentication for the Minutes of Meeting application.

## Prerequisites

- A MongoDB database (MongoDB Atlas recommended)
- Node.js installed
- The application running locally

## Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

## 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if you haven't already
6. Choose **Web application** as the application type
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Copy the **Client ID** and **Client Secret** to your `.env` file:
   ```
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

## 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the application details:
   - **Application name**: Minutes of Meeting
   - **Homepage URL**: `http://localhost:3000` (development) or your domain
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Click **Generate a new client secret**
6. Copy the **Client ID** and **Client Secret** to your `.env` file:
   ```
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

## 3. GitLab OAuth Setup

1. Go to [GitLab Applications](https://gitlab.com/-/profile/applications)
2. Fill in the application details:
   - **Name**: Minutes of Meeting
   - **Redirect URI**: `http://localhost:3000/api/auth/callback/gitlab`
   - **Scopes**: Select `read_user` and `openid`
3. Click **Save application**
4. Copy the **Application ID** and **Secret** to your `.env` file:
   ```
   GITLAB_CLIENT_ID="your-gitlab-client-id"
   GITLAB_CLIENT_SECRET="your-gitlab-client-secret"
   ```

## 4. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Add it to your `.env` file:

```
NEXTAUTH_SECRET="generated-secret-here"
```

## 5. Update Database Schema

Run the Prisma migration to update your database:

```bash
npx prisma db push
```

## 6. Restart the Development Server

After setting up all credentials:

```bash
npm run dev
```

## Testing OAuth

1. Navigate to `http://localhost:3000/login`
2. Click on any of the OAuth provider buttons (Google, GitHub, or GitLab)
3. You'll be redirected to the provider's login page
4. After successful authentication, you'll be redirected back to the dashboard

## Troubleshooting

### "Invalid Redirect URI" Error

- Make sure the redirect URI in your OAuth app matches exactly: `http://localhost:3000/api/auth/callback/{provider}`
- For production, update it to your domain: `https://yourdomain.com/api/auth/callback/{provider}`

### "Client ID not found" Error

- Double-check that your environment variables are set correctly
- Restart your development server after updating `.env`

### User Already Exists

If a user already exists with the same email but was created through traditional signup:

- The OAuth account will be linked to the existing user
- The user can login with both methods

## Production Deployment

For production:

1. Update `NEXTAUTH_URL` in your `.env`:

   ```
   NEXTAUTH_URL="https://yourdomain.com"
   ```

2. Update the redirect URIs in all OAuth provider settings to use your production domain

3. Ensure all secrets are securely stored and not committed to version control

## Security Notes

- Never commit your `.env` file to version control
- Keep your client secrets secure
- Regularly rotate your secrets
- Use environment-specific credentials for development and production
