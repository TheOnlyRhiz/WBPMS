import { useEffect } from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/admin/sidebar";
import StatsCard from "@/components/admin/stats-card";
import ActivityItem from "@/components/admin/activity-item";
import {
  Car,
  Users,
  MessageSquare,
  AlertTriangle,
  Menu,
  Bell,
  PlusCircle,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !!user,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities"],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: feedbacks, isLoading: feedbacksLoading } = useQuery({
    queryKey: ["/api/feedbacks"],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Redirect to="/login" />;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "driver_created":
        return <PlusCircle className="h-6 w-6 text-green-500" />;
      case "vehicle_created":
        return <Car className="h-6 w-6 text-blue-500" />;
      case "feedback_created":
        return <MessageSquare className="h-6 w-6 text-orange-500" />;
      case "feedback_resolved":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "driver_updated":
        return <RefreshCw className="h-6 w-6 text-purple-500" />;
      case "vehicle_updated":
        return <RefreshCw className="h-6 w-6 text-purple-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case "driver_created":
        return "green-500";
      case "vehicle_created":
        return "blue-500";
      case "feedback_created":
        return "orange-500";
      case "feedback_resolved":
        return "green-500";
      case "driver_updated":
      case "vehicle_updated":
        return "purple-500";
      default:
        return "gray-500";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMs = now.getTime() - activityTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    } else {
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Park Management System</title>
        <meta
          name="description"
          content="Admin dashboard for Park Management System. Manage drivers, vehicles, and feedback."
        />
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
                  <SheetContent
                    side="left"
                    className="w-[240px] bg-primary text-white p-0"
                  >
                    <div className="h-16 flex items-center px-4 bg-primary-dark">
                      <Car className="h-6 w-6 mr-2" />
                      <h1 className="text-xl font-heading font-bold">
                        Admin Portal
                      </h1>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                      <Sidebar
                        isMobile
                        onLinkClick={() => document.body.click()}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex-1 md:flex md:items-center md:justify-between">
                <div>
                  <h1 className="text-lg font-medium text-gray-700 md:hidden">
                    Admin Portal
                  </h1>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-auto">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">
                  Dashboard Overview
                </h2>

                {statsLoading ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardContent className="p-5">
                          <div className="h-20 animate-pulse bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                      title="Total Vehicles"
                      value={stats?.vehiclesCount || 0}
                      icon={<Car className="h-5 w-5 text-white" />}
                      iconBgColor="bg-amber-300"
                      linkHref="/admin/vehicles"
                    />
                    <StatsCard
                      title="Registered Drivers"
                      value={stats?.driversCount || 0}
                      icon={<Users className="h-5 w-5 text-white" />}
                      iconBgColor="bg-green-600"
                      linkHref="/admin/drivers"
                    />
                    <StatsCard
                      title="Feedback Received"
                      value={stats?.feedbacksCount || 0}
                      icon={<MessageSquare className="h-5 w-5 text-white" />}
                      iconBgColor="bg-amber-500"
                      linkHref="/admin/feedback"
                    />
                    <StatsCard
                      title="Open Issues"
                      value={stats?.issuesCount || 0}
                      icon={<AlertTriangle className="h-5 w-5 text-white" />}
                      iconBgColor="bg-red-500"
                      linkHref="/admin/feedback"
                    />
                  </div>
                )}

                {/* Recent Feedback */}
                <div className="mt-8">
                  <h3 className="text-lg font-heading font-semibold text-gray-800 mb-4">Recent Feedback</h3>
                  <Card>
                    <CardContent className="p-6">
                      {feedbacksLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
                              <div className="flex items-center justify-between mb-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                              </div>
                              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                          ))}
                        </div>
                      ) : Array.isArray(feedbacks) && feedbacks.length > 0 ? (
                        <div className="space-y-4">
                          {feedbacks.slice(0, 4).map((feedback: any) => (
                            <div key={feedback.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">{feedback.passengerName}</span>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-lg ${
                                          i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  feedback.resolved 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {feedback.resolved ? 'Resolved' : 'Pending'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {feedback.message}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Vehicle: {feedback.plateNumber}</span>
                                <span>{formatTimeAgo(feedback.createdAt)}</span>
                              </div>
                            </div>
                          ))}
                          
                          <div className="pt-4 border-t border-gray-200">
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => window.location.href = '/admin/feedback'}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              See All Feedback
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No feedback received yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
