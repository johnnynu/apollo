import { Link, useNavigate } from "react-router-dom";
import type { Id } from "convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import {
  ArrowBigDown,
  ArrowBigUp,
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
    <div className="flex flex-col items-center gap-1 p-2">
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
            <Link to={`/post/${postId}`}>{subject}</Link>
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
    <>
      {signedIn && (
        <Card className="max-w-2xl w-full mx-auto dark:bg-[#1a1a1a] dark:border-[#343536]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              {/*<Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=50&width=50" />
                <AvatarFallback>
                  {user?.username
                    ? user.username.substring(0, 2).toUpperCase()
                    : "ME"}
                </AvatarFallback>
              </Avatar>*/}
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
      <div className="max-w-2xl w-full mx-auto flex items-center gap-2 px-2">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Comments</h3>
      </div>

      <Separator className="max-w-2xl w-full mx-auto dark:bg-[#343536]" />

      {comments.length === 0 ? (
        <Card className="max-w-2xl w-full mx-auto dark:bg-[#1a1a1a] dark:border-[#343536]">
          <CardContent className="p-4 text-center text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </CardContent>
        </Card>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
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
    <div className="space-y-4">
      <Card className="max-w-2xl w-full mx-auto dark:bg-[#1a1a1a] dark:border-[#343536]">
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
          <div className="grid gap-1">
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
              <span className="text-xs">{commentCount ?? 0} comment(s)</span>
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
              className={`h-8 gap-1 ${saved ? "text-purple-500" : "text-muted-foreground"}`}
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
        <CommentSection
          postId={post._id}
          comments={comments ?? []}
          onSubmit={handleSubmitComment}
          signedIn={!!user}
        />
      )}
    </div>
  );
};

export default PostCard;
