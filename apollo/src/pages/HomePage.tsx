import { Header } from "@/components/Header";
import { Banner } from "@/components/Banner";
import { PostFeed } from "@/components/PostFeed";
import { Sidebar } from "@/components/Sidebar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1">
          <Banner />
          <PostFeed />
        </div>
        <div className="hidden lg:block w-80">
          <Sidebar />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
