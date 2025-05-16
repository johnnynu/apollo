import { useParams } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Share2 } from "lucide-react";

const ProfilePage = () => {
  const { username } = useParams();
  const posts = useQuery(api.post.getUserPosts, {
    authorUsername: username || "",
  });
  const postCount = useQuery(api.users.getPublicUser, {
    username: username || "",
  });

  // Format date for display - using a placeholder date since we don't have actual user data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Placeholder join date - in a real app this would come from user data
  const joinDate = formatDate("2021-06-15T00:00:00.000Z");

  if (posts === undefined)
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Card className="overflow-hidden dark:bg-[#1a1a1a] dark:border-[#343536]">
          <div className="h-32 bg-gradient-to-r from-purple-600 to-purple-400"></div>
          <CardHeader className="pb-2 relative">
            <div className="absolute -top-16 left-6 border-4 border-background dark:border-[#1a1a1a] rounded-full">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-24 pt-2">
              <h1 className="text-2xl font-bold">u/{username}</h1>
            </div>
          </CardHeader>
        </Card>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="md:col-span-2 space-y-6">
          {/* User banner and info */}
          <Card className="overflow-hidden dark:bg-[#1a1a1a] dark:border-[#343536]">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-purple-600 to-purple-400 relative"></div>

            {/* User info */}
            <CardHeader className="pb-2 relative">
              <div className="absolute -top-16 left-6 border-4 border-background dark:border-[#1a1a1a] rounded-full">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src="/placeholder.svg?height=96&width=96"
                    alt={username}
                  />
                  <AvatarFallback className="text-2xl">
                    {username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="mt-24 pt-2 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">u/{username}</h1>
                  <p className="text-muted-foreground">Posts: {posts.length}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Posts/Comments tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full bg-muted dark:bg-[#272729]">
              <TabsTrigger value="posts" className="flex-1">
                Posts
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex-1">
                Comments
              </TabsTrigger>
              <TabsTrigger value="upvoted" className="flex-1">
                Upvoted
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex-1">
                Saved
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-4 space-y-4">
              {posts.length === 0 ? (
                <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No posts yet</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="mb-4">
                    <PostCard post={post} showSubreddit={true} />
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="comments" className="mt-4">
              <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No comments yet</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upvoted" className="mt-4">
              <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No upvoted posts</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="mt-4">
              <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No saved posts</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User stats card */}
          <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
            <CardHeader>
              <h2 className="text-lg font-semibold">About u/{username}</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Apollo member since {joinDate}</span>
              </div>

              <div className="pt-2 border-t dark:border-[#343536]">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Posts</span>
                  <span className="text-sm font-medium">
                    {postCount?.posts ?? 0}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">
                    Cake Day
                  </span>
                  <span className="text-sm font-medium">{joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trophies card */}
          <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
            <CardHeader>
              <h2 className="text-lg font-semibold">Trophies</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 py-2">
                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-yellow-500 text-lg">🏆</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Verified Email</p>
                  <p className="text-xs text-muted-foreground">
                    Has a verified email address
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-500 text-lg">⭐</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Apollo Member</p>
                  <p className="text-xs text-muted-foreground">
                    Active community member
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
