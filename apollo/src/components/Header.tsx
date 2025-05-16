import { Link, useNavigate } from "react-router";
import { Menu, Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./mode-toggle";
import { useEffect, useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { CreateContentModal } from "./CreateContentModal";
import SearchBar from "./SearchBar";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [createModal, setCreateModal] = useState(false);

  // provides info about the user
  const { user } = useUser();

  const navigate = useNavigate();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const openModal = () => {
    setCreateModal(true);
  };

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

        {/* Search Bar */}
        <SearchBar />

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          <Unauthenticated>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => openModal()}
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Create</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => user?.username && navigate(`/u/${user.username}`)}
            >
              <User className="h-5 w-5" />
              <span className="sr-only">My Account</span>
            </Button>
            <UserButton />

            {/* Create content modal */}
            {createModal && (
              <CreateContentModal
                defaultOpen={createModal}
                onOpenChange={setCreateModal}
              />
            )}
          </Authenticated>
        </div>
      </div>
    </header>
  );
}
