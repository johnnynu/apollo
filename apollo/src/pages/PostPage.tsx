import { useParams, useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "@/components/PostCard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useQuery(api.post.getPost, { id: postId });

  if (!post) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#121212] py-6">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-t-[#7950F2] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading post...</p>
          </div>
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
      </div>
    </div>
  );
};

export default PostPage;
