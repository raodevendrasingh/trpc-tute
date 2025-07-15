"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";

export default function TrpcApiDemo() {
	const [todoText, setTodoText] = useState("");
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [postTitle, setPostTitle] = useState("");
	const [postContent, setPostContent] = useState("");

	return (
		<div className="p-6 max-w-6xl mx-auto space-y-8">
			<h1 className="text-3xl font-bold text-center mb-8">
				Complete tRPC API Example
			</h1>

			{/* Todo Section */}
			<div className="bg-blue-50 p-6 rounded-lg">
				<h2 className="text-2xl font-semibold mb-4">
					📝 Todo Management
				</h2>
				<TodoSection todoText={todoText} setTodoText={setTodoText} />
			</div>

			{/* User Section */}
			<div className="bg-green-50 p-6 rounded-lg">
				<h2 className="text-2xl font-semibold mb-4">
					👤 User Management
				</h2>
				<UserSection
					userName={userName}
					setUserName={setUserName}
					userEmail={userEmail}
					setUserEmail={setUserEmail}
				/>
			</div>

			{/* Post Section */}
			<div className="bg-purple-50 p-6 rounded-lg">
				<h2 className="text-2xl font-semibold mb-4">
					📄 Post Management
				</h2>
				<PostSection
					postTitle={postTitle}
					setPostTitle={setPostTitle}
					postContent={postContent}
					setPostContent={setPostContent}
				/>
			</div>
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
		<div className="space-y-4">
			{/* Create Todo */}
			<div className="flex gap-2">
				<input
					type="text"
					placeholder="New todo..."
					value={todoText}
					onChange={(e) => setTodoText(e.target.value)}
					className="flex-1 px-3 py-2 border rounded"
				/>
				<button
					onClick={handleCreateTodo}
					disabled={createTodoMutation.isPending}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					{createTodoMutation.isPending ? "Creating..." : "Add Todo"}
				</button>
			</div>

			{/* List Todos */}
			{isLoading ? (
				<p>Loading todos...</p>
			) : (
				<div className="space-y-2">
					{todos?.map((todo) => (
						<div
							key={todo.id}
							className="flex items-center gap-3 p-3 bg-white rounded border"
						>
							<span
								className={
									todo.completed
										? "line-through text-gray-500"
										: ""
								}
							>
								{todo.text}
							</span>
							<div className="ml-auto flex gap-2">
								<button
									onClick={() =>
										updateTodoMutation.mutate({
											id: todo.id,
											completed: !todo.completed,
										})
									}
									className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
								>
									Toggle
								</button>
								<button
									onClick={() =>
										deleteTodoMutation.mutate({
											id: todo.id,
										})
									}
									className="px-3 py-1 bg-red-500 text-white rounded text-sm"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}
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
		<div className="space-y-4">
			{/* Create User */}
			<div className="flex gap-2">
				<input
					type="text"
					placeholder="Name"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					className="flex-1 px-3 py-2 border rounded"
				/>
				<input
					type="email"
					placeholder="Email"
					value={userEmail}
					onChange={(e) => setUserEmail(e.target.value)}
					className="flex-1 px-3 py-2 border rounded"
				/>
				<button
					onClick={handleCreateUser}
					disabled={createUserMutation.isPending}
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
				>
					{createUserMutation.isPending ? "Creating..." : "Add User"}
				</button>
			</div>

			{/* List Users */}
			{isLoading ? (
				<p>Loading users...</p>
			) : (
				<div className="space-y-2">
					{users?.map((user) => (
						<div
							key={user.id}
							className="flex items-center gap-3 p-3 bg-white rounded border"
						>
							<div className="flex-1">
								<p className="font-medium">{user.name}</p>
								<p className="text-gray-600 text-sm">
									{user.email}
								</p>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() =>
										updateUserMutation.mutate({
											id: user.id,
											name: user.name + " (Updated)",
										})
									}
									className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
								>
									Update
								</button>
								<button
									onClick={() =>
										deleteUserMutation.mutate({
											id: user.id,
										})
									}
									className="px-3 py-1 bg-red-500 text-white rounded text-sm"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}
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
		<div className="space-y-4">
			{/* Create Post */}
			<div className="space-y-2">
				<input
					type="text"
					placeholder="Post title"
					value={postTitle}
					onChange={(e) => setPostTitle(e.target.value)}
					className="w-full px-3 py-2 border rounded"
				/>
				<textarea
					placeholder="Post content"
					value={postContent}
					onChange={(e) => setPostContent(e.target.value)}
					rows={3}
					className="w-full px-3 py-2 border rounded"
				/>
				<button
					onClick={handleCreatePost}
					disabled={createPostMutation.isPending}
					className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
				>
					{createPostMutation.isPending ? "Creating..." : "Add Post"}
				</button>
			</div>

			{/* List Posts */}
			{isLoading ? (
				<p>Loading posts...</p>
			) : (
				<div className="space-y-3">
					{posts?.map((post) => (
						<div
							key={post.id}
							className="p-4 bg-white rounded border"
						>
							<h3 className="font-bold mb-2">{post.title}</h3>
							<p className="text-gray-700 mb-3">{post.content}</p>
							<div className="flex gap-2">
								<button
									onClick={() =>
										updatePostMutation.mutate({
											id: post.id,
											title: post.title + " (Updated)",
										})
									}
									className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
								>
									Update
								</button>
								<button
									onClick={() =>
										deletePostMutation.mutate({
											id: post.id,
										})
									}
									className="px-3 py-1 bg-red-500 text-white rounded text-sm"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
