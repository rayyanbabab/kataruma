import { useState, createContext, useContext, useEffect } from "react";
import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";
import { SearchOverlay } from "./SearchOverlay";

const SearchCtx = createContext<() => void>(() => {});
export const useSearch = () => useContext(SearchCtx);

export function PublicLayout() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SearchCtx.Provider value={() => setSearchOpen(true)}>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#0E335C] selection:text-white">
        <Navbar onSearch={() => setSearchOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <BackToTop />
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </SearchCtx.Provider>
  );
}
