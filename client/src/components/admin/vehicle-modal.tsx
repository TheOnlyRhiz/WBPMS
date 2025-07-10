import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const vehicleSchema = z.object({
  plateNumber: z.string().min(5, { message: "Plate number is required" }),
  type: z.string().min(1, { message: "Vehicle type is required" }),
  driverId: z.number({ 
    required_error: "Driver is required",
    invalid_type_error: "Driver is required" 
  }).int().positive({ message: "Invalid driver" }),
  status: z.string().min(1, { message: "Status is required" }),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: {
    id: number;
    plateNumber: string;
    type: string;
    driverId: number;
    status: string;
    registrationDate: string;
  };
}

const VehicleModal = ({ isOpen, onClose, vehicle }: VehicleModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!vehicle;
  
  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ["/api/drivers"],
    enabled: isOpen,
  });
  
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plateNumber: "",
      type: "",
      driverId: 0,
      status: "active",
    },
  });
  
  useEffect(() => {
    if (vehicle) {
      form.reset({
        plateNumber: vehicle.plateNumber,
        type: vehicle.type,
        driverId: vehicle.driverId,
        status: vehicle.status || "active",
      });
    } else {
      form.reset({
        plateNumber: "",
        type: "",
        driverId: 0,
        status: "active",
      });
    }
  }, [vehicle, form, isOpen]);
  
  const createVehicleMutation = useMutation({
    mutationFn: async (data: VehicleFormValues) => {
      const res = await apiRequest("POST", "/api/vehicles", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vehicle Created",
        description: "Vehicle has been created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create vehicle",
        variant: "destructive",
      });
      console.error("Create vehicle error:", error);
    },
  });
  
  const updateVehicleMutation = useMutation({
    mutationFn: async (data: VehicleFormValues & { id: number }) => {
      const { id, ...vehicleData } = data;
      const res = await apiRequest("PUT", `/api/vehicles/${id}`, vehicleData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vehicle Updated",
        description: "Vehicle has been updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive",
      });
      console.error("Update vehicle error:", error);
    },
  });
  
  const onSubmit = (values: VehicleFormValues) => {
    if (isEditing && vehicle) {
      updateVehicleMutation.mutate({ ...values, id: vehicle.id });
    } else {
      createVehicleMutation.mutate(values);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-500">
          Fill in the details for the vehicle.
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plateNumber">Plate Number</Label>
              <Input
                id="plateNumber"
                className="font-mono uppercase"
                {...form.register("plateNumber")}
                onChange={(e) => form.setValue("plateNumber", e.target.value.toUpperCase())}
              />
              {form.formState.errors.plateNumber && (
                <p className="text-sm text-red-500">{form.formState.errors.plateNumber.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type</Label>
              <Select
                onValueChange={(value) => form.setValue("type", value, { shouldValidate: true })}
                defaultValue={form.watch("type") || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Commercial Bus (18-Seater)">Commercial Bus (18-Seater)</SelectItem>
                  <SelectItem value="Commercial Bus (14-Seater)">Commercial Bus (14-Seater)</SelectItem>
                  <SelectItem value="Toyota Hiace Commuter Bus">Toyota Hiace Commuter Bus</SelectItem>
                  <SelectItem value="Volkswagen Crafter Bus">Volkswagen Crafter Bus</SelectItem>
                  <SelectItem value="Iveco Daily Minibus">Iveco Daily Minibus</SelectItem>
                  <SelectItem value="Peugeot Boxer Minibus">Peugeot Boxer Minibus</SelectItem>
                  <SelectItem value="Toyota Coaster Bus">Toyota Coaster Bus</SelectItem>
                  <SelectItem value="Mitsubishi Rosa Bus">Mitsubishi Rosa Bus</SelectItem>
                  <SelectItem value="Commercial Taxi (Sedan)">Commercial Taxi (Sedan)</SelectItem>
                  <SelectItem value="Toyota Corolla Taxi">Toyota Corolla Taxi</SelectItem>
                  <SelectItem value="Honda Accord Taxi">Honda Accord Taxi</SelectItem>
                  <SelectItem value="Hyundai Elantra Taxi">Hyundai Elantra Taxi</SelectItem>
                  <SelectItem value="Kia Cerato Taxi">Kia Cerato Taxi</SelectItem>
                  <SelectItem value="Commercial SUV">Commercial SUV</SelectItem>
                  <SelectItem value="Toyota Sienna (7-Seater)">Toyota Sienna (7-Seater)</SelectItem>
                  <SelectItem value="Honda Pilot (8-Seater)">Honda Pilot (8-Seater)</SelectItem>
                  <SelectItem value="Tricycle (Keke NAPEP)">Tricycle (Keke NAPEP)</SelectItem>
                  <SelectItem value="Motorcycle (Okada)">Motorcycle (Okada)</SelectItem>
                  <SelectItem value="Delivery Van">Delivery Van</SelectItem>
                  <SelectItem value="Cargo Truck">Cargo Truck</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="driverId">Driver</Label>
              <Select
                onValueChange={(value) => form.setValue("driverId", parseInt(value), { shouldValidate: true })}
                defaultValue={form.watch("driverId") ? form.watch("driverId").toString() : undefined}
                disabled={driversLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={driversLoading ? "Loading drivers..." : "Select a driver"} />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(driversData) && driversData.map((driver: any) => (
                    <SelectItem key={driver.id} value={driver.id.toString()}>
                      {driver.name} - {driver.licenseNumber}
                    </SelectItem>
                  ))}
                  {/* Show when no drivers are available */}
                  {(!Array.isArray(driversData) || driversData.length === 0) && (
                    <div className="px-2 py-4 text-sm text-center text-gray-500">
                      No drivers available. Please add a driver first.
                    </div>
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.driverId && (
                <p className="text-sm text-red-500">{form.formState.errors.driverId.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => form.setValue("status", value, { shouldValidate: true })}
                defaultValue={form.watch("status") || "active"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={
                createVehicleMutation.isPending || 
                updateVehicleMutation.isPending
              }
            >
              {isEditing ? "Update Vehicle" : "Save Vehicle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleModal;
