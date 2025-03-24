"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, SearchIcon, FilmIcon, User2Icon, LogOutIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const isActiveLink = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  const [mounted, setMounted] = useState(false);

  // Only show icons after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-neutral-200/20 dark:border-neutral-800/20">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            {mounted && <FilmIcon className="w-6 h-6 text-primary" />}
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 to-neutral-600 dark:from-white dark:to-neutral-400">
              Movie Explorer
            </span>
          </Link>
          <nav className="hidden md:flex gap-8">
            {[
              { name: "Home", path: "/" },
              { name: "Movies", path: "/movies" },
              { name: "Genres", path: "/genres" },
              { name: "Favorites", path: "/favorites" }
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors relative ${
                  isActiveLink(link.path) 
                    ? "text-foreground after:absolute after:left-0 after:bottom-[-18px] after:h-[3px] after:w-full after:bg-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/search">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
              {mounted && <SearchIcon className="h-5 w-5" />}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && (theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            ))}
          </Button>
          
          {mounted && user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="rounded-full font-medium">
                  <User2Icon className="h-4 w-4 mr-2" />
                  {user.name}
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-muted-foreground hover:text-foreground"
                onClick={logout}
              >
                <LogOutIcon className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="rounded-full font-medium">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}