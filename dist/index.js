// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import bcrypt from "bcrypt";
var MemStorage = class {
  users;
  drivers;
  vehicles;
  feedbacks;
  activities;
  currentUserId = 1;
  currentDriverId = 1;
  currentVehicleId = 1;
  currentFeedbackId = 1;
  currentActivityId = 1;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.drivers = /* @__PURE__ */ new Map();
    this.vehicles = /* @__PURE__ */ new Map();
    this.feedbacks = /* @__PURE__ */ new Map();
    this.activities = /* @__PURE__ */ new Map();
    this.seedData();
  }
  async seedData() {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    this.createUser({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true
    });
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
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async createUser(userData) {
    const id = this.currentUserId++;
    const user = {
      ...userData,
      id,
      isAdmin: userData.isAdmin || null
    };
    this.users.set(id, user);
    return user;
  }
  // Driver operations
  async getDriver(id) {
    return this.drivers.get(id);
  }
  async getDriverByLicenseNumber(licenseNumber) {
    return Array.from(this.drivers.values()).find(
      (driver) => driver.licenseNumber === licenseNumber
    );
  }
  async getAllDrivers() {
    return Array.from(this.drivers.values());
  }
  async createDriver(driver) {
    const id = this.currentDriverId++;
    const now = /* @__PURE__ */ new Date();
    const newDriver = {
      ...driver,
      id,
      createdAt: now,
      status: driver.status || "active",
      notes: driver.notes || null
    };
    this.drivers.set(id, newDriver);
    return newDriver;
  }
  async updateDriver(id, driverData) {
    const driver = this.drivers.get(id);
    if (!driver) return void 0;
    const updatedDriver = { ...driver, ...driverData };
    this.drivers.set(id, updatedDriver);
    return updatedDriver;
  }
  async deleteDriver(id) {
    const driverVehicles = await this.getVehiclesByDriverId(id);
    if (driverVehicles.length > 0) {
      for (const vehicle of driverVehicles) {
        await this.deleteVehicle(vehicle.id);
      }
    }
    return this.drivers.delete(id);
  }
  // Vehicle operations
  async getVehicle(id) {
    return this.vehicles.get(id);
  }
  async getVehicleByPlateNumber(plateNumber) {
    return Array.from(this.vehicles.values()).find(
      (vehicle) => vehicle.plateNumber.toLowerCase() === plateNumber.toLowerCase()
    );
  }
  async getAllVehicles() {
    return Array.from(this.vehicles.values());
  }
  async getVehiclesByDriverId(driverId) {
    return Array.from(this.vehicles.values()).filter(
      (vehicle) => vehicle.driverId === driverId
    );
  }
  async createVehicle(vehicleData) {
    const id = this.currentVehicleId++;
    const now = /* @__PURE__ */ new Date();
    const newVehicle = { ...vehicleData, id, registrationDate: now, status: vehicleData.status || "active" };
    this.vehicles.set(id, newVehicle);
    if (this.activities.size > 0) {
      const driver = await this.getDriver(vehicleData.driverId);
      await this.logActivity({
        type: "vehicle_created",
        title: "New vehicle registered",
        description: `${vehicleData.type} (${vehicleData.plateNumber}) assigned to ${driver?.name || "Unknown Driver"}`,
        entityType: "vehicle",
        entityId: id
      });
    }
    return newVehicle;
  }
  async updateVehicle(id, vehicleData) {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return void 0;
    const updatedVehicle = { ...vehicle, ...vehicleData };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }
  async deleteVehicle(id) {
    return this.vehicles.delete(id);
  }
  // Feedback operations
  async getFeedback(id) {
    return this.feedbacks.get(id);
  }
  async getAllFeedbacks() {
    return Array.from(this.feedbacks.values());
  }
  async getFeedbacksByPlateNumber(plateNumber) {
    return Array.from(this.feedbacks.values()).filter(
      (feedback) => feedback.plateNumber.toLowerCase() === plateNumber.toLowerCase()
    );
  }
  async createFeedback(feedbackData) {
    const id = this.currentFeedbackId++;
    const now = /* @__PURE__ */ new Date();
    const newFeedback = {
      ...feedbackData,
      id,
      createdAt: now,
      resolved: false,
      passengerEmail: feedbackData.passengerEmail || null
    };
    this.feedbacks.set(id, newFeedback);
    return newFeedback;
  }
  async resolveFeedback(id, resolved) {
    const feedback = this.feedbacks.get(id);
    if (!feedback) return void 0;
    const updatedFeedback = { ...feedback, resolved };
    this.feedbacks.set(id, updatedFeedback);
    await this.logActivity({
      type: "feedback_resolved",
      title: "Feedback resolved",
      description: `Feedback from ${feedback.passengerName} for vehicle ${feedback.plateNumber} marked as ${resolved ? "resolved" : "unresolved"}`,
      entityType: "feedback",
      entityId: id
    });
    return updatedFeedback;
  }
  // Special operations
  async getRecentActivities(limit = 10) {
    const activities = Array.from(this.activities.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
    return activities;
  }
  async logActivity(activity) {
    const id = this.currentActivityId++;
    const newActivity = {
      ...activity,
      id,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }
  async getVehicleWithDriver(plateNumber) {
    const vehicle = await this.getVehicleByPlateNumber(plateNumber);
    if (!vehicle) return void 0;
    const driver = await this.getDriver(vehicle.driverId);
    if (!driver) return void 0;
    return { vehicle, driver };
  }
  async countStats() {
    const driversCount = this.drivers.size;
    const vehiclesCount = this.vehicles.size;
    const feedbacksCount = this.feedbacks.size;
    const issuesCount = Array.from(this.feedbacks.values()).filter(
      (feedback) => !feedback.resolved && ["complaint", "report"].includes(feedback.feedbackType)
    ).length;
    return {
      driversCount,
      vehiclesCount,
      feedbacksCount,
      issuesCount
    };
  }
};
var storage = new MemStorage();

// server/routes.ts
import * as bcrypt2 from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true
});
var drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertDriverSchema = createInsertSchema(drivers).pick({
  name: true,
  phoneNumber: true,
  licenseNumber: true,
  status: true,
  notes: true
});
var vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  plateNumber: text("plate_number").notNull().unique(),
  type: text("type").notNull(),
  driverId: integer("driver_id").notNull(),
  registrationDate: timestamp("registration_date").defaultNow()
});
var insertVehicleSchema = createInsertSchema(vehicles).pick({
  plateNumber: true,
  type: true,
  driverId: true,
  status: true
});
var feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  passengerName: text("passenger_name").notNull(),
  passengerEmail: text("passenger_email"),
  plateNumber: text("plate_number").notNull(),
  rating: integer("rating").notNull(),
  feedbackType: text("feedback_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  resolved: boolean("resolved").default(false)
});
var insertFeedbackSchema = createInsertSchema(feedbacks).pick({
  passengerName: true,
  passengerEmail: true,
  plateNumber: true,
  rating: true,
  feedbackType: true,
  message: true
});
var loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});
var verificationSchema = z.object({
  plateNumber: z.string().min(1, { message: "Plate number is required" })
});

