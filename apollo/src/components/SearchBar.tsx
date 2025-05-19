import type React from "react";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Search, Users, FileText } from "lucide-react";
import { Input } from "./ui/input";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface SearchResult {
  _id: string;
  type: string;
  title: string;
  name: string;
}

const SearchBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const subredditMatch = location.pathname.match(/\/r\/([^/]+)/);
  const currentSubreddit = subredditMatch ? subredditMatch[1] : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  let results: SearchResult[] = [];

  // perform search query
  if (!currentSubreddit) {
    results = useQuery(api.subreddit.search, {
      queryStr: searchQuery,
    }) as SearchResult[];
  } else {
    results = useQuery(api.post.search, {
      queryStr: searchQuery,
      subreddit: currentSubreddit,
    }) as SearchResult[];
  }

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsActive(false), 200);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResult = (result: SearchResult) => {
    if (result.type === "post") {
      navigate(`/post/${result._id}`);
    } else {
      navigate(`/r/${result.name}`);
    }
    setIsActive(false);
    setSearchQuery("");
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "community":
        return <Users className="h-4 w-4 text-muted-foreground" />;
      case "post":
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm md:max-w-md relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={
              currentSubreddit
                ? `Search r/${currentSubreddit}`
                : "Search Apollo"
            }
            value={searchQuery}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="pl-9 py-2 h-9 bg-[#272729] dark:bg-[#272729] border-[#343536] rounded-full text-sm focus-visible:ring-purple-500 focus-visible:ring-offset-0 focus-visible:border-transparent"
          />
          {currentSubreddit && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#7950F2] text-white text-xs px-2 py-0.5 rounded-full">
              <span>r/{currentSubreddit}</span>
            </div>
          )}
        </div>
        {isActive && (
          <div className="absolute z-50 top-full left-0 mt-1 w-full bg-[#1a1a1a] border border-[#343536] rounded-md shadow-lg overflow-hidden">
            {searchQuery === "" ? (
              currentSubreddit ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <p>Search for posts in r/{currentSubreddit}</p>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <p>Try searching for posts or communities</p>
                </div>
              )
            ) : results && results.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto">
                {results.map((result) => (
                  <li
                    key={result._id}
                    className="px-4 py-2 hover:bg-[#272729] cursor-pointer flex items-center gap-3"
                    onClick={() => handleResult(result)}
                  >
                    <span className="flex-shrink-0">
                      {getIconForType(result.type)}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {result.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {result.type === "community" ? "Community" : "Post"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <p>No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
