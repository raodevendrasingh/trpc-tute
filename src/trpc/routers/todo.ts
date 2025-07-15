import { createTRPCRouter, baseProcedure } from "../init";
import { z } from "zod";

// This is like your /api/todos/* routes
export const todoRouter = createTRPCRouter({
	// GET /api/todos (get all todos)
	getTodos: baseProcedure.query(async () => {
		// In real app, this would query your database
		return [
			{ id: 1, text: "Learn tRPC", completed: false },
			{ id: 2, text: "Build awesome apps", completed: true },
			{ id: 3, text: "Deploy to production", completed: false },
		];
	}),

	// POST /api/todo (create todo)
	createTodo: baseProcedure
		.input(z.object({ text: z.string().min(1) }))
		.mutation(async ({ input }) => {
			// In real app, save to database
			const newTodo = {
				id: Math.floor(Math.random() * 1000),
				text: input.text,
				completed: false,
			};
			return newTodo;
		}),

	// GET /api/todo/:id (get todo by id)
	getTodoById: baseProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input }) => {
			// In real app, query database by ID
			const todos = [
				{ id: 1, text: "Learn tRPC", completed: false },
				{ id: 2, text: "Build awesome apps", completed: true },
				{ id: 3, text: "Deploy to production", completed: false },
			];
			return todos.find((todo) => todo.id === input.id);
		}),

	// PATCH /api/todo/:id (update todo)
	updateTodo: baseProcedure
		.input(
			z.object({
				id: z.number(),
				text: z.string().min(1).optional(),
				completed: z.boolean().optional(),
			})
		)
		.mutation(async ({ input }) => {
			// In real app, update in database
			return {
				id: input.id,
				text: input.text || "Updated todo",
				completed: input.completed ?? false,
			};
		}),

	// DELETE /api/todo/:id (delete todo)
	deleteTodo: baseProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			// In real app, delete from database
			return { success: true, deletedId: input.id };
		}),

	// PATCH /api/todo/:id/toggle (toggle todo completion)
	toggleTodo: baseProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			// In real app, toggle in database
			return {
				id: input.id,
				text: "Sample todo",
				completed: true, // toggled
			};
		}),
});
