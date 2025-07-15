"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
		<div className="space-y-6">
			{/* User Info */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">User Information</CardTitle>
					<CardDescription>Client-side user data</CardDescription>
				</CardHeader>
				<CardContent>
					{userInfo ? (
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">
									User ID:
								</span>
								<Badge variant="outline" className="font-mono">
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
					) : (
						<p className="text-sm text-muted-foreground">
							Loading...
						</p>
					)}
				</CardContent>
			</Card>

			{/* Todos List */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Todo List</CardTitle>
					<CardDescription>
						All todos from client-side query
					</CardDescription>
				</CardHeader>
				<CardContent>
					{todosLoading ? (
						<p className="text-sm text-muted-foreground">
							Loading todos...
						</p>
					) : todos ? (
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
					) : (
						<p className="text-sm text-muted-foreground">
							No todos found
						</p>
					)}
				</CardContent>
			</Card>

			{/* Query with input */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Get Todo by ID</CardTitle>
					<CardDescription>
						Query a specific todo by its ID
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex gap-2">
						<Select
							value={selectedTodoId.toString()}
							onValueChange={(value) =>
								setSelectedTodoId(Number(value))
							}
						>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">ID: 1</SelectItem>
								<SelectItem value="2">ID: 2</SelectItem>
								<SelectItem value="3">ID: 3</SelectItem>
								<SelectItem value="999">
									ID: 999 (not found)
								</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							onClick={() => refetchSpecificTodo()}
							size="sm"
						>
							Refetch
						</Button>
					</div>
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

			{/* Mutation */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Create New Todo</CardTitle>
					<CardDescription>
						Add a new todo using mutation
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex gap-2">
						<Input
							type="text"
							value={todoText}
							onChange={(e) => setTodoText(e.target.value)}
							placeholder="Enter todo text..."
							className="flex-1"
							onKeyPress={(e) =>
								e.key === "Enter" && handleCreateTodo()
							}
						/>
						<Button
							onClick={handleCreateTodo}
							disabled={
								createTodoMutation.isPending || !todoText.trim()
							}
						>
							{createTodoMutation.isPending
								? "Creating..."
								: "Create Todo"}
						</Button>
					</div>
					{createTodoMutation.error && (
						<p className="text-destructive text-sm">
							Error: {createTodoMutation.error.message}
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
