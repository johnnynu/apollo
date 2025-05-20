import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronUp, Home, Rocket, TrendingUp } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

export function Sidebar() {
  const topSubreddits = useQuery(api.feed.topSubreddits, { limit: 5 });

  return (
    <div className="space-y-4">
      <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6"></div>
            <CardTitle>Home</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-1">
          <Button variant="ghost" className="justify-start" asChild>
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link to="/" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Popular
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link to="/" className="flex items-center">
              <Rocket className="mr-2 h-4 w-4" />
              All
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Small banner */}
      <Card className="overflow-hidden dark:bg-[#1a1a1a] dark:border-[#343536]">
        <div className="relative h-16 w-full">
          <img
            src="/public/reddithomebanner.png"
            alt="Space theme"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent flex items-center p-3">
            <span className="text-white text-sm font-medium drop-shadow-md">
              Explore the Universe
            </span>
          </div>
        </div>
      </Card>

      <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
        <CardHeader className="pb-2">
          <CardTitle>Top Communities</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {topSubreddits?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No communities yet</p>
          ) : (
            topSubreddits?.map((subreddit, index) => (
              <div className="flex items-center gap-2" key={subreddit._id}>
                <div className="text-muted-foreground text-sm">{index + 1}</div>
                <ChevronUp className="h-4 w-4 text-purple-500" />
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg?height=24&width=24" />
                  <AvatarFallback>
                    {subreddit.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Link
                  to={`r/${subreddit.name}`}
                  className="text-sm font-medium hover:underline"
                >
                  r/{subreddit.name}
                </Link>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">
            View All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
