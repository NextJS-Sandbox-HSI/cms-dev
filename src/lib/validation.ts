import { z } from "zod";

/**
 * Validates data against a Zod schema and returns formatted errors
 */
export function validateData<T>(
  schema: z.Schema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format errors for easy consumption
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  });

  return { success: false, errors };
}

/**
 * Extract FormData into a plain object
 */
export function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    // Handle checkboxes and multiple values
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        (obj[key] as unknown[]).push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  });

  return obj;
}
