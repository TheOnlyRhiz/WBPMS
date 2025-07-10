import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";
import { loginSchema, insertDriverSchema, insertVehicleSchema, insertFeedbackSchema, verificationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { z } from "zod";
import MemoryStore from "memorystore";

// Create memory store
const MemoryStoreSession = MemoryStore(session);

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "park-management-system-secret";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      secret: JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Middleware to handle Zod validation errors
  const validateRequest = (schema: z.ZodType<any, any>) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        next(error);
      }
    };
  };

  // Auth middleware
  const authMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
      const token = (req.session as any).token;
      
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
      }
      
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const user = await storage.getUser(decoded.id);
      
      if (!user || !user.isAdmin) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }
      
      (req as any).user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  };

  // Auth routes
  app.post("/api/auth/login", validateRequest(loginSchema), async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
      (req.session as any).token = token;
      
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    const user = (req as any).user;
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  });

  // Driver routes
  app.get("/api/drivers", authMiddleware, async (req, res) => {
    try {
      const drivers = await storage.getAllDrivers();
      return res.status(200).json(drivers);
    } catch (error) {
      console.error("Get drivers error:", error);
      return res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });

  app.post("/api/drivers", authMiddleware, validateRequest(insertDriverSchema), async (req, res) => {
    try {
      const driverData = req.body;
      
      // Check if license number already exists
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

  app.put("/api/drivers/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const driverData = req.body;
      
      // Check if driver exists
      const existingDriver = await storage.getDriver(id);
      if (!existingDriver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      
      // If license number is being updated, check if it's unique
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

  // Driver deletion is not allowed per business requirements

  // Vehicle routes
  app.get("/api/vehicles", authMiddleware, async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      return res.status(200).json(vehicles);
    } catch (error) {
      console.error("Get vehicles error:", error);
      return res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.post("/api/vehicles", authMiddleware, validateRequest(insertVehicleSchema), async (req, res) => {
    try {
      const vehicleData = req.body;
      
      // Check if plate number already exists
      const existingVehicle = await storage.getVehicleByPlateNumber(vehicleData.plateNumber);
      if (existingVehicle) {
        return res.status(400).json({ message: "Vehicle with this plate number already exists" });
      }
      
      // Check if driver exists
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

  app.put("/api/vehicles/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicleData = req.body;
      
      // Check if vehicle exists
      const existingVehicle = await storage.getVehicle(id);
      if (!existingVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      // If plate number is being updated, check if it's unique
      if (vehicleData.plateNumber && vehicleData.plateNumber !== existingVehicle.plateNumber) {
        const vehicleWithSamePlate = await storage.getVehicleByPlateNumber(vehicleData.plateNumber);
        if (vehicleWithSamePlate) {
          return res.status(400).json({ message: "Vehicle with this plate number already exists" });
        }
      }
      
      // If driver ID is being updated, check if driver exists
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

  app.delete("/api/vehicles/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if vehicle exists
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

  // Feedback routes
  app.get("/api/feedbacks", authMiddleware, async (req, res) => {
    try {
      const feedbacks = await storage.getAllFeedbacks();
      return res.status(200).json(feedbacks);
    } catch (error) {
      console.error("Get feedbacks error:", error);
      return res.status(500).json({ message: "Failed to fetch feedbacks" });
    }
  });

  app.post("/api/feedbacks", validateRequest(insertFeedbackSchema), async (req, res) => {
    try {
      const feedbackData = req.body;
      
      // Check if vehicle exists in our park system
      const vehicle = await storage.getVehicleByPlateNumber(feedbackData.plateNumber);
      if (!vehicle) {
        return res.status(400).json({ 
          message: `This plate number (${feedbackData.plateNumber}) does not belong to our park. Please verify the plate number or contact park management if you believe this is an error.`
        });
      }
      
      const feedback = await storage.createFeedback(feedbackData);
      
      // Log activity
      await storage.logActivity({
        type: 'feedback_created',
        title: 'New Feedback Submitted',
        description: `Feedback submitted for vehicle ${feedbackData.plateNumber} by ${feedbackData.passengerName}`,
        entityType: 'feedback',
        entityId: feedback.id
      });
      
      return res.status(201).json(feedback);
    } catch (error) {
      console.error("Create feedback error:", error);
      return res.status(500).json({ message: "Failed to create feedback" });
    }
  });

  app.put("/api/feedbacks/:id/resolve", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { resolved } = req.body;
      
      // Check if feedback exists
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

  // Verification route
  app.post("/api/verify", validateRequest(verificationSchema), async (req, res) => {
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
          registrationDate: vehicle.registrationDate,
        },
        driver: {
          name: driver.name,
          licenseNumber: driver.licenseNumber,
          status: driver.status,
        },
      });
    } catch (error) {
      console.error("Verify vehicle error:", error);
      return res.status(500).json({ verified: false, message: "Failed to verify vehicle" });
    }
  });

  // Stats route
  app.get("/api/stats", authMiddleware, async (req, res) => {
    try {
      const stats = await storage.countStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      return res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/activities", authMiddleware, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await storage.getRecentActivities(limit);
      return res.status(200).json(activities);
    } catch (error) {
      console.error("Get activities error:", error);
      return res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
