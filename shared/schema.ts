import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Driver schema
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDriverSchema = createInsertSchema(drivers).pick({
  name: true,
  phoneNumber: true,
  licenseNumber: true,
  status: true,
  notes: true,
});

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

// Vehicle schema
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  plateNumber: text("plate_number").notNull().unique(),
  type: text("type").notNull(),
  driverId: integer("driver_id").notNull(),
  registrationDate: timestamp("registration_date").defaultNow(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).pick({
  plateNumber: true,
  type: true,
  driverId: true,
  status: true,
});

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

// Feedback schema
export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  passengerName: text("passenger_name").notNull(),
  passengerEmail: text("passenger_email"),
  plateNumber: text("plate_number").notNull(),
  rating: integer("rating").notNull(),
  feedbackType: text("feedback_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  resolved: boolean("resolved").default(false),
});

export const insertFeedbackSchema = createInsertSchema(feedbacks).pick({
  passengerName: true,
  passengerEmail: true,
  plateNumber: true,
  rating: true,
  feedbackType: true,
  message: true,
});

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbacks.$inferSelect;

// Login schema validation
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

// Verification schema
export const verificationSchema = z.object({
  plateNumber: z.string().min(1, { message: "Plate number is required" }),
});

export type VerificationData = z.infer<typeof verificationSchema>;
