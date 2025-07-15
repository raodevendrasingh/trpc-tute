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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">All Users</CardTitle>
					<CardDescription>
						Complete user list with management actions
					</CardDescription>
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
									className="flex items-center gap-4 p-3 border rounded-lg bg-card"
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

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Specific User</CardTitle>
					<CardDescription>
						Get user by ID (example: ID 1)
					</CardDescription>
				</CardHeader>
				<CardContent>
					{specificUser ? (
						<div className="p-3 border rounded-lg bg-card">
							<div className="flex items-center gap-2">
								<span className="font-medium">
									{specificUser.name}
								</span>
								<Badge variant="outline">
									{specificUser.email}
								</Badge>
							</div>
						</div>
					) : (
						<p className="text-muted-foreground">User not found</p>
					)}
				</CardContent>
			</Card>

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
						/>
						<Input
							type="email"
							placeholder="Email"
							value={userEmail}
							onChange={(e) => setUserEmail(e.target.value)}
						/>
						<Button
							onClick={handleCreateUser}
							disabled={createUserMutation.isPending}
						>
							{createUserMutation.isPending
								? "Creating..."
								: "Create User"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
