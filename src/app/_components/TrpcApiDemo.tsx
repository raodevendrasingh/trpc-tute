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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrpcApiDemo() {
	const [todoText, setTodoText] = useState("");
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [postTitle, setPostTitle] = useState("");
	const [postContent, setPostContent] = useState("");

	return (
		<div className="space-y-6">
			<Tabs defaultValue="todos" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="todos">Todo Management</TabsTrigger>
					<TabsTrigger value="users">User Management</TabsTrigger>
					<TabsTrigger value="posts">Post Management</TabsTrigger>
				</TabsList>

				<TabsContent value="todos" className="space-y-4">
					<TodoSection
						todoText={todoText}
						setTodoText={setTodoText}
					/>
				</TabsContent>

				<TabsContent value="users" className="space-y-4">
					<UserSection
						userName={userName}
						setUserName={setUserName}
						userEmail={userEmail}
						setUserEmail={setUserEmail}
					/>
				</TabsContent>

				<TabsContent value="posts" className="space-y-4">
					<PostSection
						postTitle={postTitle}
						setPostTitle={setPostTitle}
						postContent={postContent}
						setPostContent={setPostContent}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function TodoSection({
	todoText,
	setTodoText,
}: {
	todoText: string;
	setTodoText: (text: string) => void;
}) {
	const utils = trpc.useUtils();

	// GET /api/todos
	const { data: todos, isLoading } = trpc.todo.getTodos.useQuery();

	// POST /api/todo
	const createTodoMutation = trpc.todo.createTodo.useMutation({
		onSuccess: () => {
			utils.todo.getTodos.invalidate();
		},
	});

	// PATCH /api/todo/:id
	const updateTodoMutation = trpc.todo.updateTodo.useMutation({
		onSuccess: () => {
			utils.todo.getTodos.invalidate();
		},
	});

	// DELETE /api/todo/:id
	const deleteTodoMutation = trpc.todo.deleteTodo.useMutation({
		onSuccess: () => {
			utils.todo.getTodos.invalidate();
		},
	});

	const handleCreateTodo = async () => {
		if (todoText.trim()) {
			await createTodoMutation.mutateAsync({ text: todoText });
			setTodoText("");
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Create New Todo</CardTitle>
					<CardDescription>Add a new todo item</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="New todo..."
							value={todoText}
							onChange={(e) => setTodoText(e.target.value)}
							className="flex-1"
						/>
						<Button
							onClick={handleCreateTodo}
							disabled={createTodoMutation.isPending}
						>
							{createTodoMutation.isPending
								? "Creating..."
								: "Add Todo"}
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Todo List</CardTitle>
					<CardDescription>All todos with actions</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<p className="text-muted-foreground">
							Loading todos...
						</p>
					) : (
						<div className="space-y-3">
							{todos?.map((todo) => (
								<div
									key={todo.id}
									className="flex items-center gap-3 p-3 border rounded-lg bg-card"
								>
									<span
										className={
											todo.completed
												? "line-through text-muted-foreground flex-1"
												: "flex-1"
										}
									>
										{todo.text}
									</span>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												updateTodoMutation.mutate({
													id: todo.id,
													completed: !todo.completed,
												})
											}
										>
											{todo.completed
												? "Undo"
												: "Complete"}
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												deleteTodoMutation.mutate({
													id: todo.id,
												})
											}
										>
											Delete
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function UserSection({
	userName,
	setUserName,
	userEmail,
	setUserEmail,
}: {
	userName: string;
	setUserName: (name: string) => void;
	userEmail: string;
	setUserEmail: (email: string) => void;
}) {
	const utils = trpc.useUtils();

	// GET /api/users
	const { data: users, isLoading } = trpc.user.getUsers.useQuery();

	// POST /api/user
	const createUserMutation = trpc.user.createUser.useMutation({
		onSuccess: () => {
			utils.user.getUsers.invalidate();
		},
	});

	// PATCH /api/user/:id
	const updateUserMutation = trpc.user.updateUser.useMutation({
		onSuccess: () => {
			utils.user.getUsers.invalidate();
		},
	});

	// DELETE /api/user/:id
	const deleteUserMutation = trpc.user.deleteUser.useMutation({
		onSuccess: () => {
			utils.user.getUsers.invalidate();
		},
	});

	const handleCreateUser = async () => {
		if (userName.trim() && userEmail.trim()) {
			await createUserMutation.mutateAsync({
				name: userName,
				email: userEmail,
			});
			setUserName("");
			setUserEmail("");
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Create New User</CardTitle>
					<CardDescription>
						Add a new user to the system
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="Name"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							className="flex-1"
						/>
						<Input
							type="email"
							placeholder="Email"
							value={userEmail}
							onChange={(e) => setUserEmail(e.target.value)}
							className="flex-1"
						/>
						<Button
							onClick={handleCreateUser}
							disabled={createUserMutation.isPending}
						>
							{createUserMutation.isPending
								? "Creating..."
								: "Add User"}
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">User List</CardTitle>
					<CardDescription>All users with actions</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<p className="text-muted-foreground">
							Loading users...
						</p>
					) : (
						<div className="space-y-3">
							{users?.map((user) => (
								<div
									key={user.id}
									className="flex items-center gap-3 p-3 border rounded-lg bg-card"
								>
									<div className="flex-1">
										<p className="font-medium">
											{user.name}
										</p>
										<p className="text-sm text-muted-foreground">
											{user.email}
										</p>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												updateUserMutation.mutate({
													id: user.id,
													name:
														user.name +
														" (Updated)",
												})
											}
										>
											Update
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												deleteUserMutation.mutate({
													id: user.id,
												})
											}
										>
											Delete
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function PostSection({
	postTitle,
	setPostTitle,
	postContent,
	setPostContent,
}: {
	postTitle: string;
	setPostTitle: (title: string) => void;
	postContent: string;
	setPostContent: (content: string) => void;
}) {
	const utils = trpc.useUtils();

	// GET /api/posts
	const { data: posts, isLoading } = trpc.post.getPosts.useQuery();

	// POST /api/post
	const createPostMutation = trpc.post.createPost.useMutation({
		onSuccess: () => {
			utils.post.getPosts.invalidate();
		},
	});

	// PATCH /api/post/:id
	const updatePostMutation = trpc.post.updatePost.useMutation({
		onSuccess: () => {
			utils.post.getPosts.invalidate();
		},
	});

	// DELETE /api/post/:id
	const deletePostMutation = trpc.post.deletePost.useMutation({
		onSuccess: () => {
			utils.post.getPosts.invalidate();
		},
	});

	const handleCreatePost = async () => {
		if (postTitle.trim() && postContent.trim()) {
			await createPostMutation.mutateAsync({
				title: postTitle,
				content: postContent,
				authorId: 1, // In real app, get from context
			});
			setPostTitle("");
			setPostContent("");
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Create New Post</CardTitle>
					<CardDescription>Add a new post</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Input
						type="text"
						placeholder="Post title"
						value={postTitle}
						onChange={(e) => setPostTitle(e.target.value)}
					/>
					<Textarea
						placeholder="Post content"
						value={postContent}
						onChange={(e) => setPostContent(e.target.value)}
						rows={3}
					/>
					<Button
						onClick={handleCreatePost}
						disabled={createPostMutation.isPending}
					>
						{createPostMutation.isPending
							? "Creating..."
							: "Add Post"}
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Post List</CardTitle>
					<CardDescription>All posts with actions</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<p className="text-muted-foreground">
							Loading posts...
						</p>
					) : (
						<div className="space-y-4">
							{posts?.map((post) => (
								<div
									key={post.id}
									className="p-4 border rounded-lg bg-card"
								>
									<h3 className="font-semibold mb-2">
										{post.title}
									</h3>
									<p className="text-sm text-muted-foreground mb-3">
										{post.content}
									</p>
									<div className="flex items-center justify-between">
										<Badge variant="secondary">
											Author ID: {post.authorId}
										</Badge>
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													updatePostMutation.mutate({
														id: post.id,
														title:
															post.title +
															" (Updated)",
													})
												}
											>
												Update
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													deletePostMutation.mutate({
														id: post.id,
													})
												}
											>
												Delete
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
