import { z } from "zod";

// Email validation (reusable)
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase()
  .trim();

// Slug validation
export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

// CUID validation (used for IDs)
export const cuidSchema = z.string().cuid();

// Date schema
export const dateSchema = z.coerce.date();
