import type { Id } from "../../convex/_generated/dataModel";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowBigDown, ArrowBigUp, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CommentProps {
  comment: {
    _id: Id<"comments">;
    content: string;
    author?: {
      username?: string;
    };
    _creationTime: number;
  };
}

const Comment = ({ comment }: CommentProps) => {
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleVote = (direction: "up" | "down") => {
    if (userVote === direction) {
      setVotes(direction === "up" ? votes - 1 : votes + 1);
      setUserVote(null);
    } else {
      if (userVote === null) {
        setVotes(direction === "up" ? votes + 1 : votes - 1);
      } else {
        setVotes(direction === "up" ? votes + 2 : votes - 2);
      }
      setUserVote(direction);
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <div className="flex-shrink-0">
        <Avatar className="h-6 w-6">
          <AvatarImage src="/placeholder.svg?height=50&width=50" />
          <AvatarFallback>
            {comment.author?.username
              ? comment.author.username.substring(0, 1).toUpperCase()
              : "?"}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <div className="flex items-center text-xs gap-1.5 text-muted-foreground">
          {comment.author?.username ? (
            <Link
              to={`u/${comment.author.username}`}
              className="font-medium hover:underline"
            >
              u/{comment.author.username}
            </Link>
          ) : (
            <span className="font-medium">u/deleted</span>
          )}
          <span>•</span>
          <span>{new Date(comment._creationTime).toLocaleString()}</span>
        </div>
        <div className="mt-1 text-sm">{comment.content}</div>
        <div className="flex items-center gap-1 mt-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 rounded-full ${userVote === "up" ? "text-[#7950F2]" : "text-muted-foreground"}`}
            onClick={() => handleVote("up")}
          >
            <ArrowBigUp className="h-3 w-3" />
            <span className="sr-only">Upvote</span>
          </Button>
          <span
            className={`text-xs font-medium ${
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
            className={`h-6 w-6 rounded-full ${userVote === "down" ? "text-red-500" : "text-muted-foreground"}`}
            onClick={() => handleVote("down")}
          >
            <ArrowBigDown className="h-3 w-3" />
            <span className="sr-only">Downvote</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs gap-1 text-muted-foreground"
          >
            <Reply className="h-3 w-3" />
            <span>Reply</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
