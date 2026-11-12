import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Tags } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormAlert } from "@/components/shared/FormAlert";
import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { applyServerErrors } from "@/lib/api";
import { useCreateIngredientType } from "../hooks/useIngredients";

const typeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Type name is required")
    .min(2, "Type name must be at least 2 characters")
    .max(40, "Keep the name under 40 characters"),
});

type TypeFormData = z.infer<typeof typeSchema>;

const FORM_ID = "ingredient-type-form";

export function IngredientTypeFormModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const createType = useCreateIngredientType();
  const form = useForm<TypeFormData>({ resolver: zodResolver(typeSchema), defaultValues: { name: "" } });

  useEffect(() => {
    if (open) {
      form.reset({ name: "" });
      setServerError(null);
    }
  }, [open, form]);

  const onSubmit = (values: TypeFormData) => {
    setServerError(null);
    createType.mutate(values, {
      onSuccess: () => onOpenChange(false),
      onError: (error) => setServerError(applyServerErrors(form, error)),
    });
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="New ingredient type"
      description="Group ingredients into categories such as Base, Sauce, Cheese or Vegetable."
      icon={Tags}
      containerClassName="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={createType.isPending}>
            <Plus />
            {createType.isPending ? "Creating..." : "Create type"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <FormAlert message={serverError} title="Could not create the type" />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type name</FormLabel>
                <FormControl>
                  <Input placeholder="Vegetable" {...field} />
                </FormControl>
                <FormDescription>
                  Names containing “base”, “sauce”, “cheese” or “veg” appear in the pizza builder.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormModal>
  );
}
