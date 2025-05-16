import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { useState } from "react";

export function Banner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="relative overflow-hidden mb-4 dark:bg-[#1a1a1a] dark:border-[#343536]">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-10"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="relative w-full h-[120px] sm:h-[150px] md:h-[180px]">
        <img
          src="/public/redditbanner2.jpg"
          alt="Apollo space theme banner"
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="relative w-12 h-12">
            <img
              src="/public/apollo-transparent-logo.png"
              alt="Apollo mascot"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="text-white text-shadow">
            <h2 className="text-xl font-bold">Welcome to Apollo</h2>
            <p className="text-sm">Your space-themed community</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
