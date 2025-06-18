
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Default to light, will be updated by useEffect

  // Effect for initializing theme based on localStorage or system preference
  useEffect(() => {
    let initialTheme: 'light' | 'dark' = 'light'; // Default
    try {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (storedTheme) {
        initialTheme = storedTheme;
      } else if (prefersDark) {
        initialTheme = 'dark';
      }
    } catch (error) {
      // In case localStorage or matchMedia is not available (e.g., during SSR pre-render for a moment)
      // or if there's an error accessing them.
      console.warn("Could not access theme preference, defaulting to light.", error);
    }
    setTheme(initialTheme);
  }, []); // Runs once on mount client-side

  // Effect for applying theme to DOM and saving to localStorage
  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
        console.warn("Could not apply or save theme preference.", error);
    }
  }, [theme]); // Runs when theme state changes

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Avoid rendering the button until the theme is determined client-side to prevent hydration mismatch for icon
  if (typeof window === 'undefined') {
    return <div className="h-10 w-10 shrink-0" />; // Placeholder for SSR
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 shrink-0"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;
