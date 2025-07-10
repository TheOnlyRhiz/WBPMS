import { useState } from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/admin/sidebar";
import {
  Car,
  Menu,
  User,
  Lock,
  Info,
  Shield,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Helmet } from 'react-helmet';

const Settings = () => {
  const { user, loading, logout } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Redirect if not authenticated
  if (!loading && !user) {
    return <Redirect to="/login" />;
  }
  
  const [activeTab, setActiveTab] = useState("account");
  
  const [formState, setFormState] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAccountUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Not Implemented",
      description: "This feature has not been implemented yet.",
      variant: "default",
    });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState.newPassword !== formState.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Not Implemented",
      description: "This feature has not been implemented yet.",
      variant: "default",
    });
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Helmet>
        <title>Settings - Park Management System</title>
        <meta name="description" content="Manage your account settings and preferences in the Park Management System." />
      </Helmet>
      
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Navbar */}
          <div className="bg-white shadow z-10">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 h-16">
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6 text-gray-600" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[240px] bg-primary text-white p-0">
                    <div className="h-16 flex items-center px-4 bg-primary-dark">
                      <Car className="h-6 w-6 mr-2" />
                      <h1 className="text-xl font-heading font-bold">Admin Portal</h1>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                      <Sidebar isMobile onLinkClick={() => document.body.click()} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="md:hidden">
                <h1 className="text-lg font-medium text-gray-700">Settings</h1>
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <div className="py-6">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">System Settings</h2>
                
                <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="account">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                          Update your account details and preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAccountUpdate}>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                name="username"
                                value={formState.username}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formState.email}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="pt-4">
                              <Button type="submit">Save Changes</Button>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Password & Security</CardTitle>
                        <CardDescription>
                          Update your password and security settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handlePasswordChange}>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                value={formState.currentPassword}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={formState.newPassword}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formState.confirmPassword}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="pt-4">
                              <Button type="submit">Change Password</Button>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="border-t pt-6 flex-col items-start">
                        <h3 className="text-lg font-semibold mb-2">Sessions</h3>
                        <Alert variant="destructive" className="mb-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Security Notice</AlertTitle>
                          <AlertDescription>
                            For security reasons, ensure you log out from all devices when using shared computers.
                          </AlertDescription>
                        </Alert>
                        <Button variant="outline" onClick={handleLogout}>
                          <Lock className="h-4 w-4 mr-2" />
                          Log out of all sessions
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="about">
                    <Card>
                      <CardHeader>
                        <CardTitle>About Park Management System</CardTitle>
                        <CardDescription>
                          System information and software details
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">System Information</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm font-medium text-gray-500">Version</div>
                              <div className="text-sm">1.0.0</div>
                              
                              <div className="text-sm font-medium text-gray-500">Last Updated</div>
                              <div className="text-sm">{new Date().toLocaleDateString()}</div>
                              
                              <div className="text-sm font-medium text-gray-500">License</div>
                              <div className="text-sm">Proprietary</div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Support</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              For technical support or inquiries, please contact our support team:
                            </p>
                            <div className="text-sm">
                              <strong>Email:</strong> support@parkmanagementsystem.com
                            </div>
                            <div className="text-sm">
                              <strong>Phone:</strong> +234 800 123 4567
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-6">
                        <div className="w-full flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">
                              &copy; {new Date().getFullYear()} Park Management System
                            </p>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">
                              <Info className="h-4 w-4 mr-2" />
                              View Documentation
                            </Button>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
