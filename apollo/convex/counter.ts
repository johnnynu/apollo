import { components } from "./_generated/api";
import { ShardedCounter } from "@convex-dev/sharded-counter";
import { Id } from "./_generated/dataModel";

export const counter = new ShardedCounter(components.shardedCounter, {
  defaultShards: 1,
});

export function commentCountKey(postId: Id<"post">) {
  return `comments:${postId}`;
}

export function postCountKey(userId: Id<"users">) {
  return `post:${userId}`;
}

export function subredditPostCountKey(subredditId: Id<"subreddit">) {
  return `subreddit:${subredditId}`;
}
