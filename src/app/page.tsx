import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext, createCallerFactory } from "@/trpc/init";
import TrpcClientDemo from "./_components/TrpcClientDemo";
import TrpcApiDemo from "./_components/TrpcApiDemo";
import UserManagementDemo from "./_components/UserManagementDemo";

export default async function Home() {
	// Server-side tRPC usage - create a caller
	const ctx = await createTRPCContext();
	const caller = createCallerFactory(appRouter)(ctx);

	const todos = await caller.todo.getTodos();
	const userInfo = await caller.hello();
	const specificTodo = await caller.todo.getTodoById({ id: 1 });
	const posts = await caller.post.getPosts();
	const users = await caller.user.getUsers();

	return (
		<div className="min-h-screen p-8 max-w-4xl mx-auto bg-background">
			<h1 className="text-3xl font-bold mb-8 text-foreground">
				tRPC Demo App
			</h1>

			{/* Server-side data */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold mb-6 text-foreground">
					Server-side Data (SSR)
				</h2>

				<div className="bg-primary/10 border border-primary/20 p-4 rounded-lg mb-6">
					<h3 className="font-medium mb-3 text-primary">
						User Info:
					</h3>
					<div className="space-y-1">
						<p className="text-sm text-foreground">
							User ID:{" "}
							<span className="font-mono">{userInfo.userId}</span>
						</p>
						<p className="text-sm text-foreground">
							Message:{" "}
							<span className="font-medium">
								{userInfo.message}
							</span>
						</p>
					</div>
				</div>

				<div className="bg-secondary/50 border border-secondary p-4 rounded-lg mb-6">
					<h3 className="font-medium mb-3 text-secondary-foreground">
						All Todos:
					</h3>
					<ul className="space-y-3">
						{todos.map((todo) => (
							<li
								key={todo.id}
								className="flex items-center gap-3 p-2 bg-background/50 rounded border"
							>
								<input
									type="checkbox"
									checked={todo.completed}
									readOnly
									className="rounded w-4 h-4"
								/>
								<span
									className={
										todo.completed
											? "line-through text-muted-foreground"
											: "text-foreground"
									}
								>
									{todo.text}
								</span>
							</li>
						))}
					</ul>
				</div>

				<div className="bg-accent/50 border border-accent p-4 rounded-lg mb-6">
					<h3 className="font-medium mb-3 text-accent-foreground">
						Specific Todo (ID: 1):
					</h3>
					{specificTodo ? (
						<p
							className={
								specificTodo.completed
									? "line-through text-muted-foreground"
									: "text-foreground"
							}
						>
							{specificTodo.text}
						</p>
					) : (
						<p className="text-sm text-muted-foreground">
							Todo not found
						</p>
					)}
				</div>

				<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
					<h3 className="font-medium mb-3 text-blue-700">
						All Posts:
					</h3>
					<div className="space-y-3">
						{posts.map((post) => (
							<div
								key={post.id}
								className="p-3 bg-white rounded border"
							>
								<h4 className="font-medium text-foreground mb-1">
									{post.title}
								</h4>
								<p className="text-sm text-muted-foreground mb-2">
									{post.content}
								</p>
								<p className="text-xs text-muted-foreground">
									Author ID: {post.authorId}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
					<h3 className="font-medium mb-3 text-green-700">
						All Users:
					</h3>
					<div className="space-y-2">
						{users.map((user) => (
							<div
								key={user.id}
								className="p-3 bg-white rounded border"
							>
								<p className="font-medium text-foreground">
									{user.name}
								</p>
								<p className="text-sm text-muted-foreground">
									{user.email}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Client-side components */}
			<div className="space-y-12">
				<div>
					<h2 className="text-2xl font-semibold mb-6 text-foreground">
						Basic Client-side Demo
					</h2>
					<TrpcClientDemo />
				</div>

				<div>
					<h2 className="text-2xl font-semibold mb-6 text-foreground">
						Comprehensive API Demo
					</h2>
					<TrpcApiDemo />
				</div>

				<div>
					<h2 className="text-2xl font-semibold mb-6 text-foreground">
						User Management Demo
					</h2>
					<UserManagementDemo />
				</div>
			</div>
		</div>
	);
}
