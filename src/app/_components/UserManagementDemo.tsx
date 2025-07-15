"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";

export default function UserManagementDemo() {
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const utils = trpc.useUtils();

	// Just like REST API calls but with full type safety!

	// GET /api/users
	const { data: users, isLoading } = trpc.user.getUsers.useQuery();

	// GET /api/user/:id
	const { data: specificUser } = trpc.user.getUserById.useQuery({ id: 1 });

	// POST /api/user
	const createUserMutation = trpc.user.createUser.useMutation({
		onSuccess: () => {
			setUserName("");
			setUserEmail("");
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
		if (userName && userEmail) {
			await createUserMutation.mutateAsync({
				name: userName,
				email: userEmail,
			});
		}
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">
				User Management (tRPC Style)
			</h1>

			{/* Show all users - like GET /api/users */}
			<div className="mb-6">
				<h2 className="text-xl font-semibold mb-3">All Users</h2>
				{isLoading ? (
					<p>Loading users...</p>
				) : (
					<div className="space-y-2">
						{users?.map((user) => (
							<div
								key={user.id}
								className="flex items-center gap-4 p-3 border rounded"
							>
								<span>
									{user.name} ({user.email})
								</span>
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
						))}
					</div>
				)}
			</div>

			{/* Show specific user - like GET /api/user/1 */}
			<div className="mb-6">
				<h2 className="text-xl font-semibold mb-3">User ID: 1</h2>
				{specificUser ? (
					<p>
						Name: {specificUser.name}, Email: {specificUser.email}
					</p>
				) : (
					<p>User not found</p>
				)}
			</div>

			{/* Create new user - like POST /api/user */}
			<div>
				<h2 className="text-xl font-semibold mb-3">Create New User</h2>
				<div className="flex gap-2">
					<input
						type="text"
						placeholder="Name"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						className="px-3 py-2 border rounded"
					/>
					<input
						type="email"
						placeholder="Email"
						value={userEmail}
						onChange={(e) => setUserEmail(e.target.value)}
						className="px-3 py-2 border rounded"
					/>
					<button
						onClick={handleCreateUser}
						disabled={createUserMutation.isPending}
						className="px-4 py-2 bg-green-500 text-white rounded"
					>
						{createUserMutation.isPending
							? "Creating..."
							: "Create User"}
					</button>
				</div>
			</div>
		</div>
	);
}
