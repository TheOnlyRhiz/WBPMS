import { 
  User, InsertUser, users, 
  Driver, InsertDriver, drivers,
  Vehicle, InsertVehicle, vehicles,
  Feedback, InsertFeedback, feedbacks 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcrypt";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  // Driver operations
  async getDriver(id: number): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id));
    return driver || undefined;
  }
  
  async getDriverByLicenseNumber(licenseNumber: string): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.licenseNumber, licenseNumber));
    return driver || undefined;
  }
  
  async getAllDrivers(): Promise<Driver[]> {
    return await db.select().from(drivers);
  }
  
  async createDriver(driverData: InsertDriver): Promise<Driver> {
    const [driver] = await db.insert(drivers).values({
      ...driverData,
      createdAt: new Date()
    }).returning();
    return driver;
  }
  
  async updateDriver(id: number, driverData: Partial<InsertDriver>): Promise<Driver | undefined> {
    const [updatedDriver] = await db.update(drivers)
      .set(driverData)
      .where(eq(drivers.id, id))
      .returning();
    return updatedDriver || undefined;
  }
  
  async deleteDriver(id: number): Promise<boolean> {
    // Check if driver has vehicles
    const driverVehicles = await this.getVehiclesByDriverId(id);
    
    // Delete all driver's vehicles first
    for (const vehicle of driverVehicles) {
      await this.deleteVehicle(vehicle.id);
    }
    
    const result = await db.delete(drivers).where(eq(drivers.id, id)).returning();
    return result.length > 0;
  }
  
  // Vehicle operations
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || undefined;
  }
  
  async getVehicleByPlateNumber(plateNumber: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles)
      .where(eq(vehicles.plateNumber, plateNumber.toUpperCase()));
    return vehicle || undefined;
  }
  
  async getAllVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles);
  }
  
  async getVehiclesByDriverId(driverId: number): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.driverId, driverId));
  }
  
  async createVehicle(vehicleData: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db.insert(vehicles).values({
      ...vehicleData,
      plateNumber: vehicleData.plateNumber.toUpperCase(),
      registrationDate: new Date()
    }).returning();
    return vehicle;
  }
  
  async updateVehicle(id: number, vehicleData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const data = { ...vehicleData };
    if (data.plateNumber) {
      data.plateNumber = data.plateNumber.toUpperCase();
    }
    
    const [updatedVehicle] = await db.update(vehicles)
      .set(data)
      .where(eq(vehicles.id, id))
      .returning();
    return updatedVehicle || undefined;
  }
  
  async deleteVehicle(id: number): Promise<boolean> {
    const result = await db.delete(vehicles).where(eq(vehicles.id, id)).returning();
    return result.length > 0;
  }
  
  // Feedback operations
  async getFeedback(id: number): Promise<Feedback | undefined> {
    const [feedback] = await db.select().from(feedbacks).where(eq(feedbacks.id, id));
    return feedback || undefined;
  }
  
  async getAllFeedbacks(): Promise<Feedback[]> {
    return await db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt));
  }
  
  async getFeedbacksByPlateNumber(plateNumber: string): Promise<Feedback[]> {
    return await db.select().from(feedbacks)
      .where(eq(feedbacks.plateNumber, plateNumber.toUpperCase()))
      .orderBy(desc(feedbacks.createdAt));
  }
  
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [feedback] = await db.insert(feedbacks).values({
      ...feedbackData,
      plateNumber: feedbackData.plateNumber.toUpperCase(),
      createdAt: new Date(),
      resolved: false
    }).returning();
    return feedback;
  }
  
  async resolveFeedback(id: number, resolved: boolean): Promise<Feedback | undefined> {
    const [updatedFeedback] = await db.update(feedbacks)
      .set({ resolved })
      .where(eq(feedbacks.id, id))
      .returning();
    return updatedFeedback || undefined;
  }
  
  // Special operations
  async getVehicleWithDriver(plateNumber: string): Promise<{ vehicle: Vehicle; driver: Driver } | undefined> {
    const vehicle = await this.getVehicleByPlateNumber(plateNumber);
    if (!vehicle) return undefined;
    
    const driver = await this.getDriver(vehicle.driverId);
    if (!driver) return undefined;
    
    return { vehicle, driver };
  }
  
  async countStats(): Promise<{ driversCount: number; vehiclesCount: number; feedbacksCount: number; issuesCount: number }> {
    const driversCount = (await db.select({ count: drivers.id }).from(drivers))[0]?.count || 0;
    const vehiclesCount = (await db.select({ count: vehicles.id }).from(vehicles))[0]?.count || 0;
    const feedbacksCount = (await db.select({ count: feedbacks.id }).from(feedbacks))[0]?.count || 0;
    
    const issuesResult = await db.select({ count: feedbacks.id })
      .from(feedbacks)
      .where(
        and(
          eq(feedbacks.resolved, false),
          eq(feedbacks.feedbackType, "complaint")
        )
      );
    
    const issuesCount = issuesResult[0]?.count || 0;
    
    return {
      driversCount: Number(driversCount),
      vehiclesCount: Number(vehiclesCount),
      feedbacksCount: Number(feedbacksCount),
      issuesCount: Number(issuesCount)
    };
  }

  // Seed initial data
  async seedInitialData() {
    // Check if we already have an admin user
    const adminUser = await this.getUserByUsername("admin");
    if (!adminUser) {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await this.createUser({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true
      });
      
      // Create sample drivers
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
      
      // Create sample feedback
      await this.createFeedback({
        passengerName: "John Doe",
        passengerEmail: "john@example.com",
        plateNumber: "LAS-432KJ",
        rating: 4,
        feedbackType: "compliment",
        message: "The driver was very professional and courteous."
      });
      
      await this.createFeedback({
        passengerName: "Jane Smith",
        passengerEmail: "jane@example.com",
        plateNumber: "ABJ-223KL",
        rating: 2,
        feedbackType: "complaint",
        message: "The driver was rude and drove recklessly."
      });
    }
  }
}