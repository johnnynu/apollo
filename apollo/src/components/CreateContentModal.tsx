"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image,
  Link,
  FileText,
  MessageSquare,
  Plus,
  ImageIcon,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type CreateContentModalProps = {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CreateContentModal({
  defaultOpen = false,
  onOpenChange,
}: CreateContentModalProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [postType, setPostType] = useState<"text" | "image" | "link">("text");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Create content</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] dark:bg-[#1a1a1a] dark:border-[#343536]">
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-[#272729]">
            <TabsTrigger
              value="post"
              className="dark:data-[state=active]:bg-[#343536]"
            >
              Create Post
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="dark:data-[state=active]:bg-[#343536]"
            >
              Create Community
            </TabsTrigger>
          </TabsList>

          {/* Create Post Tab */}
          <TabsContent value="post" className="space-y-4 mt-4">
            <DialogHeader>
              <DialogTitle>Create a Post</DialogTitle>
              <DialogDescription>
                Share your thoughts, images, or links with the community.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2 mb-4">
              <Button
                variant={postType === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setPostType("text")}
                className="flex gap-2"
              >
                <FileText className="h-4 w-4" />
                Text
              </Button>
              <Button
                variant={postType === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => setPostType("image")}
                className="flex gap-2"
              >
                <Image className="h-4 w-4" />
                Image
              </Button>
              <Button
                variant={postType === "link" ? "default" : "outline"}
                size="sm"
                onClick={() => setPostType("link")}
                className="flex gap-2"
              >
                <Link className="h-4 w-4" />
                Link
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="community">Community</Label>
                <Select>
                  <SelectTrigger
                    id="community"
                    className="dark:bg-[#272729] dark:border-[#343536]"
                  >
                    <SelectValue placeholder="Choose a community" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1a1a1a] dark:border-[#343536]">
                    <SelectItem value="programming">r/programming</SelectItem>
                    <SelectItem value="webdev">r/webdev</SelectItem>
                    <SelectItem value="reactjs">r/reactjs</SelectItem>
                    <SelectItem value="nextjs">r/nextjs</SelectItem>
                    <SelectItem value="tailwindcss">r/tailwindcss</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Title"
                  className="dark:bg-[#272729] dark:border-[#343536]"
                />
              </div>

              {postType === "text" && (
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Text (optional)"
                    className="min-h-[150px] dark:bg-[#272729] dark:border-[#343536]"
                  />
                </div>
              )}

              {postType === "image" && (
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center dark:border-[#343536]">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop an image, or click to select
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="dark:bg-[#272729] dark:border-[#343536]"
                    >
                      Upload Image
                    </Button>
                  </div>
                </div>
              )}

              {postType === "link" && (
                <div className="space-y-2">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    placeholder="URL"
                    type="url"
                    className="dark:bg-[#272729] dark:border-[#343536]"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="dark:bg-[#272729] dark:border-[#343536]"
              >
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Post
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Create Community Tab */}
          <TabsContent value="community" className="space-y-4 mt-4">
            <DialogHeader>
              <DialogTitle>Create a Community</DialogTitle>
              <DialogDescription>
                Start your own community on Apollo.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="community-name">Community Name</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground dark:bg-[#272729] dark:border-[#343536]">
                    r/
                  </span>
                  <Input
                    id="community-name"
                    placeholder="community_name"
                    className="rounded-l-none dark:bg-[#272729] dark:border-[#343536]"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Community names including capitalization cannot be changed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="community-type">Community Type</Label>
                <Select>
                  <SelectTrigger
                    id="community-type"
                    className="dark:bg-[#272729] dark:border-[#343536]"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1a1a1a] dark:border-[#343536]">
                    <SelectItem value="public">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Public - Anyone can view, post, and comment
                      </div>
                    </SelectItem>
                    <SelectItem value="restricted">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Restricted - Anyone can view, but only approved users
                        can post
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Private - Only approved users can view and post
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="community-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="community-description"
                  placeholder="Description"
                  className="dark:bg-[#272729] dark:border-[#343536]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This is how new members come to understand your community.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="dark:bg-[#272729] dark:border-[#343536]"
              >
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Create Community
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
