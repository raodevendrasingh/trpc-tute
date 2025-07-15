"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";

export default function TrpcClientDemo() {
	const [todoText, setTodoText] = useState("");
	const [selectedTodoId, setSelectedTodoId] = useState<number>(1);
	const utils = trpc.useUtils();

	// Client-side tRPC queries
	const { data: todos, isLoading: todosLoading } =
		trpc.todo.getTodos.useQuery();
	const { data: userInfo } = trpc.hello.useQuery();
	const { data: specificTodo, refetch: refetchSpecificTodo } =
		trpc.todo.getTodoById.useQuery({ id: selectedTodoId });

	// Client-side tRPC mutation
	const createTodoMutation = trpc.todo.createTodo.useMutation({
		onSuccess: () => {
			setTodoText("");
			utils.todo.getTodos.invalidate();
		},
	});

	const handleCreateTodo = async () => {
		if (todoText.trim()) {
			try {
				const newTodo = await createTodoMutation.mutateAsync({
					text: todoText,
				});
				alert(`Created todo: ${newTodo.text} (ID: ${newTodo.id})`);
			} catch (error) {
				console.error("Error creating todo:", error);
			}
		}
	};

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-6 text-foreground">
				Client-side Data (CSR)
			</h2>

			{/* User Info */}
			<div className="bg-primary/10 border border-primary/20 p-4 rounded-lg mb-6">
				<h3 className="font-medium mb-3 text-primary">
					User Info (Client-side):
				</h3>
				{userInfo ? (
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
				) : (
					<p className="text-sm text-muted-foreground">Loading...</p>
				)}
			</div>

			{/* Todos List */}
			<div className="bg-secondary/50 border border-secondary p-4 rounded-lg mb-6">
				<h3 className="font-medium mb-3 text-secondary-foreground">
					All Todos (Client-side):
				</h3>
				{todosLoading ? (
					<p className="text-sm text-muted-foreground">
						Loading todos...
					</p>
				) : todos ? (
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
				) : (
					<p className="text-sm text-muted-foreground">
						No todos found
					</p>
				)}
			</div>

			{/* Query with input */}
			<div className="bg-accent/50 border border-accent p-4 rounded-lg mb-6">
				<h3 className="font-medium mb-3 text-accent-foreground">
					Get Todo by ID:
				</h3>
				<div className="flex gap-2 mb-3">
					<select
						value={selectedTodoId}
						onChange={(e) =>
							setSelectedTodoId(Number(e.target.value))
						}
						className="px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
					>
						<option value={1}>ID: 1</option>
						<option value={2}>ID: 2</option>
						<option value={3}>ID: 3</option>
						<option value={999}>ID: 999 (not found)</option>
					</select>
					<button
						onClick={() => refetchSpecificTodo()}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
					>
						Refetch
					</button>
				</div>
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

			{/* Mutation */}
			<div className="bg-card border border-border p-4 rounded-lg mb-6">
				<h3 className="font-medium mb-3 text-card-foreground">
					Create New Todo (Mutation):
				</h3>
				<div className="flex gap-2">
					<input
						type="text"
						value={todoText}
						onChange={(e) => setTodoText(e.target.value)}
						placeholder="Enter todo text..."
						className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						onKeyPress={(e) =>
							e.key === "Enter" && handleCreateTodo()
						}
					/>
					<button
						onClick={handleCreateTodo}
						disabled={
							createTodoMutation.isPending || !todoText.trim()
						}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors text-sm font-medium"
					>
						{createTodoMutation.isPending
							? "Creating..."
							: "Create Todo"}
					</button>
				</div>
				{createTodoMutation.error && (
					<p className="text-destructive text-sm mt-2">
						Error: {createTodoMutation.error.message}
					</p>
				)}
			</div>
		</div>
	);
}
