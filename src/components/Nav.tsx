// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-white font-medium hover:text-gray-300 transition"
          >
            Data
          </Link>
          <Link
            to="/chat"
            className="text-white font-medium hover:text-gray-300 transition"
          >
            Chat
          </Link>
          <Link
            to="/stream"
            className="text-white font-medium hover:text-gray-300 transition"
          >
            Stream
          </Link>
        </div>
      </div>
    </nav>
  );
}
