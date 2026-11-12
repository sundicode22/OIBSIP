import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  footer?: ReactNode;
  /** Width of the inner container that holds the form. */
  containerClassName?: string;
}

/** Large modal (80% of the viewport on desktop) with a card container for forms. */
export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  children,
  footer,
  containerClassName,
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[92vh] w-[95vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:rounded-xl md:h-[80vh] md:w-[80vw]">
        <DialogHeader className="shrink-0 space-y-1 bg-card px-6 py-5 text-left">
          <div className="flex items-center gap-3 pr-8">
            {Icon && (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
            )}
            <div className="space-y-1">
              <DialogTitle className="text-xl">{title}</DialogTitle>
              {description ? (
                <DialogDescription>{description}</DialogDescription>
              ) : (
                <DialogDescription className="sr-only">{title}</DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-6">
          <div
            className={cn(
              "mx-auto w-full max-w-3xl rounded-xl bg-card p-5 shadow-[0_1px_3px_rgba(16,24,40,0.06),0_4px_12px_-4px_rgba(16,24,40,0.08)] sm:p-6",
              containerClassName,
            )}
          >
            {children}
          </div>
        </div>

        {footer && (
          <DialogFooter className="shrink-0 gap-2 bg-card px-6 py-4 sm:space-x-0">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
