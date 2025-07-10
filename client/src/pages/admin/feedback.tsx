import { useState, useEffect } from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/admin/sidebar";
import { 
  Car,
  Menu,
  Search,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Helmet } from 'react-helmet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import StarRating from "@/components/ui/star-rating";

const FeedbackManagement = () => {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const itemsPerPage = 8;
  
  // Redirect if not authenticated
  if (!loading && !user) {
    return <Redirect to="/login" />;
  }
  
  const { data: feedbacksData, isLoading: feedbacksLoading } = useQuery({
    queryKey: ["/api/feedbacks"],
    enabled: !!user,
  });
  
  const resolveMutation = useMutation({
    mutationFn: async ({ id, resolved }: { id: number; resolved: boolean }) => {
      await apiRequest("PUT", `/api/feedbacks/${id}/resolve`, { resolved });
    },
    onSuccess: () => {
      toast({
        title: "Feedback Updated",
        description: "Feedback status has been updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/feedbacks"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update feedback status",
        variant: "destructive",
      });
      console.error("Update feedback error:", error);
    },
  });
  
  const handleResolveToggle = (id: number, currentStatus: boolean) => {
    resolveMutation.mutate({ id, resolved: !currentStatus });
  };
  
  const handleViewDetails = (feedback: any) => {
    setSelectedFeedback(feedback);
    setIsDialogOpen(true);
  };
  
  // Filter and paginate feedbacks
  const filteredFeedbacks = feedbacksData
    ? feedbacksData.filter((feedback: any) => {
        const matchesSearch = 
          feedback.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          feedback.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          feedback.message.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = !typeFilter || typeFilter === "all" || feedback.feedbackType === typeFilter;
        const matchesStatus = !statusFilter || statusFilter === "all" || 
          (statusFilter === "resolved" && feedback.resolved) ||
          (statusFilter === "unresolved" && !feedback.resolved);
        
        return matchesSearch && matchesType && matchesStatus;
      })
    : [];
  
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statusFilter]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get badge color based on feedback type
  const getFeedbackTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'compliment':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'suggestion':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'complaint':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'report':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <>
      <Helmet>
        <title>Feedback Management - Park Management System</title>
        <meta name="description" content="Manage passenger feedback in the Park Management System. Review and respond to passenger comments, complaints, and suggestions." />
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
                <h1 className="text-lg font-medium text-gray-700">Feedback Management</h1>
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-heading font-bold text-gray-800">Passenger Feedback</h2>
                </div>
                
                {/* Search and Filter Controls */}
                <div className="bg-white p-4 shadow rounded-lg mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          placeholder="Search by name, plate number, or message..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="md:w-48">
                      <Select
                        value={typeFilter}
                        onValueChange={setTypeFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="compliment">Compliments</SelectItem>
                          <SelectItem value="suggestion">Suggestions</SelectItem>
                          <SelectItem value="complaint">Complaints</SelectItem>
                          <SelectItem value="report">Reports</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:w-48">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="unresolved">Unresolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Feedback Cards */}
                {feedbacksLoading ? (
                  <div className="p-4 text-center">Loading feedback...</div>
                ) : filteredFeedbacks.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-lg shadow">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
                    <p className="text-gray-500 mb-4">No feedback matches your current filters.</p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery("");
                      setTypeFilter("");
                      setStatusFilter("");
                    }}>
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {paginatedFeedbacks.map((feedback: any) => (
                        <Card key={feedback.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{feedback.passengerName}</CardTitle>
                              <Badge className={getFeedbackTypeBadgeColor(feedback.feedbackType)}>
                                {feedback.feedbackType.charAt(0).toUpperCase() + feedback.feedbackType.slice(1)}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center space-x-1">
                              <Car className="h-3 w-3" />
                              <span className="font-mono">{feedback.plateNumber}</span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex items-center mb-2">
                              <StarRating value={feedback.rating} readOnly />
                            </div>
                            <p className="text-gray-700 line-clamp-3">{feedback.message}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center pt-2">
                            <div className="text-xs text-gray-500">
                              {formatDate(feedback.createdAt)}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(feedback)}
                              >
                                View
                              </Button>
                              <Button 
                                variant={feedback.resolved ? "destructive" : "default"}
                                size="sm"
                                onClick={() => handleResolveToggle(feedback.id, feedback.resolved)}
                                disabled={resolveMutation.isPending}
                              >
                                {feedback.resolved ? (
                                  <>
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Unresolve
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Resolve
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {filteredFeedbacks.length > 0 && (
                      <div className="bg-white rounded-lg mt-6 px-4 py-3 shadow">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                            <span className="font-medium">
                              {Math.min(currentPage * itemsPerPage, filteredFeedbacks.length)}
                            </span>{" "}
                            of <span className="font-medium">{filteredFeedbacks.length}</span> feedbacks
                          </div>
                          
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                              </PaginationItem>
                              
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={currentPage === page}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              
                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback Details Dialog */}
      {selectedFeedback && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
              <DialogDescription>
                Submitted by {selectedFeedback.passengerName} on {formatDate(selectedFeedback.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Vehicle Plate Number</h4>
                <p className="font-mono font-medium">{selectedFeedback.plateNumber}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Rating</h4>
                <StarRating value={selectedFeedback.rating} readOnly />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Feedback Type</h4>
                <Badge className={getFeedbackTypeBadgeColor(selectedFeedback.feedbackType)}>
                  {selectedFeedback.feedbackType.charAt(0).toUpperCase() + selectedFeedback.feedbackType.slice(1)}
                </Badge>
              </div>
              
              {selectedFeedback.passengerEmail && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Email</h4>
                  <p>{selectedFeedback.passengerEmail}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 max-h-40 overflow-y-auto">
                  <p className="whitespace-pre-wrap">{selectedFeedback.message}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                <Badge className={selectedFeedback.resolved ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-amber-100 text-amber-800 hover:bg-amber-100'}>
                  {selectedFeedback.resolved ? 'Resolved' : 'Unresolved'}
                </Badge>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant={selectedFeedback.resolved ? "destructive" : "default"}
                onClick={() => {
                  handleResolveToggle(selectedFeedback.id, selectedFeedback.resolved);
                  setIsDialogOpen(false);
                }}
                disabled={resolveMutation.isPending}
              >
                {selectedFeedback.resolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FeedbackManagement;
