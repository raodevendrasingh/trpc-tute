import { baseProcedure, createTRPCRouter } from "../init";
import { userRouter } from "./user";
import { postRouter } from "./post";
import { todoRouter } from "./todo";

export const appRouter = createTRPCRouter({
	hello: baseProcedure.query(async ({ ctx }) => {
		return { userId: ctx.userId, message: "Hello from tRPC!" };
	}),

	user: userRouter,
	post: postRouter,
	todo: todoRouter,
});

export type AppRouter = typeof appRouter;
