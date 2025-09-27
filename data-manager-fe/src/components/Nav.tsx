// src/components/Nav.tsx
// Navigaatiopalkki, joka näkyy kaikilla sivuilla ja sisältää päävalikon

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white-900 px-4 sm:px-6 lg:px-8 py-4 mb-6 border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex max-w-screen-xl w-full items-center justify-between">
        {/* Navigaatiovalikko */}
        <div className="flex space-x-4 sm:space-x-6">
          {/* Linkki pääsivulle (chunk-lista) */}
          <Link
            to="/"
            className="text-black font-medium hover:text-gray-600 transition"
          >
            Data
          </Link>
          {/* Linkki chat-sivulle */}
          <Link
            to="/chat"
            className="text-black font-medium hover:text-gray-600 transition"
          >
            Chat
          </Link>
        </div>
      </div>
    </nav>
  );
}
