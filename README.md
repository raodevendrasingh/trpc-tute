# tRPC Demo App

This project demonstrates how to use tRPC in a Next.js app with both server-side and client-side data fetching.

## What is tRPC?

tRPC (TypeScript Remote Procedure Call) is a library that allows you to easily build & consume fully typesafe APIs without schemas or code generation.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Demo page showing both SSR and CSR
│   ├── _components/
│   │   ├── TrpcClientDemo.tsx      # Basic client-side tRPC usage examples
│   │   ├── TrpcApiDemo.tsx         # Comprehensive API demo with all CRUD operations
│   │   └── UserManagementDemo.tsx  # Focused user management demo
│   └── api/trpc/[trpc]/route.ts   # API route handler
├── trpc/
│   ├── init.ts                     # tRPC initialization and context
│   ├── client.tsx                  # Client-side tRPC setup
│   ├── server.tsx                  # Server-side tRPC setup
│   ├── query-client.ts             # React Query client configuration
│   └── routers/
│       ├── _app.ts                 # Main router combining all feature routers
│       ├── user.ts                 # User management procedures
│       ├── post.ts                 # Post management procedures
│       └── todo.ts                 # Todo management procedures
```

## How to Use tRPC

### 1. Server-side Usage (in Server Components)

Server components can use tRPC by creating a caller factory and calling procedures directly with namespaced routers.

### 2. Client-side Usage (in Client Components)

Client components use React Query hooks with tRPC and proper cache invalidation for immediate UI updates.

## Available Procedures

### Todo Router (`trpc.todo.*`)

#### Queries

-   `getTodos()` - Returns all todos
-   `getTodoById({ id: number })` - Returns a specific todo by ID

#### Mutations

-   `createTodo({ text: string })` - Creates a new todo
-   `updateTodo({ id: number, text?: string, completed?: boolean })` - Updates a todo
-   `deleteTodo({ id: number })` - Deletes a todo
-   `toggleTodo({ id: number })` - Toggles todo completion status

### User Router (`trpc.user.*`)

#### Queries

-   `getUsers()` - Returns all users
-   `getUserById({ id: number })` - Returns a specific user by ID

#### Mutations

-   `createUser({ name: string, email: string })` - Creates a new user
-   `updateUser({ id: number, name?: string, email?: string })` - Updates a user
-   `deleteUser({ id: number })` - Deletes a user

### Post Router (`trpc.post.*`)

#### Queries

-   `getPosts()` - Returns all posts
-   `getPostById({ id: number })` - Returns a specific post by ID

#### Mutations

-   `createPost({ title: string, content: string, authorId: number })` - Creates a new post
-   `updatePost({ id: number, title?: string, content?: string })` - Updates a post
-   `deletePost({ id: number })` - Deletes a post

### General Procedures

#### Queries

-   `hello()` - Returns user information from context

## Key Features Demonstrated

1. **Type Safety**: All procedures are fully typed across namespaced routers
2. **Server-side Rendering**: Use tRPC in server components with caller factory
3. **Client-side Queries**: Use React Query hooks with tRPC and proper cache invalidation
4. **CRUD Operations**: Complete Create, Read, Update, Delete operations for all entities
5. **Mutations with Cache Invalidation**: Proper cache management for immediate UI updates
6. **Input Validation**: Using Zod schemas for input validation across all procedures
7. **Context**: Access user context in procedures
8. **Error Handling**: Proper error handling patterns
9. **Namespaced Routers**: Organized like REST API structure (user, post, todo)
10. **In-memory Persistence**: Mutations actually persist changes during the session

## Adding New Procedures

To add a new procedure, you can either add to existing routers or create a new router. Edit the appropriate router file in `src/trpc/routers/` and register new routers in `src/trpc/routers/_app.ts`.

## Benefits of tRPC

1. **Full Type Safety**: End-to-end TypeScript support with namespaced routers
2. **No Code Generation**: Types are inferred automatically across all procedures
3. **Great DX**: Excellent autocomplete and error messages with organized structure
4. **React Query Integration**: Built-in caching, background updates, and invalidation
5. **Lightweight**: No GraphQL complexity, just TypeScript functions
6. **Flexible**: Works with any backend (Next.js, Express, etc.)
7. **Scalable Architecture**: Organized routers make it easy to manage large APIs
8. **Real-time Updates**: Mutations immediately reflect in the UI with proper cache invalidation

## Component Structure

The project includes three main demo components:

1. **TrpcClientDemo**: Basic client-side usage patterns
2. **TrpcApiDemo**: Comprehensive demo showing all CRUD operations across all routers
3. **UserManagementDemo**: Focused example of user management procedures

## Running the Demo

1. Start the development server: `npm run dev`
2. Open `http://localhost:3000`
3. See both server-side and client-side data fetching in action:
    - **Server-side section**: Shows initial data loaded via SSR
    - **Client-side sections**: Interactive demos with real-time updates
4. Try creating, updating, and deleting todos, users, and posts
5. Notice how changes immediately reflect in the UI thanks to cache invalidation
6. Test all CRUD operations across different entity types

The demo shows real-time examples of all tRPC features working together in a Next.js app with proper state management and immediate UI updates.
