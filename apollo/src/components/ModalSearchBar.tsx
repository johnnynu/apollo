import { useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Search, Users } from "lucide-react";
import { Input } from "./ui/input";

interface ModalSearchBarProps {
  onSelectCommunity: (communityName: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

const ModalSearchBar = ({
  onSelectCommunity,
  defaultValue = "",
  disabled = false,
}: ModalSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // initiate search
  const results = useQuery(api.subreddit.search, { queryStr: debouncedQuery });

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCommunity = (name: string) => {
    onSelectCommunity(name);
    setIsActive(false);
    setSearchQuery(name);
  };

  return (
    <div className="w-full relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for a community"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsActive(true)}
          disabled={disabled}
          className="pl-9 py-2 h-9 dark:bg-[#272729] dark:border-[#343536] rounded-md text-sm focus-visible:ring-purple-500"
        />
      </div>

      {isActive && (
        <div className="absolute z-50 top-full left-0 mt-1 w-full bg-background border border-input rounded-md shadow-lg overflow-hidden dark:bg-[#1a1a1a] dark:border-[#343536]">
          {!searchQuery.trim() ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <p>Search for communities</p>
            </div>
          ) : results && results.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {results.map((result) => (
                <li
                  key={result._id}
                  className="px-4 py-2 hover:bg-accent cursor-pointer flex items-center gap-3 dark:hover:bg-[#272729]"
                  onClick={() => handleSelectCommunity(result.name)}
                >
                  <span className="flex-shrink-0">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      r/{result.name}
                    </span>
                    {result.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-[280px]">
                        {result.description}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <p>No communities found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModalSearchBar;
