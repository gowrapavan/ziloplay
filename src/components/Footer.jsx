import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/50 border-t border-gray-800 mt-12 py-8 px-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <img src={logo} alt="CineFlix Logo" className="h-8" />
          </Link>
        </div>
        <p className="text-gray-400 text-sm">
          &copy; {currentYear} Ziloplay. All rights reserved.
        </p>
        <div className="text-gray-400 text-sm">
          <p>This site does not store any files on our server, we only link to the media which is hosted on 3rd party services.</p>
        </div>
      </div>
    </footer>
  );
}