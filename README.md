# Apollo

Apollo is a modern, space-themed community platform inspired by Reddit, built with React, TypeScript, TailwindCSS, and Convex as the backend.

![Apollo Logo](/public/apollo-transparent-logo.png)

## Features

- **User Authentication**: Secure user authentication powered by Clerk
- **Community Creation**: Create and join communities on various topics
- **Content Creation**: Share text posts and images with the community
- **Voting System**: Upvote and downvote posts to rank content
- **Comments**: Engage in discussions through a threaded comment system
- **Dark/Light Mode**: Toggle between light and dark themes
- **Responsive Design**: Fully responsive UI that works across devices
- **Real-time Updates**: Changes reflect instantly across clients

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - TailwindCSS
  - shadcn/ui Components
  - React Router

- **Backend**:
  - Convex (Backend-as-a-Service)
  - Clerk (Authentication)

## Project Structure

The project follows a typical React + Vite structure with additional Convex-specific directories:

```
apollo/
├── convex/              # Convex backend code
│   ├── schema.ts        # Database schema
│   ├── users.ts         # User-related functions
│   ├── post.ts          # Post-related functions
│   ├── comments.ts      # Comment-related functions
│   ├── subreddit.ts     # Community-related functions
│   ├── vote.ts          # Voting system functions
│   └── ...
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── lib/             # Utility functions
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Convex account
- Clerk account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/apollo.git
   cd apollo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_CONVEX_URL=your_convex_deployment_url
   VITE_PK=your_clerk_publishable_key
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. In a separate terminal, start the Convex development server:
   ```bash
   npx convex dev
   ```

## Features In Development

1. **Video Upload Support**:
   - Extend upload functionality for video files
   - Create VideoPlayer component
   - Add video transcoding support
