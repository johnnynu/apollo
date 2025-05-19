import { Link, useNavigate } from "react-router-dom";
import type { Id } from "convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  MessageSquare,
  Share2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Comment from "./Comment";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

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
  postId: Id<"post">;
}

interface CommentSectionProps {
  postId: Id<"post">;
  comments: any[];
  onSubmit: (content: string) => void;
  signedIn: boolean;
}

interface VoteButtonProps {
  voteCount: { total: number; upvotes: number; downvotes: number } | undefined;
  hasUpvoted: boolean | undefined;
  hasDownvoted: boolean | undefined;
  onUpvote: () => void;
  onDownvote: () => void;
}

const VoteButtons = ({
  voteCount,
  hasUpvoted,
  hasDownvoted,
  onUpvote,
  onDownvote,
}: VoteButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 ${hasUpvoted ? "text-purple-500" : "text-muted-foreground"}`}
        onClick={onUpvote}
      >
        <ArrowUp className="h-5 w-5" />
        <span className="sr-only">Upvote</span>
      </Button>
      <span className="text-sm font-medium">{voteCount?.total ?? 0}</span>
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 ${hasDownvoted ? "text-red-500" : "text-muted-foreground"}`}
        onClick={onDownvote}
      >
        <ArrowDown className="h-5 w-5" />
        <span className="sr-only">Downvote</span>
      </Button>
    </div>
  );
};

const PostHeader = ({
  author,
  subreddit,
  showSubreddit,
  creationTime,
}: PostHeaderProps) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      {showSubreddit && subreddit && (
        <>
          <Avatar className="h-5 w-5">
            <AvatarImage
              src="/placeholder.svg?height=20&width=20"
              alt={`r/${subreddit.name}`}
            />
            <AvatarFallback>
              {subreddit.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            to={`/r/${subreddit.name}`}
            className="text-xs font-medium hover:underline"
          >
            r/{subreddit.name}
          </Link>
        </>
      )}
      <span className="text-xs text-muted-foreground">
        Posted by{" "}
        {author ? (
          <Link to={`/u/${author.username}`} className="hover:underline">
            u/{author.username}
          </Link>
        ) : (
          <span>u/deleted</span>
        )}{" "}
        {new Date(creationTime).toLocaleString()}
      </span>
    </div>
  );
};

