import { createTRPCRouter, baseProcedure } from "../init";
import { z } from "zod";

// In-memory storage (in real app, use a database)
let users = [
	{ id: 1, name: "John Doe", email: "john@example.com" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com" },
];

// This is like your /api/users/* routes
export const userRouter = createTRPCRouter({
	// GET /api/users (get all users)
	getUsers: baseProcedure.query(async () => {
		return users;
	}),

	// POST /api/user (create user)
	createUser: baseProcedure
		.input(
			z.object({
				name: z.string().min(1),
				email: z.string().email(),
			})
		)
		.mutation(async ({ input }) => {
			const newUser = {
				id: Math.floor(Math.random() * 1000),
				name: input.name,
				email: input.email,
			};
			users.push(newUser);
			return newUser;
		}),

	// GET /api/user/:id (get user by id)
	getUserById: baseProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input }) => {
			return users.find((user) => user.id === input.id);
		}),

	// PATCH /api/user/:id (update user)
	updateUser: baseProcedure
		.input(
			z.object({
				id: z.number(),
				name: z.string().min(1).optional(),
				email: z.string().email().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const userIndex = users.findIndex((user) => user.id === input.id);
			if (userIndex === -1) {
				throw new Error("User not found");
			}

			if (input.name !== undefined) {
				users[userIndex].name = input.name;
			}
			if (input.email !== undefined) {
				users[userIndex].email = input.email;
			}

			return users[userIndex];
		}),

	// DELETE /api/user/:id (delete user)
	deleteUser: baseProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const userIndex = users.findIndex((user) => user.id === input.id);
			if (userIndex === -1) {
				throw new Error("User not found");
			}

			const deletedUser = users[userIndex];
			users.splice(userIndex, 1);
			return deletedUser;
		}),
});
