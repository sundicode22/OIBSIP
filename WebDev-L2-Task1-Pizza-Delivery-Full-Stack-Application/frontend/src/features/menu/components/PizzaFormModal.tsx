import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pizza as PizzaIcon, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormAlert } from "@/components/shared/FormAlert";
import { FormModal } from "@/components/shared/FormModal";
import { ErrorState, LoadingRows } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/types/domain";
import { useIngredients } from "@/features/ingredients/hooks/useIngredients";
import { usePizza, useSavePizza } from "../hooks/usePizzas";

const pizzaSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Keep the name under 60 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(5, "Description must be at least 5 characters")
    .max(300, "Keep the description under 300 characters"),
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a price like 299 or 299.50")
    .refine((value) => Number(value) > 0, "Price must be greater than 0"),
  imageUrl: z
    .string()
    .trim()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: "Enter a full URL starting with http:// or https://",
    }),
  ingredientIds: z.array(z.string()).min(1, "Pick at least one ingredient"),
});

type PizzaFormData = z.infer<typeof pizzaSchema>;

const FORM_ID = "pizza-form";
const emptyValues: PizzaFormData = { name: "", description: "", price: "", imageUrl: "", ingredientIds: [] };

interface PizzaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pizza to edit; omit to create a new one. */
  pizzaId?: string | null;
}

export function PizzaFormModal({ open, onOpenChange, pizzaId }: PizzaFormModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const savePizza = useSavePizza();
  const ingredients = useIngredients();
  const pizza = usePizza(open && pizzaId ? pizzaId : null);
  const isEdit = Boolean(pizzaId);

  const form = useForm<PizzaFormData>({ resolver: zodResolver(pizzaSchema), defaultValues: emptyValues });

  useEffect(() => {
    if (!open) return;
    setServerError(null);
    if (!isEdit) {
      form.reset(emptyValues);
    } else if (pizza.data) {
      form.reset({
        name: pizza.data.name,
        description: pizza.data.description,
        price: String(pizza.data.price),
        imageUrl: pizza.data.imageUrl ?? "",
        ingredientIds: pizza.data.ingredients?.map((ingredient) => ingredient.id) ?? pizza.data.ingredientIds,
      });
    }
  }, [open, isEdit, pizza.data, form]);

  const groups = useMemo(() => {
    const byType = new Map<string, Ingredient[]>();
    for (const item of ingredients.data?.all ?? []) {
      const key = item.type?.name ?? "Other";
      byType.set(key, [...(byType.get(key) ?? []), item]);
    }
    return [...byType.entries()];
  }, [ingredients.data]);

  const onSubmit = ({ price, imageUrl, ...values }: PizzaFormData) => {
    setServerError(null);
    savePizza.mutate(
      {
        id: pizzaId ?? undefined,
        payload: { ...values, price: Number(price), ...(imageUrl ? { imageUrl } : {}) },
      },
      {
        onSuccess: () => onOpenChange(false),
        onError: (error) => setServerError(applyServerErrors(form, error)),
      },
    );
  };

  const loading = ingredients.isLoading || (isEdit && pizza.isLoading);
  const loadError = ingredients.error ?? pizza.error;

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit pizza" : "New menu pizza"}
      description="Customers see the name, description and price on the menu."
      icon={PizzaIcon}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={savePizza.isPending || loading}>
            <Save />
            {savePizza.isPending ? "Saving..." : isEdit ? "Save changes" : "Create pizza"}
          </Button>
        </>
      }
    >
      {loading && <LoadingRows rows={5} />}
      {!loading && loadError && <ErrorState error={loadError} />}
      {!loading && !loadError && (
        <Form {...form}>
          <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <FormAlert message={serverError} title="Could not save the pizza" />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Margherita" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" inputMode="decimal" min={0} step="0.01" placeholder="299" {...field} />
                    </FormControl>
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
                      <Textarea rows={3} placeholder="Tomato, mozzarella and fresh basil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://…" {...field} />
                    </FormControl>
                    <FormDescription>Optional. A placeholder is shown when empty.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ingredientIds"
              render={() => (
                <FormItem className="space-y-4">
                  <div>
                    <FormLabel>Ingredients</FormLabel>
                    <FormDescription>Each order uses one unit of every selected ingredient.</FormDescription>
                  </div>
                  {groups.map(([typeName, items]) => (
                    <div key={typeName} className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{typeName}</p>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="ingredientIds"
                            render={({ field }) => {
                              const checked = field.value.includes(item.id);
                              return (
                                <FormItem className="space-y-0">
                                  <FormLabel
                                    className={cn(
                                      "flex cursor-pointer items-center gap-3 rounded-md bg-muted/60 px-3 py-2.5 font-normal transition-colors hover:bg-accent",
                                      checked && "bg-primary/10 ring-2 ring-inset ring-primary",
                                    )}
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={checked}
                                        onCheckedChange={(isChecked) =>
                                          field.onChange(
                                            isChecked
                                              ? [...field.value, item.id]
                                              : field.value.filter((id) => id !== item.id),
                                          )
                                        }
                                      />
                                    </FormControl>
                                    {item.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </FormModal>
  );
}
