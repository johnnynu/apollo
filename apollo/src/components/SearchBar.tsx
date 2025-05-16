import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchResult {
  _id: string;
  type: string;
  title: string;
  name: string;
}

const SearchBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const subredditMatch = location.pathname.match(/\/r\/([^\/]+)/);
  const currentSubreddit = subredditMatch ? subredditMatch[1] : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const results: SearchResult[] = [];

  // perform search query

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
        return "icon here";
      case "post":
        return "icon here";
      default:
        return "icon here";
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={
              currentSubreddit
                ? `Search r/${currentSubreddit}`
                : "Search for a community"
            }
            value={searchQuery}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="pl-8 bg-muted focus-visible:ring-purple-500"
          />
          {currentSubreddit && (
            <div className="search-scope">
              <span>in r/{currentSubreddit}</span>
            </div>
          )}
        </div>
        {isActive && (
          <div className="search-results">
            {searchQuery === "" ? (
              <div className="empty-state">
                <p>Try searching for posts or communities.</p>
              </div>
            ) : results && results.length > 0 ? (
              <ul className="results-list">
                {results.map((result) => (
                  <li
                    key={result._id}
                    className="result-item"
                    onClick={() => handleResult(result)}
                  >
                    <span className="result-icon">
                      {getIconForType(result.type)}
                    </span>
                    <div className="result-container">
                      <span className="result-title">{result.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <p>No results found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
