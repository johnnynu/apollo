import { useParams } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell } from "lucide-react";
import PostCard from "@/components/PostCard";
import { CreateContentModal } from "@/components/CreateContentModal";

// subreddit variable should contain:
// name
// description

const SubredditPage = () => {
  const { subredditName } = useParams();

  const subreddit = useQuery(api.subreddit.get, { name: subredditName || "" });

  if (subreddit === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!subreddit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-2">Subreddit Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The subreddit you're looking for doesn't exist.
        </p>
        <Button>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subreddit Banner */}
      <div className="h-32 bg-primary/20 relative">
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-16"></div>
      </div>

      {/* Subreddit Info */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 -mt-6 relative">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-card rounded-t-lg shadow-sm p-4 mb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
                  {subreddit.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">r/{subreddit.name}</h1>
                  <p className="text-muted-foreground text-sm">
                    r/{subreddit.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Bell className="h-4 w-4" />
                    Join
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-sm">{subreddit.description}</p>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {subreddit.posts?.length === 0 ? (
                <div>
                  <p>No posts yet. Be the first to post!</p>
                </div>
              ) : (
                subreddit.posts?.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:w-80 space-y-4">
            <Card>
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle>About Community</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm mb-4">{subreddit.description}</p>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <div>
                    <div className="font-bold">1.2k</div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div className="h-8 w-px bg-border"></div>
                  <div>
                    <div className="font-bold">42</div>
                    <div className="text-xs text-muted-foreground">Online</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Created Jan 1, 2023
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">Create Post</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Rules</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Be respectful to others</li>
                  <li>No spam or self-promotion</li>
                  <li>Use appropriate post flairs</li>
                  <li>Follow Apollo's content policy</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubredditPage;
