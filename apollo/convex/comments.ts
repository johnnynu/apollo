import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { counter, commentCountKey } from "./counter";

export const create = mutation({
  args: {
    content: v.string(),
    postId: v.id("post"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const commentId = await ctx.db.insert("comments", {
      authorId: user._id,
      content: args.content,
      postId: args.postId,
    });

    await counter.inc(ctx, commentCountKey(args.postId));

    return commentId;
  },
});

export const get = query({
  args: { postId: v.id("post") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("byPost", (q) => q.eq("postId", args.postId))
      .collect();

    const authorIds = [...new Set(comments.map((comment) => comment.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = new Map(
      authors.map((author) => [author!._id, author!.username])
    );

    return comments.map((comment) => ({
      ...comment,
      author: {
        username: authorMap.get(comment.authorId),
      },
    }));
  },
});

export const getCommentCount = query({
  args: { postId: v.id("post") },
  handler: async (ctx, args) => {
    return await counter.count(ctx, commentCountKey(args.postId));
  },
});
