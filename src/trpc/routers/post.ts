import { createTRPCRouter, baseProcedure } from "../init";
import { z } from "zod";

// This is like your /api/posts/* routes
export const postRouter = createTRPCRouter({
	// GET /api/posts (get all posts)
	getPosts: baseProcedure.query(async () => {
		// In real app, this would query your database
		return [
			{
				id: 1,
				title: "First Post",
				content: "This is my first post",
				authorId: 1,
			},
			{
				id: 2,
				title: "Second Post",
				content: "Another great post",
				authorId: 2,
			},
		];
	}),

	// POST /api/post (create post)
	createPost: baseProcedure
		.input(
			z.object({
				title: z.string().min(1),
				content: z.string().min(1),
				authorId: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			// In real app, save to database
			const newPost = {
				id: Math.floor(Math.random() * 1000),
				title: input.title,
				content: input.content,
				authorId: input.authorId,
			};
			return newPost;
		}),

	// GET /api/post/:id (get post by id)
	getPostById: baseProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input }) => {
			// In real app, query database by ID
			const posts = [
				{
					id: 1,
					title: "First Post",
					content: "This is my first post",
					authorId: 1,
				},
				{
					id: 2,
					title: "Second Post",
					content: "Another great post",
					authorId: 2,
				},
			];
			return posts.find((post) => post.id === input.id);
		}),

	// PATCH /api/post/:id (update post)
	updatePost: baseProcedure
		.input(
			z.object({
				id: z.number(),
				title: z.string().min(1).optional(),
				content: z.string().min(1).optional(),
			})
		)
		.mutation(async ({ input }) => {
			// In real app, update in database
			return {
				id: input.id,
				title: input.title || "Updated Title",
				content: input.content || "Updated content",
				authorId: 1, // In real app, get from context
			};
		}),

	// DELETE /api/post/:id (delete post)
	deletePost: baseProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			// In real app, delete from database
			return { success: true, deletedId: input.id };
		}),
});
