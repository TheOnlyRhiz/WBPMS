import { useState, useEffect } from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/admin/sidebar";
import VehicleModal from "@/components/admin/vehicle-modal";
import { 
  Car,
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
import DeleteConfirmationDialog from "@/components/admin/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Helmet } from 'react-helmet';

const Vehicles = () => {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  
  const itemsPerPage = 10;
  
  // Redirect if not authenticated
  if (!loading && !user) {
    return <Redirect to="/login" />;
  }
  
  const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/vehicles"],
    enabled: !!user,
  });
  
  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ["/api/drivers"],
    enabled: !!user,
  });
  
  const deleteVehicleMutation = useMutation({
    mutationFn: async (vehicleId: number) => {
      await apiRequest("DELETE", `/api/vehicles/${vehicleId}`);
    },
    onSuccess: () => {
      toast({
        title: "Vehicle Deleted",
        description: "Vehicle has been deleted successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive",
      });
      console.error("Delete vehicle error:", error);
    },
  });
  
  const handleOpenVehicleModal = (vehicle?: any) => {
    setCurrentVehicle(vehicle || null);
    setIsVehicleModalOpen(true);
  };
  
  const handleDeleteClick = (vehicleId: number) => {
    setVehicleToDelete(vehicleId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (vehicleToDelete) {
      deleteVehicleMutation.mutate(vehicleToDelete);
    }
  };
  
  // Get driver details for each vehicle
  const getDriverName = (driverId: number) => {
    if (!driversData || !Array.isArray(driversData)) return "Unknown";
    const driver = driversData.find((d: any) => d.id === driverId);
    return driver ? driver.name : "Unknown";
  };
  
  const getDriverStatus = (driverId: number) => {
    if (!driversData || !Array.isArray(driversData)) return "unknown";
    const driver = driversData.find((d: any) => d.id === driverId);
    return driver ? driver.status : "unknown";
  };
  
  // Filter and paginate vehicles
  const filteredVehicles = Array.isArray(vehiclesData)
    ? vehiclesData.filter((vehicle: any) => {
        const matchesSearch = 
          vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.type.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = !vehicleTypeFilter || 
          vehicleTypeFilter === "all" || 
          vehicle.type.toLowerCase().includes(vehicleTypeFilter.toLowerCase());
        
        const matchesStatus = !statusFilter || 
          statusFilter === "all" || 
          vehicle.status === statusFilter;
        
        return matchesSearch && matchesType && matchesStatus;
      })
    : [];
  
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, vehicleTypeFilter, statusFilter]);

  return (
    <>
      <Helmet>
        <title>Vehicle Management - Park Management System</title>
        <meta name="description" content="Manage vehicles registered in the Park Management System. Add, edit, or remove vehicles from the fleet." />
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
                <h1 className="text-lg font-medium text-gray-700">Vehicles Management</h1>
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-heading font-bold text-gray-800">Vehicles Management</h2>
                  <Button onClick={() => handleOpenVehicleModal()}>
                    <Plus className="h-5 w-5 mr-1" /> Add Vehicle
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
                          placeholder="Search vehicles by plate number or type..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="md:w-48">
                      <Select
                        value={vehicleTypeFilter}
                        onValueChange={setVehicleTypeFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Vehicle Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Vehicle Types</SelectItem>
                          <SelectItem value="Commercial Bus">Commercial Bus</SelectItem>
                          <SelectItem value="Toyota Hiace">Toyota Hiace</SelectItem>
                          <SelectItem value="Commercial Taxi">Commercial Taxi</SelectItem>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Tricycle">Tricycle</SelectItem>
                          <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="Van">Van</SelectItem>
                          <SelectItem value="Truck">Truck</SelectItem>
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="maintenance">Under Maintenance</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Vehicles Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  {vehiclesLoading || driversLoading ? (
                    <div className="p-4 text-center">Loading vehicles...</div>
                  ) : filteredVehicles.length === 0 ? (
                    <div className="p-8 text-center">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                      <p className="text-gray-500 mb-4">No vehicles match your current filters.</p>
                      <Button variant="outline" onClick={() => {
                        setSearchQuery("");
                        setVehicleTypeFilter("");
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
                            <TableHead>Plate Number</TableHead>
                            <TableHead>Vehicle Type</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Registration Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedVehicles.map((vehicle: any) => (
                            <TableRow key={vehicle.id}>
                              <TableCell>
                                <div className="font-mono font-medium text-gray-900">{vehicle.plateNumber}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-gray-900">{vehicle.type}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-gray-900">{getDriverName(vehicle.driverId)}</div>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  vehicle.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : vehicle.status === 'suspended'
                                      ? 'bg-red-100 text-red-800'
                                      : vehicle.status === 'maintenance'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {vehicle.status || 'active'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-500">
                                  {new Date(vehicle.registrationDate).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  className="text-primary hover:text-primary-dark"
                                  onClick={() => handleOpenVehicleModal(vehicle)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeleteClick(vehicle.id)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {filteredVehicles.length > 0 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                          <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, filteredVehicles.length)}
                          </span>{" "}
                          of <span className="font-medium">{filteredVehicles.length}</span> vehicles
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
      
      {/* Vehicle Modal */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        vehicle={currentVehicle}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Vehicle"
        description="Are you sure you want to delete this vehicle? This action cannot be undone."
        isDeleting={deleteVehicleMutation.isPending}
      />
    </>
  );
};

export default Vehicles;
