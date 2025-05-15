"use client";

import { useParams, useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "@/components/PostCard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useQuery(api.post.getPost, { id: postId });

  if (!post) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#121212] py-6">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="dark:bg-[#1a1a1a] dark:border-[#343536] p-8">
            <div className="flex flex-col items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-t-[#7950F2] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading post...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#121212] py-6">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back</span>
          </Button>
        </div>

        <PostCard post={post} showSubreddit={true} expandedView={true} />

        {/* Comment input section */}
        <Card className="mt-4 dark:bg-[#1a1a1a] dark:border-[#343536]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=50&width=50" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="What are your thoughts?"
                className="flex-1 dark:bg-[#272729] dark:border-[#343536]"
              />
            </div>
            <div className="flex justify-end">
              <Button className="bg-[#7950F2] hover:bg-[#6c45d9]">
                Comment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments section placeholder */}
        <div className="mt-4 flex items-center gap-2 px-2">
          <h3 className="font-medium">Comments</h3>
        </div>

        <Separator className="mt-2 dark:bg-[#343536]" />

        <Card className="mt-4 dark:bg-[#1a1a1a] dark:border-[#343536]">
          <CardContent className="p-4 text-center text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostPage;
