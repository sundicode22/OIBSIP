import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, type UserFormData } from "../schemas/user.schema";
import type { User } from "../types/user.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Label,
} from "@/components/ui";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: (data: UserFormData) => void;
  isSubmitting?: boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isSubmitting = false,
}: UserFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    values: user
      ? {
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          website: user.website,
          companyName: user.company?.name || "",
          city: user.address?.city || "",
          street: user.address?.street || "",
          zipcode: user.address?.zipcode || "",
        }
      : {
          name: "",
          username: "",
          email: "",
          phone: "",
          website: "",
          companyName: "",
          city: "",
          street: "",
          zipcode: "",
        },
  });

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 70% width & height modal dialog */}
      <DialogContent size="large">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <UserIcon className="h-6 w-6" />
            <span>{user ? "Modify User Information" : "Create New User Profile"}</span>
          </div>
          <DialogTitle>{user ? `Edit: ${user.name}` : "User Onboarding Form"}</DialogTitle>
          <DialogDescription>
            All fields are rigorously validated via Zod & React Hook Form
          </DialogDescription>
        </DialogHeader>

        <form
          id="user-dialog-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
          noValidate
        >
          <DialogBody className="space-y-6">
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">
                Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Leanne Graham"
                      {...register("name")}
                      className={`pl-9 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="username">Username Handle</Label>
                  <Input
                    id="username"
                    placeholder="Bret"
                    {...register("username")}
                    className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.username && (
                    <p className="text-xs text-destructive font-medium">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Sincere@april.biz"
                      {...register("email")}
                      className={`pl-9 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="1-770-736-8031 x56442"
                      {...register("phone")}
                      className={`pl-9 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Organization & Web */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">
                Organization & Domain
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company / Organization</Label>
                  <div className="relative">
                    <BuildingOfficeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      placeholder="Romaguera-Crona"
                      {...register("companyName")}
                      className={`pl-9 ${errors.companyName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-xs text-destructive font-medium">{errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="website">Website URL</Label>
                  <div className="relative">
                    <GlobeAltIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      placeholder="hildegard.org"
                      {...register("website")}
                      className={`pl-9 ${errors.website ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>
                  {errors.website && (
                    <p className="text-xs text-destructive font-medium">{errors.website.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Address / Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">
                Geographic Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="street">Street Address</Label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="street"
                      placeholder="Kulas Light"
                      {...register("street")}
                      className={`pl-9 ${errors.street ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>
                  {errors.street && (
                    <p className="text-xs text-destructive font-medium">{errors.street.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Gwenborough"
                    {...register("city")}
                    className={errors.city ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive font-medium">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="zipcode">Zipcode</Label>
                  <Input
                    id="zipcode"
                    placeholder="92998-3874"
                    {...register("zipcode")}
                    className={errors.zipcode ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.zipcode && (
                    <p className="text-xs text-destructive font-medium">{errors.zipcode.message}</p>
                  )}
                </div>
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <CheckIcon className="h-4 w-4" />
              {isSubmitting ? "Saving..." : user ? "Update Record" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
