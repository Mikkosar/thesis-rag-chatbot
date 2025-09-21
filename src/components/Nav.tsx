// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white-900 p-4 mb-6 border-b border-gray-500 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-black font-medium hover:text-gray-300 transition"
          >
            Data
          </Link>
          <Link
            to="/chat"
            className="text-black font-medium hover:text-gray-300 transition"
          >
            Chat
          </Link>
        </div>
      </div>
    </nav>
  );
}
