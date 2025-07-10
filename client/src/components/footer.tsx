import { Car, Facebook, Twitter, Instagram } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

const Footer = () => {
  const [location] = useLocation();
  
  // Don't show footer on admin pages
  if (location.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Car className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-heading font-bold">Park Management System</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="#">
              <span className="text-gray-300 hover:text-white">Terms of Service</span>
            </Link>
            <Link href="#">
              <span className="text-gray-300 hover:text-white">Privacy Policy</span>
            </Link>
            <Link href="#">
              <span className="text-gray-300 hover:text-white">Contact Us</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col-reverse md:flex-row md:justify-between md:items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Park Management System. All rights reserved.</p>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
