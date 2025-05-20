import { query } from "./_generated/server";
import { v } from "convex/values";
import { counter, subredditPostCountKey } from "./counter";
import { voteKey } from "./vote";

export const getTopPosts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24);
    const posts = await ctx.db
      .query("post")
      .withIndex("by_creation_time")
      .filter((q) => q.gt(q.field("_creationTime"), oneDayAgo.getTime()))
      .collect();

    const postWithScores = await Promise.all(
      posts.map(async (post) => {
        const upvotes = await counter.count(ctx, voteKey(post._id, "upvote"));
        const downvotes = await counter.count(
          ctx,
          voteKey(post._id, "downvote")
        );

        const author = await ctx.db.get(post.authorId);
        const subreddit = await ctx.db.get(post.subreddit);
        const image = post.image && (await ctx.storage.getUrl(post.image));

        return {
          ...post,
          score: upvotes - downvotes,
          upvotes,
          imageUrl: image ?? undefined,
          downvotes,
          author: { username: author?.username ?? "[deleted]" },
          subreddit: { name: subreddit?.name ?? "[deleted]" },
        };
      })
    );

    return postWithScores.sort((a, b) => b.score - a.score).slice(0, limit);
  },
});

export const topSubreddits = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const subreddits = ctx.db.query("subreddit").collect();

    const topSubredditsByPosts = await Promise.all(
      (await subreddits).map(async (subreddit) => {
        const postCount = await counter.count(
          ctx,
          subredditPostCountKey(subreddit._id)
        );
        return {
          ...subreddit,
          postCount,
        };
      })
    );

    const sorted = topSubredditsByPosts.sort(
      (a, b) => (b.postCount ?? 0) - (a.postCount ?? 0)
    );

    return sorted.slice(0, args.limit ?? 5);
  },
});
