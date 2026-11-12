import type { ReactNode } from "react";
import { Pizza } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-4 sm:p-8">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Pizza className="size-5" />
        </div>
        <span className="text-lg">Pizza Inc.</span>
      </Link>

      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer && (
          <CardFooter className="justify-center pt-2 text-sm text-muted-foreground">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
