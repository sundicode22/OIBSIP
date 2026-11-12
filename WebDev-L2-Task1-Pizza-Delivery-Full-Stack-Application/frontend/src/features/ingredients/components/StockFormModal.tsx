import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormAlert } from "@/components/shared/FormAlert";
import { FormModal } from "@/components/shared/FormModal";
import { StockBadge } from "@/components/shared/StatusBadge";
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
import type { Ingredient } from "@/types/domain";
import { useUpdateInventoryStock } from "@/features/admin/hooks/useAdmin";
import { useUpdateIngredientStock } from "../hooks/useIngredients";

const stockSchema = z.object({
  stock: z
    .string()
    .trim()
    .min(1, "Stock is required")
    .regex(/^\d+$/, "Stock must be a whole number of 0 or more")
    .refine((value) => Number(value) <= 100_000, "Stock cannot exceed 100,000"),
});

type StockFormData = z.infer<typeof stockSchema>;

const FORM_ID = "stock-form";

interface StockFormModalProps {
  ingredient: Ingredient | null;
  onClose: () => void;
  /** Which API to save through: the admin inventory endpoint or the ingredients endpoint. */
  source: "inventory" | "ingredients";
  threshold?: number;
}

export function StockFormModal({ ingredient, onClose, source, threshold }: StockFormModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const inventoryUpdate = useUpdateInventoryStock();
  const ingredientUpdate = useUpdateIngredientStock();
  const mutation = source === "inventory" ? inventoryUpdate : ingredientUpdate;

  const form = useForm<StockFormData>({
    resolver: zodResolver(stockSchema),
    defaultValues: { stock: "" },
  });

  useEffect(() => {
    if (ingredient) {
      form.reset({ stock: String(ingredient.stock) });
      setServerError(null);
    }
  }, [ingredient, form]);

  const onSubmit = ({ stock }: StockFormData) => {
    if (!ingredient) return;
    setServerError(null);
    mutation.mutate(
      { id: ingredient.id, stock: Number(stock) },
      {
        onSuccess: onClose,
        onError: (error) => setServerError(applyServerErrors(form, error)),
      },
    );
  };

  return (
    <FormModal
      open={Boolean(ingredient)}
      onOpenChange={(open) => !open && onClose()}
      title={ingredient ? `Update stock · ${ingredient.name}` : "Update stock"}
      description="Set the number of units currently available in the kitchen."
      icon={PackagePlus}
      containerClassName="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={mutation.isPending}>
            <Save />
            {mutation.isPending ? "Saving..." : "Save stock"}
          </Button>
        </>
      }
    >
      {ingredient && (
        <Form {...form}>
          <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <FormAlert message={serverError} title="Could not update stock" />

            <div className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{ingredient.name}</p>
                <p className="text-muted-foreground">{ingredient.type?.name ?? "Ingredient"}</p>
              </div>
              <StockBadge stock={ingredient.stock} threshold={threshold} />
            </div>

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Units in stock</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" min={0} step={1} {...field} />
                  </FormControl>
                  <FormDescription>
                    Each order uses one unit of every ingredient on the pizza.
                    {threshold !== undefined && ` Items below ${threshold} trigger a low-stock alert.`}
                  </FormDescription>
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
