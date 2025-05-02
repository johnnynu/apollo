import { Header } from "@/components/Header";
import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1">{/* Banner and PostFeed here */}</div>
        <div className="hidden lg:block w-80">{/* Sidebar here */}</div>
      </main>
    </div>
  );
};

export default HomePage;
