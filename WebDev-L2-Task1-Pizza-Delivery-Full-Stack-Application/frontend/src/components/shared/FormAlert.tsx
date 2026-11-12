import { CircleAlert, CircleCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormAlertProps {
  message?: string | null;
  title?: string;
  variant?: "error" | "success";
}

export function FormAlert({ message, title, variant = "error" }: FormAlertProps) {
  if (!message) return null;

  if (variant === "success") {
    return (
      <Alert className="bg-primary/10 text-primary [&>svg]:text-primary">
        <CircleCheck className="size-4" />
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="bg-destructive/5">
      <CircleAlert className="size-4" />
      <AlertTitle>{title ?? "Something went wrong"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
