import { createTRPCRouter, baseProcedure } from "../init";
import { z } from "zod";

// This is like your /api/users/* routes
export const userRouter = createTRPCRouter({
	// GET /api/users (get all users)
	getUsers: baseProcedure.query(async () => {
		// In real app, this would query your database
		return [
			{ id: 1, name: "John Doe", email: "john@example.com" },
			{ id: 2, name: "Jane Smith", email: "jane@example.com" },
		];
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
			// In real app, save to database
			const newUser = {
				id: Math.floor(Math.random() * 1000),
				name: input.name,
				email: input.email,
			};
			return newUser;
		}),

	// GET /api/user/:id (get user by id)
	getUserById: baseProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input }) => {
			// In real app, query database by ID
			const users = [
				{ id: 1, name: "John Doe", email: "john@example.com" },
				{ id: 2, name: "Jane Smith", email: "jane@example.com" },
			];
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
			// In real app, update in database
			return {
				id: input.id,
				name: input.name || "Updated Name",
				email: input.email || "updated@example.com",
			};
		}),

	// DELETE /api/user/:id (delete user)
	deleteUser: baseProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			// In real app, delete from database
			return { success: true, deletedId: input.id };
		}),
});
