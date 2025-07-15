import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext, createCallerFactory } from "@/trpc/init";
import TrpcClientDemo from "./_components/TrpcClientDemo";
import TrpcApiDemo from "./_components/TrpcApiDemo";
import UserManagementDemo from "./_components/UserManagementDemo";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

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
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4 text-foreground">
					tRPC Demo App
				</h1>
				<p className="text-muted-foreground text-lg">
					A comprehensive demonstration of tRPC with Next.js and
					TypeScript
				</p>
			</div>

			{/* Server-side data */}
			<div className="mb-16">
				<div className="flex items-center gap-3 mb-8">
					<h2 className="text-2xl font-semibold text-foreground">
						Server-side Data
					</h2>
					<Badge variant="secondary">SSR</Badge>
				</div>

				<div className="grid gap-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								User Information
							</CardTitle>
							<CardDescription>
								Server-side user data
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">
										User ID:
									</span>
									<Badge
										variant="outline"
										className="font-mono"
									>
										{userInfo.userId}
									</Badge>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">
										Message:
									</span>
									<span className="text-sm">
										{userInfo.message}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Todo List</CardTitle>
							<CardDescription>
								All todos from server-side rendering
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{todos.map((todo) => (
									<div
										key={todo.id}
										className="flex items-center gap-3 p-3 border rounded-lg bg-card"
									>
										<Checkbox
											checked={todo.completed}
											disabled
											className="data-[state=checked]:bg-muted-foreground data-[state=checked]:border-muted-foreground"
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
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								Specific Todo
							</CardTitle>
							<CardDescription>Todo with ID: 1</CardDescription>
						</CardHeader>
						<CardContent>
							{specificTodo ? (
								<div className="p-3 border rounded-lg bg-card">
									<p
										className={
											specificTodo.completed
												? "line-through text-muted-foreground"
												: "text-foreground"
										}
									>
										{specificTodo.text}
									</p>
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									Todo not found
								</p>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Posts</CardTitle>
							<CardDescription>
								All posts from server-side rendering
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{posts.map((post) => (
									<div
										key={post.id}
										className="p-4 border rounded-lg bg-card"
									>
										<h4 className="font-semibold mb-2">
											{post.title}
										</h4>
										<p className="text-sm text-muted-foreground mb-3">
											{post.content}
										</p>
										<Badge variant="secondary">
											Author ID: {post.authorId}
										</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Users</CardTitle>
							<CardDescription>
								All users from server-side rendering
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{users.map((user) => (
									<div
										key={user.id}
										className="p-3 border rounded-lg bg-card"
									>
										<p className="font-medium">
											{user.name}
										</p>
										<p className="text-sm text-muted-foreground">
											{user.email}
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Client-side components */}
			<div className="space-y-16">
				<div>
					<div className="flex items-center gap-3 mb-8">
						<h2 className="text-2xl font-semibold text-foreground">
							Basic Client-side Demo
						</h2>
						<Badge variant="secondary">CSR</Badge>
					</div>
					<TrpcClientDemo />
				</div>

				<Separator />

				<div>
					<div className="flex items-center gap-3 mb-8">
						<h2 className="text-2xl font-semibold text-foreground">
							Comprehensive API Demo
						</h2>
						<Badge variant="secondary">Interactive</Badge>
					</div>
					<TrpcApiDemo />
				</div>

				<Separator />

				<div>
					<div className="flex items-center gap-3 mb-8">
						<h2 className="text-2xl font-semibold text-foreground">
							User Management Demo
						</h2>
						<Badge variant="secondary">CRUD</Badge>
					</div>
					<UserManagementDemo />
				</div>
			</div>
		</div>
	);
}
