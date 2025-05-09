import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useLocation, useNavigate, useParams } from "react-router";

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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    community: "",
    title: "",
    content: "", // text posts
    imageFile: null as File | null, // for image posts
    imagePreview: null as string | null,
    communityName: "", // for com creation
    communityDescription: "", // for com creation
  });

  const createSubreddit = useMutation(api.subreddit.create);
  const createPost = useMutation(api.post.create);
  const generateUploadUrl = useMutation(api.image.generateUploadUrl);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("imageFile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData("imagePreview", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    updateFormData("imageFile", null);
    updateFormData("imagePreview", null);
  };

  const { subredditName } = useParams();
  const subreddit = useQuery(api.subreddit.get, { name: subredditName || "" });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, content, imageFile, imagePreview } = formData;

    if (!title.trim() || !subreddit) {
      alert("Please enter a title and select a subreddit.");
      return;
    }

    try {
      if (subreddit) {
        setIsLoading(true);

        await createPost({
          subject: title.trim(),
          body: content.trim(),
          subreddit: subreddit._id,
        });

        setOpen(false);
        navigate(`/r/${subredditName}`);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { communityName, communityDescription } = formData;

    if (!communityName) {
      setError("Name is required");
    }

    if (!/^[a-zA-Z0-9_]+$/.test(communityName)) {
      setError(
        "Community name can only contain letters, numbers, and underscores."
      );
    }

    if (communityName.length < 3 || communityName.length > 21) {
      setError("Community name must be between 3 and 21 characters.");
    }

    try {
      setIsLoading(true);

      await createSubreddit({
        name: communityName,
        description: communityDescription,
      });

      setOpen(false);
      onOpenChange?.(false);
      navigate(`r/${communityName}`);
    } catch (err: any) {
      setError(`Failed to create community. ${err.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setFormData({
        community: "",
        title: "",
        content: "",
        imageFile: null as File | null,
        imagePreview: null as string | null,
        communityName: "",
        communityDescription: "",
      });
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const path = location.pathname;

      const subredditMatch = path.match(/\/r\/([^\/]+)/);

      if (subredditMatch && subredditMatch[1]) {
        updateFormData("community", subredditMatch[1]);
      }
    }
  }, [open, location.pathname]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] dark:bg-[#1a1a1a] dark:border-[#343536]">
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-[#272729]">
            <TabsTrigger
              value="post"
              className="dark:data-[state=active]:bg-[#343536]"
              disabled={isLoading}
            >
              Create Post
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="dark:data-[state=active]:bg-[#343536]"
              disabled={isLoading}
            >
              Create Community
            </TabsTrigger>
          </TabsList>

          {/* Create Post Tab */}
          <TabsContent value="post" className="space-y-4 mt-4">
            <DialogHeader>
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500 text-red-500">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
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
                disabled={isLoading}
              >
                <FileText className="h-4 w-4" />
                Text
              </Button>
              <Button
                variant={postType === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => setPostType("image")}
                className="flex gap-2"
                disabled={isLoading}
              >
                <Image className="h-4 w-4" />
                Image
              </Button>
              <Button
                variant={postType === "link" ? "default" : "outline"}
                size="sm"
                onClick={() => setPostType("link")}
                className="flex gap-2"
                disabled={true}
              >
                <Link className="h-4 w-4" />
                Link
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="community">Community</Label>
                <Select
                  disabled={isLoading}
                  onValueChange={(value) => updateFormData("community", value)}
                >
                  <SelectTrigger
                    id="community"
                    className="dark:bg-[#272729] dark:border-[#343536]"
                  >
                    <SelectValue
                      placeholder={
                        formData.community
                          ? `r/${formData.community}`
                          : "Choose a community"
                      }
                    />
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
              {/* Create Post Tab Inputs */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Title"
                  className="dark:bg-[#272729] dark:border-[#343536]"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  disabled={isLoading}
                  maxLength={100}
                />
              </div>

              {postType === "text" && (
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Text (optional)"
                    className="min-h-[150px] dark:bg-[#272729] dark:border-[#343536]"
                    value={formData.content}
                    onChange={(e) => updateFormData("content", e.target.value)}
                    disabled={isLoading}
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
                disabled={isLoading}
                variant="outline"
                onClick={() => setOpen(false)}
                className="dark:bg-[#272729] dark:border-[#343536]"
              >
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handlePostSubmit}
                disabled={isLoading || !formData.title.trim()}
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Create Community Tab */}
          <TabsContent value="community" className="space-y-4 mt-4">
            <DialogHeader>
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500 text-red-500">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
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
                    value={formData.communityName}
                    maxLength={21}
                    onChange={(e) =>
                      updateFormData("communityName", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Community names including capitalization cannot be changed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="community-type">Community Type</Label>
                <Select disabled={true}>
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
                  disabled={isLoading}
                  value={formData.communityDescription}
                  onChange={(e) =>
                    updateFormData("communityDescription", e.target.value)
                  }
                  maxLength={100}
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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
                onClick={handleCommunitySubmit}
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
