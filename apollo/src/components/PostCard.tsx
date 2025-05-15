"use client";

import { Link, useNavigate } from "react-router-dom";
import type { Id } from "convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import {
  ArrowBigDown,
  ArrowBigUp,
  Bookmark,
  MessageSquare,
  Share2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Post {
  _id: Id<"post">;
  subject: string;
  body: string;
  _creationTime: number;
  authorId: string;
  imageUrl?: string;
  author?: {
    username: string;
  };
  subreddit?: {
    name: string;
  };
}

interface PostCardProps {
  post: Post;
  showSubreddit?: boolean;
  expandedView?: boolean;
}

interface PostHeaderProps {
  author?: { username: string };
  subreddit?: { name: string };
  showSubreddit: boolean;
  creationTime: number;
}

interface PostContentProps {
  subject: string;
  body?: string;
  image?: string;
  expandedView: boolean;
}

const PostHeader = ({
  author,
  subreddit,
  showSubreddit,
  creationTime,
}: PostHeaderProps) => {
  return (
    <div className="flex items-center text-xs text-muted-foreground mb-2">
      {showSubreddit && subreddit && (
        <Link
          to={`/r/${subreddit.name}`}
          className="font-medium hover:underline mr-2"
        >
          r/{subreddit.name}
        </Link>
      )}
      <span className="mr-1">•</span>
      <span>Posted by</span>
      {author ? (
        <Link to={`/u/${author.username}`} className="hover:underline mx-1">
          u/{author.username}
        </Link>
      ) : (
        <span className="mx-1">u/deleted</span>
      )}
      <span className="mr-1">•</span>
      <span>{new Date(creationTime).toLocaleString()}</span>
    </div>
  );
};

const PostContent = ({
  subject,
  body,
  image,
  expandedView,
}: PostContentProps) => {
  return (
    <>
      {expandedView ? (
        <>
          <h2 className="text-lg font-semibold mb-2">{subject}</h2>
          {image && (
            <div className="my-3 rounded-md overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt="Post content"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          {body && <p className="text-sm text-muted-foreground">{body}</p>}
        </>
      ) : (
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2 hover:underline">
            <Link to="#">{subject}</Link>
          </h2>
          {body && (
            <p className="text-sm text-muted-foreground line-clamp-2">{body}</p>
          )}
          {image && (
            <div className="mt-3 rounded-md overflow-hidden max-h-48">
              <img
                src={image || "/placeholder.svg"}
                alt="Post content"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

const PostCard = ({
  post,
  showSubreddit = false,
  expandedView = false,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(expandedView);
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const ownedByCurrentUser = post.author?.username === user?.username;

  const handleVote = (direction: "up" | "down") => {
    if (userVote === direction) {
      // Undo vote
      setVotes(direction === "up" ? votes - 1 : votes + 1);
      setUserVote(null);
    } else {
      // Change vote
      if (userVote === null) {
        // First vote
        setVotes(direction === "up" ? votes + 1 : votes - 1);
      } else {
        // Switching vote (e.g. from down to up)
        setVotes(direction === "up" ? votes + 2 : votes - 2);
      }
      setUserVote(direction);
    }
  };

  const handleComment = () => {};

  const handleDelete = async () => {};

  const handleSubmitComment = (content: string) => {};

  return (
    <Card className="max-w-2xl w-full mx-auto mb-4 dark:bg-[#1a1a1a] dark:border-[#343536]">
      <div className="flex">
        {/* Vote buttons column */}
        <div className="flex flex-col items-center p-2 bg-muted/20 dark:bg-[#1a1a1a]">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${userVote === "up" ? "text-[#7950F2]" : "text-muted-foreground"}`}
            onClick={() => handleVote("up")}
          >
            <ArrowBigUp className="h-5 w-5" />
            <span className="sr-only">Upvote</span>
          </Button>
          <span
            className={`text-sm font-medium my-1 ${
              userVote === "up"
                ? "text-[#7950F2]"
                : userVote === "down"
                  ? "text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            {votes}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${userVote === "down" ? "text-red-500" : "text-muted-foreground"}`}
            onClick={() => handleVote("down")}
          >
            <ArrowBigDown className="h-5 w-5" />
            <span className="sr-only">Downvote</span>
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <CardContent className="p-3">
            <PostHeader
              author={post.author}
              subreddit={post.subreddit ?? { name: "deleted" }}
              showSubreddit={showSubreddit}
              creationTime={post._creationTime}
            />
            <PostContent
              subject={post.subject}
              body={post.body}
              image={post.imageUrl}
              expandedView={expandedView}
            />
          </CardContent>

          <CardFooter className="p-2 border-t dark:border-[#343536] flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5 text-muted-foreground"
              onClick={handleComment}
            >
              <MessageSquare className="h-4 w-4" />
              <span>0 Comments</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5 text-muted-foreground"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 text-xs gap-1.5 ${saved ? "text-[#7950F2]" : "text-muted-foreground"}`}
              onClick={() => setSaved(!saved)}
            >
              <Bookmark className="h-4 w-4" />
              <span>{saved ? "Saved" : "Save"}</span>
            </Button>

            {ownedByCurrentUser && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1.5 text-red-500"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
