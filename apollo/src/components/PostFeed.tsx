import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "./PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Flame, ArrowUpDown, Clock } from "lucide-react";

export function PostFeed() {
  const topPosts = useQuery(api.feed.getTopPosts, { limit: 10 });
  console.log(topPosts);

  if (!topPosts) {
    return (
      <div className="w-full p-4">
        <Card className="w-full dark:bg-[#1a1a1a] dark:border-[#343536]">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-muted h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-muted rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-muted rounded col-span-2"></div>
                      <div className="h-2 bg-muted rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <Card className="w-full dark:bg-[#1a1a1a] dark:border-[#343536]">
        <CardContent className="p-3">
          <Tabs defaultValue="hot" className="w-full">
            <TabsList className="w-full bg-background dark:bg-[#272729] justify-start border-b dark:border-[#343536] rounded-none p-0">
              <TabsTrigger
                value="hot"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#7950F2] rounded-none px-4 py-2"
              >
                <Flame className="h-4 w-4 mr-2" />
                Hot
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#7950F2] rounded-none px-4 py-2"
              >
                <Clock className="h-4 w-4 mr-2" />
                New
              </TabsTrigger>
              <TabsTrigger
                value="top"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#7950F2] rounded-none px-4 py-2"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Top
              </TabsTrigger>
              <TabsTrigger
                value="rising"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#7950F2] rounded-none px-4 py-2"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Rising
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="w-full space-y-4">
        {topPosts.map((post) => (
          <PostCard key={post._id} post={post} showSubreddit={true} />
        ))}
      </div>
    </div>
  );
}
