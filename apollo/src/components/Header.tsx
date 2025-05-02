import { Link } from "react-router";
import { Bell, Menu, Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { useEffect, useState } from "react";

export function Header() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Apollo Logo */}
        <Link to="/" className="flex items-center gap-2 mr-6">
          <div className="relative w-12 h-12 overflow-hidden">
            <img
              src="/public/apollo-transparent-logo.png"
              alt="Apollo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <span className="hidden md:inline-block font-bold text-xl">
            apollo
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-4 mr-4">
          <Button variant="ghost" size="sm" className="text-sm">
            Home
          </Button>
        </div>

        {/* Search Bar - More balanced spacing */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm md:max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Apollo"
                className="pl-8 bg-muted focus-visible:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons - More evenly spaced */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Plus className="h-5 w-5" />
            <span className="sr-only">Create post</span>
          </Button>

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="@user"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
