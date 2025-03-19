import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";

const PublicHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">FollBoost</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <a
              href="#services"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md hover:bg-gray-100"
            >
              Services
            </a>
            <a
              href="#api"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md hover:bg-gray-100"
            >
              API
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md hover:bg-gray-100"
            >
              About Us
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md hover:bg-gray-100"
            >
              Contact Us
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-primary">
                <span>More</span>
                <ChevronDown className="h-4 w-4 mr-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 text-right">
                <DropdownMenuItem>
                  <Link to="/terms" className="w-full text-right">
                    Terms & Conditions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/privacy" className="w-full text-right">
                    Privacy Policy
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <LanguageSwitcher />
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>Register</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4">
          <nav className="flex flex-col space-y-3">
            <a
              href="#services"
              className="text-gray-700 hover:text-primary py-2 text-right"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#api"
              className="text-gray-700 hover:text-primary py-2 text-right"
              onClick={() => setIsMenuOpen(false)}
            >
              API
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-primary py-2 text-right"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-primary py-2 text-right"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </a>
            <Link
              to="/terms"
              className="text-gray-700 hover:text-primary py-2 text-right"
              onClick={() => setIsMenuOpen(false)}
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacy"
              className="text-gray-700 hover:text-primary py-2 text-right"
              onClick={() => setIsMenuOpen(false)}
            >
              Privacy Policy
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
              <LanguageSwitcher />
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>Register</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
