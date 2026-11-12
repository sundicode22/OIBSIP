import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Carrot, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/api";
import type { IngredientType } from "@/types/domain";
import { useCreateIngredient } from "../hooks/useIngredients";

const ingredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Keep the name under 60 characters"),
  typeId: z.string().min(1, "Choose an ingredient type"),
  stock: z
    .string()
    .trim()
    .min(1, "Starting stock is required")
    .regex(/^\d+$/, "Stock must be a whole number of 0 or more"),
  description: z.string().trim().max(200, "Keep the description under 200 characters"),
  imageUrl: z
    .string()
    .trim()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: "Enter a full URL starting with http:// or https://",
    }),
});

type IngredientFormData = z.infer<typeof ingredientSchema>;

const FORM_ID = "ingredient-form";
const emptyValues: IngredientFormData = { name: "", typeId: "", stock: "", description: "", imageUrl: "" };

interface IngredientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  types: IngredientType[];
}

export function IngredientFormModal({ open, onOpenChange, types }: IngredientFormModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const createIngredient = useCreateIngredient();
  const form = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(emptyValues);
      setServerError(null);
    }
  }, [open, form]);

  const onSubmit = ({ stock, imageUrl, ...values }: IngredientFormData) => {
    setServerError(null);
    createIngredient.mutate(
      { ...values, stock: Number(stock), ...(imageUrl ? { imageUrl } : {}) },
      {
        onSuccess: () => onOpenChange(false),
        onError: (error) => setServerError(applyServerErrors(form, error)),
      },
    );
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="New ingredient"
      description="Add an ingredient customers can pick in the builder and admins can use on menu pizzas."
      icon={Carrot}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={createIngredient.isPending}>
            <Plus />
            {createIngredient.isPending ? "Creating..." : "Create ingredient"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <FormAlert message={serverError} title="Could not create the ingredient" />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Mushroom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={types.length ? "Choose a type" : "Create a type first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting stock</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" min={0} step={1} placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://…" {...field} />
                  </FormControl>
                  <FormDescription>Optional.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Fresh button mushrooms" {...field} />
                  </FormControl>
                  <FormDescription>Shown to customers in the pizza builder.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </FormModal>
  );
}
