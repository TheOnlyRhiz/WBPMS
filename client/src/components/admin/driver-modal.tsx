import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const driverSchema = z.object({
  name: z.string().min(2, { message: "Driver name must be at least 2 characters" }),
  phoneNumber: z.string().min(5, { message: "Phone number is required" }),
  licenseNumber: z.string().min(5, { message: "License number is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  notes: z.string().optional(),
});

type DriverFormValues = z.infer<typeof driverSchema>;

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver?: {
    id: number;
    name: string;
    phoneNumber: string;
    licenseNumber: string;
    status: string;
    notes?: string;
  };
}

const DriverModal = ({ isOpen, onClose, driver }: DriverModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!driver;
  
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      licenseNumber: "",
      status: "active",
      notes: "",
    },
  });
  
  useEffect(() => {
    if (driver) {
      form.reset({
        name: driver.name,
        phoneNumber: driver.phoneNumber,
        licenseNumber: driver.licenseNumber,
        status: driver.status,
        notes: driver.notes || "",
      });
    } else {
      form.reset({
        name: "",
        phoneNumber: "",
        licenseNumber: "",
        status: "active",
        notes: "",
      });
    }
  }, [driver, form, isOpen]);
  
  const createDriverMutation = useMutation({
    mutationFn: async (data: DriverFormValues) => {
      // Only create the driver with driver-specific fields
      return await apiRequest("POST", "/api/drivers", {
        name: data.name,
        phoneNumber: data.phoneNumber,
        licenseNumber: data.licenseNumber,
        status: data.status,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      toast({
        title: "Driver Created",
        description: "Driver has been created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/drivers"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create driver",
        variant: "destructive",
      });
      console.error("Create driver error:", error);
    },
  });
  
  const updateDriverMutation = useMutation({
    mutationFn: async (data: DriverFormValues) => {
      if (!driver) return;
      
      // Update driver
      await apiRequest("PUT", `/api/drivers/${driver.id}`, {
        name: data.name,
        phoneNumber: data.phoneNumber,
        licenseNumber: data.licenseNumber,
        status: data.status,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      toast({
        title: "Driver Updated",
        description: "Driver has been updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/drivers"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update driver",
        variant: "destructive",
      });
      console.error("Update driver error:", error);
    },
  });
  
  const onSubmit = (values: DriverFormValues) => {
    if (isEditing) {
      updateDriverMutation.mutate(values);
    } else {
      createDriverMutation.mutate(values);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Driver" : "Add New Driver"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="driver-name">Driver Name</Label>
              <Input
                id="driver-name"
                placeholder="Full name"
                {...form.register("name")}
                className="mt-1"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="driver-phone">Phone Number</Label>
              <Input
                id="driver-phone"
                placeholder="+234..."
                {...form.register("phoneNumber")}
                className="mt-1"
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="driver-license">License Number</Label>
              <Input
                id="driver-license"
                placeholder="LIC-..."
                {...form.register("licenseNumber")}
                className="mt-1 font-mono"
              />
              {form.formState.errors.licenseNumber && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.licenseNumber.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="driver-status">Status</Label>
              <Select
                onValueChange={(value) => form.setValue("status", value, { shouldValidate: true })}
                defaultValue={form.watch("status") || "active"}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.status.message}</p>
              )}
            </div>

          </div>
          <div className="mb-6">
            <Label htmlFor="driver-notes">Additional Notes</Label>
            <Textarea
              id="driver-notes"
              placeholder="Any additional information about the driver..."
              rows={3}
              {...form.register("notes")}
              className="mt-1"
            />
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
                createDriverMutation.isPending || 
                updateDriverMutation.isPending
              }
            >
              {isEditing ? "Update Driver" : "Save Driver"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DriverModal;
