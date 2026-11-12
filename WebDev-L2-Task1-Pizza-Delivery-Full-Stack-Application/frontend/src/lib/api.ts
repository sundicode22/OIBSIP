import axios from "axios";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: ApiFieldError[];
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Cannot reach the server. Make sure the API is running.";
    }
    const body = error.response.data as Partial<ApiResponse<unknown>> | undefined;
    return body?.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

/**
 * Puts backend validation errors (`errors: [{ field, message }]`) on the matching
 * form fields and returns the top-level message for a form-level alert.
 */
export function applyServerErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: unknown,
): string {
  const message = getErrorMessage(error);
  if (!axios.isAxiosError(error)) return message;

  const fieldErrors = (error.response?.data as Partial<ApiResponse<unknown>> | undefined)?.errors;
  if (!Array.isArray(fieldErrors)) return message;

  const values = form.getValues() as Record<string, unknown>;
  for (const { field, message: fieldMessage } of fieldErrors) {
    const candidates = [field, field.split(".").pop() ?? field];
    const name = candidates.find((candidate) => candidate in values);
    if (name) {
      form.setError(name as Path<T>, { type: "server", message: fieldMessage });
    }
  }
  return message;
}
