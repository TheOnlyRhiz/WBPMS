import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Don't show the navbar on admin pages
  if (location.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Verify Vehicle", path: "/verify" },
    { name: "Submit Feedback", path: "/feedback" },
  ];

  return (
    <nav className="bg-primary text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Car className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-heading font-bold">Park Management System</h1>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.name} href={item.path}>
                <Button 
                  variant="ghost" 
                  className={`text-white hover:bg-primary-dark ${
                    location === item.path ? "bg-primary-dark" : ""
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            
            {user ? (
              <Link href="/admin/dashboard">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-primary text-white w-[250px] pt-12">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link key={item.name} href={item.path}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-white hover:bg-primary-dark ${
                          location === item.path ? "bg-primary-dark" : ""
                        }`}
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                  
                  {user ? (
                    <Link href="/admin/dashboard">
                      <Button
                        className="w-full bg-white text-primary hover:bg-gray-100"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        Admin Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button
                        className="w-full bg-white text-primary hover:bg-gray-100"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        Admin Login
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
