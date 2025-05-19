import { mutation, query, QueryCtx } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { v, ConvexError } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { counter, postCountKey } from "./counter";

type EnrichedPost = Omit<Doc<"post">, "subreddit"> & {
  author: { username: string } | undefined;
  subreddit:
    | {
        _id: Id<"subreddit">;
        name: string;
      }
    | undefined;
  imageUrl?: string;
};

const ERROR_MESSAGES = {
  POST_NOT_FOUND: "Post not found",
  SUBREDDIT_NOT_FOUND: "Subreddit not found",
  UNAUTHORIZED_DELETE: "You can't delete this post",
} as const;

// TODO: add validation for subreddit existing
export const create = mutation({
  args: {
    subject: v.string(),
    body: v.string(),
    subreddit: v.id("subreddit"),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const postId = await ctx.db.insert("post", {
      subject: args.subject,
      body: args.body,
      subreddit: args.subreddit,
      authorId: user._id,
      image: args.storageId || undefined,
    });

    await counter.inc(ctx, postCountKey(user._id));

    return postId;
  },
});

async function getEnrichedPost(
  ctx: QueryCtx,
  post: Doc<"post">
): Promise<EnrichedPost> {
  const [author, subreddit] = await Promise.all([
    ctx.db.get(post.authorId),
    ctx.db.get(post.subreddit),
  ]);

  const image = post.image && (await ctx.storage.getUrl(post.image));

  return {
    ...post,
    author: author ? { username: author.username } : undefined,
    subreddit: {
      _id: subreddit!._id,
      name: subreddit!.name,
    },
    imageUrl: image ?? undefined,
  };
}

export async function getEnrichedPosts(
  ctx: QueryCtx,
  posts: Doc<"post">[]
): Promise<EnrichedPost[]> {
  return Promise.all(posts.map((post) => getEnrichedPost(ctx, post)).sort());
}

export const getPost = query({
  args: { id: v.id("post") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) return null;

    return getEnrichedPost(ctx, post);
  },
});

export const getUserPosts = query({
  args: { authorUsername: v.string() },
  handler: async (ctx, args): Promise<EnrichedPost[]> => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.authorUsername))
      .unique();

    if (!user) return [];

    const posts = await ctx.db
      .query("post")
      .withIndex("byAuthor", (q) => q.eq("authorId", user._id))
      .collect();

    return (await getEnrichedPosts(ctx, posts)).sort(
      (a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0)
    );
  },
});

export const deletePost = mutation({
  args: { postId: v.id("post") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post)
      throw new ConvexError({ message: ERROR_MESSAGES.POST_NOT_FOUND });
    const user = await getCurrentUserOrThrow(ctx);

    if (post.authorId !== user._id)
      throw new ConvexError({ message: ERROR_MESSAGES.UNAUTHORIZED_DELETE });

    await ctx.db.delete(args.postId);
    await counter.dec(ctx, postCountKey(user._id));
  },
});

export const search = query({
  args: { queryStr: v.string(), subreddit: v.string() },
  handler: async (ctx, args) => {
    if (!args.queryStr) return [];

    const subredditObject = await ctx.db
      .query("subreddit")
      .filter((q) => q.eq(q.field("name"), args.subreddit))
      .unique();

    if (!subredditObject) return [];

    const posts = await ctx.db
      .query("post")
      .withSearchIndex("search_body", (q) =>
        q.search("subject", args.queryStr).eq("subreddit", subredditObject._id)
      )
      .take(10);

    return posts.map((post) => ({
      _id: post._id,
      title: post.subject,
      type: "post",
      name: subredditObject.name,
    }));
  },
});
