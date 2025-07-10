import { useState, useEffect } from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/admin/sidebar";
import DriverModal from "@/components/admin/driver-modal";
import { 
  Car,
  Users,
  Menu,
  Search,
  Plus,
  AlertTriangle
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Helmet } from 'react-helmet';

const Drivers = () => {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  
  const itemsPerPage = 10;
  
  // Redirect if not authenticated
  if (!loading && !user) {
    return <Redirect to="/login" />;
  }
  
  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ["/api/drivers"],
    enabled: !!user,
  });
  
  const deleteDriverMutation = useMutation({
    mutationFn: async (driverId: number) => {
      await apiRequest("DELETE", `/api/drivers/${driverId}`);
    },
    onSuccess: () => {
      toast({
        title: "Driver Deleted",
        description: "Driver has been deleted successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/drivers"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete driver",
        variant: "destructive",
      });
      console.error("Delete driver error:", error);
    },
  });
  
  const handleOpenDriverModal = (driver?: any) => {
    setCurrentDriver(driver || null);
    setIsDriverModalOpen(true);
  };
  
  const handleDeleteClick = (driverId: number) => {
    setDriverToDelete(driverId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (driverToDelete) {
      deleteDriverMutation.mutate(driverToDelete);
    }
  };
  
  // Filter and paginate drivers
  const filteredDrivers = Array.isArray(driversData)
    ? driversData.filter((driver: any) => {
        const matchesSearch = 
          driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = !statusFilter || statusFilter === "all-statuses" || driver.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
    : [];
  
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <>
      <Helmet>
        <title>Driver Management - Park Management System</title>
        <meta name="description" content="Manage drivers registered in the Park Management System. Add, edit, or remove drivers and their vehicles." />
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
                <h1 className="text-lg font-medium text-gray-700">Drivers Management</h1>
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-heading font-bold text-gray-800">Drivers Management</h2>
                  <Button onClick={() => handleOpenDriverModal()}>
                    <Plus className="h-5 w-5 mr-1" /> Add Driver
                  </Button>
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
                          placeholder="Search drivers..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="md:w-48">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-statuses">All Statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Drivers Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  {driversLoading ? (
                    <div className="p-4 text-center">Loading drivers...</div>
                  ) : filteredDrivers.length === 0 ? (
                    <div className="p-8 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
                      <p className="text-gray-500 mb-4">No drivers match your current filters.</p>
                      <Button variant="outline" onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("");
                      }}>
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Driver</TableHead>
                            <TableHead>License No.</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Registered On</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedDrivers.map((driver: any) => {
                            return (
                              <TableRow key={driver.id}>
                                <TableCell>
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                      <Users className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                      <div className="text-sm text-gray-500">{driver.phoneNumber}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm font-mono text-gray-900">{driver.licenseNumber}</div>
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    driver.status === 'active' 
                                      ? 'bg-green-100 text-green-800' 
                                      : driver.status === 'suspended'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {driver.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm text-gray-500 max-w-xs truncate">
                                    {driver.notes || "No additional notes"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm text-gray-500">
                                    {new Date(driver.createdAt).toLocaleDateString()}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    className="text-primary hover:text-primary-dark"
                                    onClick={() => handleOpenDriverModal(driver)}
                                  >
                                    Edit
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {filteredDrivers.length > 0 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                          <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, filteredDrivers.length)}
                          </span>{" "}
                          of <span className="font-medium">{filteredDrivers.length}</span> drivers
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Driver Modal */}
      <DriverModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        driver={currentDriver}
      />
      

    </>
  );
};

export default Drivers;
