import { createTRPCRouter, baseProcedure } from "../init";
import { z } from "zod";

// In-memory storage (in real app, use a database)
let todos = [
	{ id: 1, text: "Learn tRPC", completed: false },
	{ id: 2, text: "Build awesome apps", completed: true },
	{ id: 3, text: "Deploy to production", completed: false },
];

// This is like your /api/todos/* routes
export const todoRouter = createTRPCRouter({
	// GET /api/todos (get all todos)
	getTodos: baseProcedure.query(async () => {
		return todos;
	}),

	// POST /api/todo (create todo)
	createTodo: baseProcedure
		.input(z.object({ text: z.string().min(1) }))
		.mutation(async ({ input }) => {
			const newTodo = {
				id: Math.floor(Math.random() * 1000),
				text: input.text,
				completed: false,
			};
			todos.push(newTodo);
			return newTodo;
		}),

	// GET /api/todo/:id (get todo by id)
	getTodoById: baseProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input }) => {
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
			const todoIndex = todos.findIndex((todo) => todo.id === input.id);
			if (todoIndex === -1) {
				throw new Error("Todo not found");
			}

			if (input.text !== undefined) {
				todos[todoIndex].text = input.text;
			}
			if (input.completed !== undefined) {
				todos[todoIndex].completed = input.completed;
			}

			return todos[todoIndex];
		}),

	// DELETE /api/todo/:id (delete todo)
	deleteTodo: baseProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const todoIndex = todos.findIndex((todo) => todo.id === input.id);
			if (todoIndex === -1) {
				throw new Error("Todo not found");
			}

			const deletedTodo = todos[todoIndex];
			todos.splice(todoIndex, 1);
			return deletedTodo;
		}),

	// PATCH /api/todo/:id/toggle (toggle todo completion)
	toggleTodo: baseProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const todoIndex = todos.findIndex((todo) => todo.id === input.id);
			if (todoIndex === -1) {
				throw new Error("Todo not found");
			}

			todos[todoIndex].completed = !todos[todoIndex].completed;
			return todos[todoIndex];
		}),
});
