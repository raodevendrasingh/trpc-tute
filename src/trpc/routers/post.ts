import { createTRPCRouter, baseProcedure } from "../init";
import { z } from "zod";

// In-memory storage (in real app, use a database)
let posts = [
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

// This is like your /api/posts/* routes
export const postRouter = createTRPCRouter({
	// GET /api/posts (get all posts)
	getPosts: baseProcedure.query(async () => {
		return posts;
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
			const newPost = {
				id: Math.floor(Math.random() * 1000),
				title: input.title,
				content: input.content,
				authorId: input.authorId,
			};
			posts.push(newPost);
			return newPost;
		}),

	// GET /api/post/:id (get post by id)
	getPostById: baseProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input }) => {
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
			const postIndex = posts.findIndex((post) => post.id === input.id);
			if (postIndex === -1) {
				throw new Error("Post not found");
			}

			if (input.title !== undefined) {
				posts[postIndex].title = input.title;
			}
			if (input.content !== undefined) {
				posts[postIndex].content = input.content;
			}

			return posts[postIndex];
		}),

	// DELETE /api/post/:id (delete post)
	deletePost: baseProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const postIndex = posts.findIndex((post) => post.id === input.id);
			if (postIndex === -1) {
				throw new Error("Post not found");
			}

			const deletedPost = posts[postIndex];
			posts.splice(postIndex, 1);
			return deletedPost;
		}),
});
