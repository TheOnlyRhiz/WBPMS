import { 
  User, InsertUser, users, 
  Driver, InsertDriver, drivers,
  Vehicle, InsertVehicle, vehicles,
  Feedback, InsertFeedback, feedbacks 
} from "@shared/schema";
import bcrypt from "bcrypt";

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  userId?: number;
  entityType?: string;
  entityId?: number;
}

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Driver operations
  getDriver(id: number): Promise<Driver | undefined>;
  getDriverByLicenseNumber(licenseNumber: string): Promise<Driver | undefined>;
  getAllDrivers(): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: number, driver: Partial<InsertDriver>): Promise<Driver | undefined>;
  deleteDriver(id: number): Promise<boolean>;
  
  // Vehicle operations
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehicleByPlateNumber(plateNumber: string): Promise<Vehicle | undefined>;
  getAllVehicles(): Promise<Vehicle[]>;
  getVehiclesByDriverId(driverId: number): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  
  // Feedback operations
  getFeedback(id: number): Promise<Feedback | undefined>;
  getAllFeedbacks(): Promise<Feedback[]>;
  getFeedbacksByPlateNumber(plateNumber: string): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  resolveFeedback(id: number, resolved: boolean): Promise<Feedback | undefined>;
  
  // Activity operations
  getRecentActivities(limit?: number): Promise<Activity[]>;
  logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity>;
  
  // Special operations
  getVehicleWithDriver(plateNumber: string): Promise<{ vehicle: Vehicle; driver: Driver } | undefined>;
  countStats(): Promise<{ driversCount: number; vehiclesCount: number; feedbacksCount: number; issuesCount: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private drivers: Map<number, Driver>;
  private vehicles: Map<number, Vehicle>;
  private feedbacks: Map<number, Feedback>;
  private activities: Map<number, Activity>;
  private currentUserId: number = 1;
  private currentDriverId: number = 1;
  private currentVehicleId: number = 1;
  private currentFeedbackId: number = 1;
  private currentActivityId: number = 1;

  constructor() {
    this.users = new Map();
    this.drivers = new Map();
    this.vehicles = new Map();
    this.feedbacks = new Map();
    this.activities = new Map();
    
    // Create default admin user
    this.seedData();
  }

  private async seedData() {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    this.createUser({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true
    });
    
    // Create sample drivers with more realistic data
    const driver1 = await this.createDriver({
      name: "Adebayo Johnson",
      phoneNumber: "+234 803 456 7890",
      licenseNumber: "LIC-23456789",
      status: "active",
      notes: "Experienced driver with excellent record"
    });
    
    const driver2 = await this.createDriver({
      name: "Chioma Okafor",
      phoneNumber: "+234 802 123 4567",
      licenseNumber: "LIC-87654321",
      status: "suspended",
      notes: "Suspended due to multiple complaints"
    });
    
    const driver3 = await this.createDriver({
      name: "Ibrahim Musa",
      phoneNumber: "+234 905 678 9012",
      licenseNumber: "LIC-54321678",
      status: "active",
      notes: "New driver, joined recently"
    });

    const driver4 = await this.createDriver({
      name: "Fatima Abdullahi",
      phoneNumber: "+234 706 234 5678",
      licenseNumber: "LIC-98765432",
      status: "active",
      notes: "Professional taxi driver with 8 years experience"
    });

    const driver5 = await this.createDriver({
      name: "Emeka Nwosu",
      phoneNumber: "+234 813 987 6543",
      licenseNumber: "LIC-45678912",
      status: "active",
      notes: "Commercial bus driver specializing in interstate routes"
    });

    const driver6 = await this.createDriver({
      name: "Aisha Mohammed",
      phoneNumber: "+234 701 456 7890",
      licenseNumber: "LIC-78912345",
      status: "inactive",
      notes: "On medical leave, expected to return next month"
    });

    const driver7 = await this.createDriver({
      name: "Olumide Adeyemi",
      phoneNumber: "+234 802 345 6789",
      licenseNumber: "LIC-56789123",
      status: "active",
      notes: "Tricycle operator with clean driving record"
    });

    const driver8 = await this.createDriver({
      name: "Blessing Okoro",
      phoneNumber: "+234 809 876 5432",
      licenseNumber: "LIC-34567891",
      status: "active",
      notes: "Recently certified driver, eager to work"
    });
    
    // Create sample vehicles
    await this.createVehicle({
      plateNumber: "LAS-432KJ",
      type: "Toyota Hiace Bus",
      driverId: driver1.id
    });
    
    await this.createVehicle({
      plateNumber: "ABJ-223KL",
      type: "Honda Accord Sedan",
      driverId: driver2.id
    });
    
    await this.createVehicle({
      plateNumber: "LAS-876JK",
      type: "Toyota Camry Sedan",
      driverId: driver3.id
    });
    
    // Create sample feedback with more variety
    await this.createFeedback({
      passengerName: "John Doe",
      passengerEmail: "john@example.com",
      plateNumber: "LAS-432KJ",
      rating: 4,
      feedbackType: "compliment",
      message: "The driver was very professional and courteous. Clean vehicle and safe driving."
    });
    
    await this.createFeedback({
      passengerName: "Jane Smith",
      passengerEmail: "jane@example.com",
      plateNumber: "ABJ-223KL",
      rating: 2,
      feedbackType: "complaint",
      message: "The driver was rude and drove recklessly. Vehicle was not clean."
    });

    await this.createFeedback({
      passengerName: "Ahmed Hassan",
      passengerEmail: "ahmed@example.com",
      plateNumber: "FCT-567AB",
      rating: 5,
      feedbackType: "compliment",
      message: "Excellent service! Driver was punctual and vehicle was very comfortable."
    });

    await this.createFeedback({
      passengerName: "Grace Adebayo",
      passengerEmail: "grace@example.com",
      plateNumber: "LAS-876JK",
      rating: 3,
      feedbackType: "suggestion",
      message: "Good service overall, but could improve on vehicle maintenance."
    });

    await this.createFeedback({
      passengerName: "Musa Ibrahim",
      passengerEmail: "musa@example.com",
      plateNumber: "OGN-123EF",
      rating: 1,
      feedbackType: "complaint",
      message: "Driver demanded extra money beyond the agreed fare. Very unprofessional."
    });

    await this.createFeedback({
      passengerName: "Sarah Johnson",
      passengerEmail: "sarah@example.com",
      plateNumber: "EDO-456GH",
      rating: 4,
      feedbackType: "compliment",
      message: "Safe journey and friendly driver. Would recommend!"
    });

    await this.createFeedback({
      passengerName: "David Okonkwo",
      passengerEmail: "david@example.com",
      plateNumber: "LAS-432KJ",
      rating: 3,
      feedbackType: "suggestion",
      message: "Driver should improve on time management. Arrived 15 minutes late."
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...userData, 
      id, 
      isAdmin: userData.isAdmin || null 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Driver operations
  async getDriver(id: number): Promise<Driver | undefined> {
    return this.drivers.get(id);
  }
  
  async getDriverByLicenseNumber(licenseNumber: string): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find(
      (driver) => driver.licenseNumber === licenseNumber
    );
  }
  
  async getAllDrivers(): Promise<Driver[]> {
    return Array.from(this.drivers.values());
  }
  
  async createDriver(driver: InsertDriver): Promise<Driver> {
    const id = this.currentDriverId++;
    const now = new Date();
    const newDriver: Driver = { 
      ...driver, 
      id, 
      createdAt: now,
      status: driver.status || 'active',
      notes: driver.notes || null
    };
    this.drivers.set(id, newDriver);
    return newDriver;
  }
  
  async updateDriver(id: number, driverData: Partial<InsertDriver>): Promise<Driver | undefined> {
    const driver = this.drivers.get(id);
    if (!driver) return undefined;
    
    const updatedDriver: Driver = { ...driver, ...driverData };
    this.drivers.set(id, updatedDriver);
    return updatedDriver;
  }
  
  async deleteDriver(id: number): Promise<boolean> {
    // Check if driver has vehicles
    const driverVehicles = await this.getVehiclesByDriverId(id);
    if (driverVehicles.length > 0) {
      // Delete all driver's vehicles first
      for (const vehicle of driverVehicles) {
        await this.deleteVehicle(vehicle.id);
      }
    }
    
    return this.drivers.delete(id);
  }
  
  // Vehicle operations
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }
  
  async getVehicleByPlateNumber(plateNumber: string): Promise<Vehicle | undefined> {
    return Array.from(this.vehicles.values()).find(
      (vehicle) => vehicle.plateNumber.toLowerCase() === plateNumber.toLowerCase()
    );
  }
  
  async getAllVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }
  
  async getVehiclesByDriverId(driverId: number): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(
      (vehicle) => vehicle.driverId === driverId
    );
  }
  
  async createVehicle(vehicleData: InsertVehicle): Promise<Vehicle> {
    const id = this.currentVehicleId++;
    const now = new Date();
    const newVehicle: Vehicle = { ...vehicleData, id, registrationDate: now, status: vehicleData.status || 'active' };
    this.vehicles.set(id, newVehicle);
    
    // Log activity only if not during initial seeding
    if (this.activities.size > 0) {
      const driver = await this.getDriver(vehicleData.driverId);
      await this.logActivity({
        type: "vehicle_created",
        title: "New vehicle registered",
        description: `${vehicleData.type} (${vehicleData.plateNumber}) assigned to ${driver?.name || 'Unknown Driver'}`,
        entityType: "vehicle",
        entityId: id
      });
    }
    
    return newVehicle;
  }
  
  async updateVehicle(id: number, vehicleData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return undefined;
    
    const updatedVehicle: Vehicle = { ...vehicle, ...vehicleData };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }
  
  async deleteVehicle(id: number): Promise<boolean> {
    return this.vehicles.delete(id);
  }
  
  // Feedback operations
  async getFeedback(id: number): Promise<Feedback | undefined> {
    return this.feedbacks.get(id);
  }
  
  async getAllFeedbacks(): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values());
  }
  
  async getFeedbacksByPlateNumber(plateNumber: string): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter(
      (feedback) => feedback.plateNumber.toLowerCase() === plateNumber.toLowerCase()
    );
  }
  
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const id = this.currentFeedbackId++;
    const now = new Date();
    const newFeedback: Feedback = { 
      ...feedbackData, 
      id, 
      createdAt: now, 
      resolved: false,
      passengerEmail: feedbackData.passengerEmail || null
    };
    this.feedbacks.set(id, newFeedback);
    return newFeedback;
  }
  
  async resolveFeedback(id: number, resolved: boolean): Promise<Feedback | undefined> {
    const feedback = this.feedbacks.get(id);
    if (!feedback) return undefined;
    
    const updatedFeedback: Feedback = { ...feedback, resolved };
    this.feedbacks.set(id, updatedFeedback);
    
    // Log activity
    await this.logActivity({
      type: "feedback_resolved",
      title: "Feedback resolved",
      description: `Feedback from ${feedback.passengerName} for vehicle ${feedback.plateNumber} marked as ${resolved ? 'resolved' : 'unresolved'}`,
      entityType: "feedback",
      entityId: id
    });
    
    return updatedFeedback;
  }
  
  // Special operations
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    return activities;
  }

  async logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = {
      ...activity,
      id,
      timestamp: new Date()
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async getVehicleWithDriver(plateNumber: string): Promise<{ vehicle: Vehicle; driver: Driver } | undefined> {
    const vehicle = await this.getVehicleByPlateNumber(plateNumber);
    if (!vehicle) return undefined;
    
    const driver = await this.getDriver(vehicle.driverId);
    if (!driver) return undefined;
    
    return { vehicle, driver };
  }
  
  async countStats(): Promise<{ driversCount: number; vehiclesCount: number; feedbacksCount: number; issuesCount: number }> {
    const driversCount = this.drivers.size;
    const vehiclesCount = this.vehicles.size;
    const feedbacksCount = this.feedbacks.size;
    const issuesCount = Array.from(this.feedbacks.values()).filter(
      (feedback) => !feedback.resolved && ['complaint', 'report'].includes(feedback.feedbackType)
    ).length;
    
    return {
      driversCount,
      vehiclesCount,
      feedbacksCount,
      issuesCount
    };
  }
}

// Switch back to in-memory storage due to database authentication issues
export const storage = new MemStorage();
