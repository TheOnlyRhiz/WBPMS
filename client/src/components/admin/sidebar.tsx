import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Users, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  LogOut, 
  User 
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface SidebarProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const Sidebar = ({ isMobile = false, onLinkClick }: SidebarProps) => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
    { name: "Drivers", path: "/admin/drivers", icon: <Users className="h-5 w-5 mr-3" /> },
    { name: "Vehicles", path: "/admin/vehicles", icon: <Car className="h-5 w-5 mr-3" /> },
    { name: "Feedback", path: "/admin/feedback", icon: <MessageSquare className="h-5 w-5 mr-3" /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings className="h-5 w-5 mr-3" /> },
  ];

  const renderNavLinks = () => (
    <div className="space-y-1">
      {navItems.map((item) => (
        <Link key={item.name} href={item.path}>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-primary-dark ${
              location === item.path ? "bg-primary-dark" : ""
            }`}
            onClick={onLinkClick}
          >
            {item.icon}
            {item.name}
          </Button>
        </Link>
      ))}
    </div>
  );

  if (isMobile) {
    return renderNavLinks();
  }

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:bg-primary md:text-white">
      <div className="h-16 flex items-center px-4 bg-primary-dark">
        <Car className="h-6 w-6 mr-2" />
        <h1 className="text-xl font-heading font-bold">Admin Portal</h1>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4">
          {renderNavLinks()}
        </nav>
        <div className="px-4 py-6 border-t border-primary-dark">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.username || "Admin User"}</p>
              <p className="text-xs text-gray-300">{user?.email || "admin@example.com"}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="mt-4 flex items-center text-sm text-gray-300 hover:text-white"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
