import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronUp, Home, Plus, Rocket, TrendingUp, Users } from "lucide-react";

export function Sidebar() {
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
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground text-sm">1</div>
            <ChevronUp className="h-4 w-4 text-purple-500" />
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="/placeholder.svg?height=24&width=24"
                alt="r/programming"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <Link to="#" className="text-sm font-medium hover:underline">
              r/programming
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground text-sm">2</div>
            <ChevronUp className="h-4 w-4 text-purple-500" />
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="/placeholder.svg?height=24&width=24"
                alt="r/webdev"
              />
              <AvatarFallback>W</AvatarFallback>
            </Avatar>
            <Link to="#" className="text-sm font-medium hover:underline">
              r/webdev
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground text-sm">3</div>
            <ChevronUp className="h-4 w-4 text-purple-500" />
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="/placeholder.svg?height=24&width=24"
                alt="r/reactjs"
              />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <Link to="#" className="text-sm font-medium hover:underline">
              r/reactjs
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground text-sm">4</div>
            <ChevronUp className="h-4 w-4 text-purple-500" />
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="/placeholder.svg?height=24&width=24"
                alt="r/nextjs"
              />
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
            <Link to="#" className="text-sm font-medium hover:underline">
              r/nextjs
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground text-sm">5</div>
            <ChevronUp className="h-4 w-4 text-purple-500" />
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="/placeholder.svg?height=24&width=24"
                alt="r/tailwindcss"
              />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
            <Link to="#" className="text-sm font-medium hover:underline">
              r/tailwindcss
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">
            View All
          </Button>
        </CardFooter>
      </Card>

      <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
          <CardDescription>
            Share your thoughts with the community
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </CardFooter>
      </Card>

      <Card className="dark:bg-[#1a1a1a] dark:border-[#343536]">
        <CardHeader>
          <CardTitle>Create Community</CardTitle>
          <CardDescription>Start your own subreddit</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Create Community
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