const PostContent = ({
  subject,
  body,
  image,
  expandedView,
  postId,
}: PostContentProps) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  return (
    <>
      {expandedView ? (
        <>
          <h2 className="text-lg font-semibold mb-2">{subject}</h2>
          {body && <p className="text-sm text-muted-foreground">{body}</p>}
          {image && (
            <div className="mt-2 rounded-md overflow-hidden bg-[#272729] border border-[#343536] relative">
              <img
                src={image || "/placeholder.svg"}
                alt="Post content"
                className="w-full h-auto object-contain max-h-[512px] cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col">
          <Link to={`/post/${postId}`}>
            <h2 className="text-lg font-semibold mb-2 hover:underline">
              {subject}
            </h2>
          </Link>
          {body && (
            <p className="text-sm text-muted-foreground line-clamp-2">{body}</p>
          )}
          {image && (
            <div className="mt-2 rounded-md overflow-hidden bg-[#272729] border border-[#343536] relative">
              <div className="relative pt-[56.25%]">
                {" "}
                {/* 16:9 aspect ratio container */}
                <img
                  src={image || "/placeholder.svg"}
                  alt="Post content"
                  className="absolute inset-0 w-full h-full object-contain cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsImageModalOpen(true);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Modal - shared between both views */}
      {isImageModalOpen && image && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="max-w-[90vw] max-h-[90vh] relative">
            <img
              src={image || "/placeholder.svg"}
              alt="Enlarged post content"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <Button
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
            >
              <span className="sr-only">Close</span>✕
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const CommentSection = ({
  comments,
  onSubmit,
  signedIn,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onSubmit(newComment.trim());
    setNewComment("");
  };

  return (
    <div className="w-full space-y-4">
      {signedIn && (
        <Card className="w-full dark:bg-[#1a1a1a] dark:border-[#343536]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Textarea
                placeholder="What are your thoughts?"
                className="flex-1 dark:bg-[#272729] dark:border-[#343536]"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-[#7950F2] hover:bg-[#6c45d9]"
                onClick={handleSubmit}
                disabled={!newComment.trim()}
              >
                Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments section */}
      <div className="w-full flex items-center gap-2 px-2">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Comments</h3>
      </div>

      <Separator className="w-full dark:bg-[#343536]" />

      {comments.length === 0 ? (
        <Card className="w-full dark:bg-[#1a1a1a] dark:border-[#343536]">
          <CardContent className="p-4 text-center text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </CardContent>
        </Card>
      ) : (
        <div className="comments-list w-full">
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

const PostCard = ({
  post,
  showSubreddit = false,
  expandedView = false,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(expandedView);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const ownedByCurrentUser = post.author?.username === user?.username;
  const createComment = useMutation(api.comments.create);
  const toggleUpvote = useMutation(api.vote.toggleUpvote);
  const toggleDownvote = useMutation(api.vote.toggleDownvote);

  const voteCount = useQuery(api.vote.getVoteCounts, { postId: post._id });
  const hasUpvoted = useQuery(api.vote.hasUpvoted, { postId: post._id });
  const hasDownvoted = useQuery(api.vote.hasDownvoted, { postId: post._id });

  const comments = useQuery(api.comments.get, { postId: post._id });
  const commentCount = useQuery(api.comments.getCommentCount, {
    postId: post._id,
  });

  const onUpvote = () => {
    toggleUpvote({ postId: post._id });
  };

  const onDownvote = () => {
    toggleDownvote({ postId: post._id });
  };

  const deletePost = useMutation(api.post.deletePost);

  const handleComment = () => {
    if (expandedView) {
      setShowComments(!showComments);
    } else {
      // Navigate to post page if not in expanded view
      navigate(`/post/${post._id}`);
    }
  };

  const handleDelete = async () => {
    deletePost({
      postId: post._id,
    });
  };

  const handleSubmitComment = (content: string) => {
    createComment({
      content,
      postId: post._id,
    });
  };

  return (
    <div className="space y-4 w-full">
      <Card className="w-full dark:bg-[#1a1a1a] dark:border-[#343536]">
        <CardHeader className="flex flex-row items-start gap-4 p-4">
          {/* Vote buttons column */}
          <VoteButtons
            voteCount={voteCount}
            hasUpvoted={hasUpvoted}
            hasDownvoted={hasDownvoted}
            onUpvote={user ? onUpvote : () => {}}
            onDownvote={user ? onDownvote : () => {}}
          />

          {/* Main content */}
          <div className="grid gap-1 w-full">
            <PostHeader
              author={post.author}
              subreddit={post.subreddit}
              showSubreddit={showSubreddit}
              creationTime={post._creationTime}
            />
            <PostContent
              subject={post.subject}
              body={post.body}
              image={post.imageUrl}
              expandedView={expandedView}
              postId={post._id}
            />
          </div>
        </CardHeader>

        <CardFooter className="border-t p-2 dark:border-[#343536]">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-muted-foreground"
              onClick={handleComment}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{commentCount ?? 0} comments</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-muted-foreground"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Share</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 gap-1 ${
                saved ? "text-purple-500" : "text-muted-foreground"
              }`}
              onClick={() => setSaved(!saved)}
            >
              <Bookmark className="h-4 w-4" />
              <span className="text-xs">{saved ? "Saved" : "Save"}</span>
            </Button>

            {ownedByCurrentUser && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-red-500"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-xs">Delete</span>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Comment sections - only show when in expanded view */}
      {(showComments || expandedView) && (
        <div className="mt-4 space-y-4">
          <CommentSection
            postId={post._id}
            comments={comments ?? []}
            onSubmit={handleSubmitComment}
            signedIn={!!user}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
