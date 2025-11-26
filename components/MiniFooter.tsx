import React from "react";

const MiniFooter = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Ecom Support Bot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MiniFooter;