// server/routes.ts
import { ZodError } from "zod";
import MemoryStore from "memorystore";
var MemoryStoreSession = MemoryStore(session);
var JWT_SECRET = process.env.JWT_SECRET || "park-management-system-secret";
async function registerRoutes(app2) {
  app2.use(
    session({
      secret: JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1e3 },
      // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 864e5
        // prune expired entries every 24h
      })
    })
  );
  const validateRequest = (schema) => {
    return (req, res, next) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors
          });
        }
        next(error);
      }
    };
  };
  const authMiddleware = async (req, res, next) => {
    try {
      const token = req.session.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await storage.getUser(decoded.id);
      if (!user || !user.isAdmin) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  };
  app2.post("/api/auth/login", validateRequest(loginSchema), async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const isPasswordValid = await bcrypt2.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
      req.session.token = token;
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout successful" });
    });
  });
  app2.get("/api/auth/me", authMiddleware, async (req, res) => {
    const user = req.user;
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  });
  app2.get("/api/drivers", authMiddleware, async (req, res) => {
    try {
      const drivers2 = await storage.getAllDrivers();
      return res.status(200).json(drivers2);
    } catch (error) {
      console.error("Get drivers error:", error);
      return res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });
  app2.post("/api/drivers", authMiddleware, validateRequest(insertDriverSchema), async (req, res) => {
    try {
      const driverData = req.body;
      const existingDriver = await storage.getDriverByLicenseNumber(driverData.licenseNumber);
      if (existingDriver) {
        return res.status(400).json({ message: "Driver with this license number already exists" });
      }
      const driver = await storage.createDriver(driverData);
      return res.status(201).json(driver);
    } catch (error) {
      console.error("Create driver error:", error);
      return res.status(500).json({ message: "Failed to create driver" });
    }
  });
  app2.put("/api/drivers/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const driverData = req.body;
      const existingDriver = await storage.getDriver(id);
      if (!existingDriver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      if (driverData.licenseNumber && driverData.licenseNumber !== existingDriver.licenseNumber) {
        const driverWithSameLicense = await storage.getDriverByLicenseNumber(driverData.licenseNumber);
        if (driverWithSameLicense) {
          return res.status(400).json({ message: "Driver with this license number already exists" });
        }
      }
      const updatedDriver = await storage.updateDriver(id, driverData);
      return res.status(200).json(updatedDriver);
    } catch (error) {
      console.error("Update driver error:", error);
      return res.status(500).json({ message: "Failed to update driver" });
    }
  });
  app2.get("/api/vehicles", authMiddleware, async (req, res) => {
    try {
      const vehicles2 = await storage.getAllVehicles();
      return res.status(200).json(vehicles2);
    } catch (error) {
      console.error("Get vehicles error:", error);
      return res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });
  app2.post("/api/vehicles", authMiddleware, validateRequest(insertVehicleSchema), async (req, res) => {
    try {
      const vehicleData = req.body;
      const existingVehicle = await storage.getVehicleByPlateNumber(vehicleData.plateNumber);
      if (existingVehicle) {
        return res.status(400).json({ message: "Vehicle with this plate number already exists" });
      }
      const driver = await storage.getDriver(vehicleData.driverId);
      if (!driver) {
        return res.status(400).json({ message: "Driver not found" });
      }
      const vehicle = await storage.createVehicle(vehicleData);
      return res.status(201).json(vehicle);
    } catch (error) {
      console.error("Create vehicle error:", error);
      return res.status(500).json({ message: "Failed to create vehicle" });
    }
  });
  app2.put("/api/vehicles/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicleData = req.body;
      const existingVehicle = await storage.getVehicle(id);
      if (!existingVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      if (vehicleData.plateNumber && vehicleData.plateNumber !== existingVehicle.plateNumber) {
        const vehicleWithSamePlate = await storage.getVehicleByPlateNumber(vehicleData.plateNumber);
        if (vehicleWithSamePlate) {
          return res.status(400).json({ message: "Vehicle with this plate number already exists" });
        }
      }
      if (vehicleData.driverId && vehicleData.driverId !== existingVehicle.driverId) {
        const driver = await storage.getDriver(vehicleData.driverId);
        if (!driver) {
          return res.status(400).json({ message: "Driver not found" });
        }
      }
      const updatedVehicle = await storage.updateVehicle(id, vehicleData);
      return res.status(200).json(updatedVehicle);
    } catch (error) {
      console.error("Update vehicle error:", error);
      return res.status(500).json({ message: "Failed to update vehicle" });
    }
  });
  app2.delete("/api/vehicles/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingVehicle = await storage.getVehicle(id);
      if (!existingVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      const deleted = await storage.deleteVehicle(id);
      if (deleted) {
        return res.status(200).json({ message: "Vehicle deleted successfully" });
      } else {
        return res.status(500).json({ message: "Failed to delete vehicle" });
      }
    } catch (error) {
      console.error("Delete vehicle error:", error);
      return res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });
  app2.get("/api/feedbacks", authMiddleware, async (req, res) => {
    try {
      const feedbacks2 = await storage.getAllFeedbacks();
      return res.status(200).json(feedbacks2);
    } catch (error) {
      console.error("Get feedbacks error:", error);
      return res.status(500).json({ message: "Failed to fetch feedbacks" });
    }
  });
  app2.post("/api/feedbacks", validateRequest(insertFeedbackSchema), async (req, res) => {
    try {
      const feedbackData = req.body;
      const vehicle = await storage.getVehicleByPlateNumber(feedbackData.plateNumber);
      if (!vehicle) {
        return res.status(400).json({
          message: `This plate number (${feedbackData.plateNumber}) does not belong to our park. Please verify the plate number or contact park management if you believe this is an error.`
        });
      }
      const feedback = await storage.createFeedback(feedbackData);
      await storage.logActivity({
        type: "feedback_created",
        title: "New Feedback Submitted",
        description: `Feedback submitted for vehicle ${feedbackData.plateNumber} by ${feedbackData.passengerName}`,
        entityType: "feedback",
        entityId: feedback.id
      });
      return res.status(201).json(feedback);
    } catch (error) {
      console.error("Create feedback error:", error);
      return res.status(500).json({ message: "Failed to create feedback" });
    }
  });
  app2.put("/api/feedbacks/:id/resolve", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { resolved } = req.body;
      const existingFeedback = await storage.getFeedback(id);
      if (!existingFeedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      const updatedFeedback = await storage.resolveFeedback(id, resolved);
      return res.status(200).json(updatedFeedback);
    } catch (error) {
      console.error("Resolve feedback error:", error);
      return res.status(500).json({ message: "Failed to resolve feedback" });
    }
  });
  app2.post("/api/verify", validateRequest(verificationSchema), async (req, res) => {
    try {
      const { plateNumber } = req.body;
      const result = await storage.getVehicleWithDriver(plateNumber);
      if (!result) {
        return res.status(404).json({
          verified: false,
          message: `This plate number (${plateNumber}) does not belong to our park. Please verify the plate number or contact park management if you believe this is an error.`
        });
      }
      const { vehicle, driver } = result;
      return res.status(200).json({
        verified: true,
        vehicle: {
          plateNumber: vehicle.plateNumber,
          type: vehicle.type,
          registrationDate: vehicle.registrationDate
        },
        driver: {
          name: driver.name,
          licenseNumber: driver.licenseNumber,
          status: driver.status
        }
      });
    } catch (error) {
      console.error("Verify vehicle error:", error);
      return res.status(500).json({ verified: false, message: "Failed to verify vehicle" });
    }
  });
  app2.get("/api/stats", authMiddleware, async (req, res) => {
    try {
      const stats = await storage.countStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      return res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.get("/api/activities", authMiddleware, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const activities = await storage.getRecentActivities(limit);
      return res.status(200).json(activities);
    } catch (error) {
      console.error("Get activities error:", error);
      return res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
