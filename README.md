# A Sensible Template

This is a template for creating a new full-stack web application. See [Principle & Convention](#principle--convention) for the rationale behind the template, including helper cli commands.

- [A Sensible Template](#a-sensible-template)
  - [Installation](#installation)
  - [Local Development Setup](#local-development-setup)
  - [File Structure](#file-structure)
  - [Authentication](#authentication)
    - [Current User](#current-user)
  - [Database](#database)
  - [Hosting](#hosting)
  - [Deployment](#deployment)
  - [Principle \& Convention](#principle--convention)
    - [Sensible defaults](#sensible-defaults)
    - [Helpful cli commands](#helpful-cli-commands)
    - [Client-side global state management (with Jotai)](#client-side-global-state-management-with-jotai)
    - [Staying up-to-date with the template](#staying-up-to-date-with-the-template)
    - [Example CRUD Operations](#example-crud-operations)

## Installation

The project uses NPM (>=10.8.2) and Node.js (>=20.18.0)

```bash
npm install
```

## Local Development Setup

1. Install the dependencies with `npm install`.
2. Provision a local postgres database. See [local postgres setup](https://redwoodjs.com/docs/local-postgres-setup#install-postgres) for instructions on how to install postgresql for your operating system.
3. Create a `.env` file in the root directory of the project and add the following environment variables. See `.env.example`. (skip `DEV_USER_CLERK_ID` for now).
4. Run the development server with `npm run dev`.
5. Create a Clerk application and use the development instance, and copies the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to the `.env` file.
6. Authenticate to the app at `http://localhost:3000` _(A new Clerk user will be created in your Clerk's application)._
7. Get the `DEV_USER_CLERK_ID` on the `/` page, the add it to the `.env` file.
8. Run `prisma migrate reset` to reset and seed the database with current user and more.

## File Structure

```text
app/
├── api/
├── lib/
│   ├── actions.ts
│   ├── auth/
│   │   ├── server.ts
│   │   ├── client.ts
│   ├── data.ts
│   ├── db.ts
│   ├── definitions.ts
│   ├── store.ts
│   └── utils.ts
├── ui/
├── global-error.tsx
├── layout.tsx
├── page.tsx
scripts/
├── seed.ts
```

- `app` - app directory, contains code for your app.
- `api` - [routes handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers): routes.ts
- `ui` - reusable user interface components.
- `lib` - shared code such as utilities, definitions, and more.
  - `auth` - authentication functions.
    - `server.ts` - server-side authentication functions.
    - `client.ts` - client-side authentication functions.
  - `data.ts` – data fetching functions.
  - `actions.ts` - data mutating and cache revalidating functions.
  - `store.ts` - global state management. see [client-side global state management](#client-side-global-state-management-with-jotai).

## Authentication

This template uses Clerk for authentication.

- **Local development environment** requires creating a new Clerk application. The [development instance](https://clerk.com/docs/deployments/environments#development-instance) is enough for supporting a local prototype.
- **Deployed environment** requires creating a Clerk [production instance](https://clerk.com/docs/deployments/overview). Note that you'll need to configure a webhook for the production application. See [deployment](#deployment) for more details. See trade-off in production vs. development clerk application instance [here](https://clerk.com/docs/deployments/environments#development-instance).

### Current User

There are two distinct user states in the system: the Clerk User (auth user) and the Application User (db user). The Clerk User is the user that is authenticated with Clerk. The Application User is the user that is in the database upon sign-up, it is created through a webhook on Clerk. The db user id is the same as the clerk user id. The db user is the user that is used throughout the application.

```tsx
// server-side
import { auth } from '@clerk/nextjs/server'
import { fetchCurrentUser } from '@/app/lib/auth/server'

export default function ServerComponent() {
  const { userId } = auth()
  const currentUser = await fetchCurrentUser()
  // userId === currentUser.id
  // ...
}
```

```tsx
// client-side
'use client'

import { useAuth } from '@clerk/nextjs'
import { useCurrentUser } from '@/app/lib/auth/client'

export default function ClientComponent() {
  const { currentUser } = useCurrentUser()
  const { userId } = useAuth()
  // userId === currentUser.id
  // ...
}
```

## Database

The template uses postgresql with Prisma, a Node.js and TypeScript ORM. Prisma's schema provides a declarative approach to defining your application's data models, and Prisma Migrate leverages this schema to simplify database migrations.

Since we are working in a serverless environment (NextJS deployed on Vercel), we need to set up [connection pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#serverless-environments-faas) using a tool like [PgBouncer](https://www.pgbouncer.org/). That’s because every function invocation may result in a new connection to the database.

Locally, `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` are the same. In a deployed serverless environment, `POSTGRES_URL_NON_POOLING` is the connection string to the database used by Prisma Migrate, and `POSTGRES_PRISMA_URL` is the connection string to pgBouncer used by Prisma Client. See [here](https://www.prisma.io/docs/guides/deployment/serverless/deploy-to-vercel) for more details.

## Hosting

Vercel for hosting the NextJS app, the database, and blob storage. Clerk for authentication.

While Vercel provides PostgreSQL hosting services ([Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)), it comes wih the cost of [cold starts](https://vercel.com/docs/storage/vercel-postgres/limits#vercel-postgres-cold-starts). To avoid cold starts, we recommend using the [supabase database integration on Vercel](https://supabase.com/blog/supabase-vercel-partnership).

## Deployment

NOTE: do not authenticate to the app before completing the following steps. You might run into issues with Clerk.

1. Create a Clerk application (for authentication).
2. Create a Vercel project (for hosting) — select a region close to your users.
3. Create a Vercel Postgres or Blob — select a region close to your users. Note: Vercel serverless functions and Postgres/Blobs regions should be as close as possible to reduce latency.
4. Add the following environment variables to Vercel, except (`CLERK_WEBHOOK_USER_SECRET` for now).
5. Deploy the project to Vercel.
6. Assign a domain (`[example.com]`) to the Vercel project > Settings > Domains.
7. Create a webhook on Clerk: endpoint `https://[example.com]/api/webhooks/auth` subscribed to `user.created` event.
8. Add the signing secret `CLERK_WEBHOOK_USER_SECRET` to the Vercel environment variables.
9. Re-deploy the project to Vercel.
10. tada!

```.env
<!-- Clerk -->
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_************
CLERK_SECRET_KEY=sk_test_************
CLERK_WEBHOOK_USER_SECRET=whsec_************
```

---

## Principle & Convention

- flexibility over maintainability
- follow codebase convention from [NextJS Tutorial](https://nextjs.org/learn)

### Sensible defaults

- `npm run dev` always run `prisma generate` and `prisma migrate dev` to ensure the data model types and migrations are up to date.
- styles
  - tailwindcss-typography - apply [prose](https://tailwindcss.com/docs/typography-plugin) to your liking on html elements. note: setting it from the root layout messes with the default Clerk `<UserButton />` styling.
  - tailwindcss-form - [strategy only “class”](https://github.com/tailwindlabs/tailwindcss-forms?tab=readme-ov-file#using-only-global-styles-or-only-classes).
- folder and file names
  - **kabab-case** based on the nextjs convention (it’s all over the nextjs documenation)

### Helpful cli commands

- prisma
  - `prisma migrate dev` — apply migration.
  - `prisma migrate reset` — reset database and seed.
  - `prisma studio` — interactive dashboard to the database.
  - `prisma db seed` — 🌱.
- vercel
  - `vercel whoami` — check who you are. Make sure you are on your team's account.
  - `vercel logs -f` — watch a deployed project logs live 🔥.
  - `vercel alias set` — apply a deployment-url to a custom-domain.
  - `vercel link` — lint local repo to a deployed vercel project.
  - `vercel pull` — pull existing env variables to local machine.

### Client-side global state management (with Jotai)

```tsx
// lib/stores.ts
export const projectsAtom = atom<Project[]>([])

// the first client component receiving the projects data from a server component
const projects = props.projects
const [_value, setValue] = useAtom(projectsAtom)
useEffect(() => {
  setValue(projects)
}, [user, setValue])

// anywhere deep in the client component tree
const projects = useAtomValue(projectsAtom)
```

### Staying up-to-date with the template

It's not worthwhile to invest effort in developing a custom mechanism for staying up-to-date with the Template repository. The most practical solution, as suggested [here](https://stackoverflow.com/a/56577320), involves adding a git remote to the Template and merging with the **`--allow-unrelated-histories`** flag. However, this approach has the drawback of generating messy git messages unrelated to the forked repository.

Given that we anticipate having no more than two or three ongoing prototypes simultaneously, it is acceptable to manually and individually commit new infrastructure changes to the application and then separately upgrade the Template repository. This approach avoids the issue of cluttered git messages.

This process benefits new prototype repositories, and the base template will continue to evolve as we gain experience with additional prototypes. Eventually, the base template will serve as the foundation for the starter for a B2B solution with a non-prototype focus in the future.

### Example CRUD Operations

For basic Create, Read, Update, and Delete (CRUD) operations related to users, please refer to the [`app/example/users`](app/example) folder. This folder contains all the necessary files and code for managing users in the application.
