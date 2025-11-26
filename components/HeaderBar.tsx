"use client";
import Link from "next/link";
import ThemeToggler from "@/components/ThemeToggler";

const HeaderBar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Ecom Support Bot
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            
            <ThemeToggler />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;