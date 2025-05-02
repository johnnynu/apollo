"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDown,
  ArrowUp,
  BookmarkIcon,
  MessageSquare,
  Share2,
} from "lucide-react";

export function PostFeed() {
  const [votes, setVotes] = useState<Record<string, number>>({
    post1: 254,
    post2: 95,
    post3: 1432,
  });

  const handleVote = (postId: string, direction: "up" | "down") => {
    setVotes((prev) => ({
      ...prev,
      [postId]: prev[postId] + (direction === "up" ? 1 : -1),
    }));
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="hot" className="w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Popular Posts</h1>
          <TabsList className="dark:bg-[#1a1a1a]">
            <TabsTrigger
              value="hot"
              className="dark:data-[state=active]:bg-[#272729] dark:text-gray-300"
            >
              Hot
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="dark:data-[state=active]:bg-[#272729] dark:text-gray-300"
            >
              New
            </TabsTrigger>
            <TabsTrigger
              value="top"
              className="dark:data-[state=active]:bg-[#272729] dark:text-gray-300"
            >
              Top
            </TabsTrigger>
            <TabsTrigger
              value="rising"
              className="dark:data-[state=active]:bg-[#272729] dark:text-gray-300"
            >
              Rising
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="hot" className="space-y-4 mt-4">
          <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
            <CardHeader className="flex flex-row items-start gap-4 p-4">
              <div className="flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-purple-500"
                  onClick={() => handleVote("post1", "up")}
                >
                  <ArrowUp className="h-5 w-5" />
                  <span className="sr-only">Upvote</span>
                </Button>
                <span className="text-sm font-medium">{votes.post1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleVote("post1", "down")}
                >
                  <ArrowDown className="h-5 w-5" />
                  <span className="sr-only">Downvote</span>
                </Button>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src="/placeholder.svg?height=20&width=20"
                      alt="r/programming"
                    />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <Link to="/" className="text-xs font-medium hover:underline">
                    r/programming
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    Posted by u/devguru 5 hours ago
                  </span>
                </div>
                <Link to="/" className="font-semibold hover:underline">
                  Introducing our new open-source framework for building modern
                  web applications
                </Link>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    After two years of development, we're excited to announce
                    the release of our new framework that combines the best of
                    React, Vue, and Svelte. It's designed to be lightweight,
                    performant, and developer-friendly.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardFooter className="border-t p-2 dark:border-[#343536]">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-muted-foreground"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">128 comments</span>
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
                  className="h-8 gap-1 text-muted-foreground"
                >
                  <BookmarkIcon className="h-4 w-4" />
                  <span className="text-xs">Save</span>
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
            <CardHeader className="flex flex-row items-start gap-4 p-4">
              <div className="flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-purple-500"
                  onClick={() => handleVote("post2", "up")}
                >
                  <ArrowUp className="h-5 w-5" />
                  <span className="sr-only">Upvote</span>
                </Button>
                <span className="text-sm font-medium">{votes.post2}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleVote("post2", "down")}
                >
                  <ArrowDown className="h-5 w-5" />
                  <span className="sr-only">Downvote</span>
                </Button>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src="/placeholder.svg?height=20&width=20"
                      alt="r/askreddit"
                    />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <Link to="/" className="text-xs font-medium hover:underline">
                    r/askreddit
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    Posted by u/curious_mind 8 hours ago
                  </span>
                </div>
                <Link to="/" className="font-semibold hover:underline">
                  What's a skill that took you less than a month to learn but
                  has been useful your entire life?
                </Link>
              </div>
            </CardHeader>
            <CardFooter className="border-t p-2 dark:border-[#343536]">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-muted-foreground"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">432 comments</span>
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
                  className="h-8 gap-1 text-muted-foreground"
                >
                  <BookmarkIcon className="h-4 w-4" />
                  <span className="text-xs">Save</span>
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
            <CardHeader className="flex flex-row items-start gap-4 p-4">
              <div className="flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-purple-500"
                  onClick={() => handleVote("post3", "up")}
                >
                  <ArrowUp className="h-5 w-5" />
                  <span className="sr-only">Upvote</span>
                </Button>
                <span className="text-sm font-medium">{votes.post3}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleVote("post3", "down")}
                >
                  <ArrowDown className="h-5 w-5" />
                  <span className="sr-only">Downvote</span>
                </Button>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src="/placeholder.svg?height=20&width=20"
                      alt="r/webdev"
                    />
                    <AvatarFallback>W</AvatarFallback>
                  </Avatar>
                  <Link to="/" className="text-xs font-medium hover:underline">
                    r/webdev
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    Posted by u/frontend_wizard 3 hours ago
                  </span>
                </div>
                <Link to="/" className="font-semibold hover:underline">
                  I built an Apollo clone using Next.js and Tailwind - Here's
                  what I learned
                </Link>
                <div className="mt-2 relative pb-[56.25%] rounded-md overflow-hidden">
                  <img
                    src="/placeholder.svg?height=400&width=800"
                    alt="Project screenshot"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="border-t p-2 dark:border-[#343536]">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-muted-foreground"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">76 comments</span>
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
                  className="h-8 gap-1 text-muted-foreground"
                >
                  <BookmarkIcon className="h-4 w-4" />
                  <span className="text-xs">Save</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="new" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-[#1a1a1a] dark:border-[#343536]">
            <p className="text-center text-muted-foreground">
              Loading new posts...
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="top" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-[#1a1a1a] dark:border-[#343536]">
            <p className="text-center text-muted-foreground">
              Loading top posts...
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="rising" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-[#1a1a1a] dark:border-[#343536]">
            <p className="text-center text-muted-foreground">
              Loading rising posts...
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
