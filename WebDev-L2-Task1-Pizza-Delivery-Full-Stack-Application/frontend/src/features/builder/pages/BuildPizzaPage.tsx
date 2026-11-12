import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState, LoadingRows } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/types/domain";
import { useIngredients } from "@/features/ingredients/hooks/useIngredients";
import { CheckoutModal, type CheckoutRequest } from "@/features/orders/components/CheckoutModal";

const BASE_PRICE = 250;
const VEGETABLE_PRICE = 30;
const MAX_VEGETABLES = 6;

const builderSchema = z.object({
  baseId: z.string().min(1, "Choose a pizza base"),
  sauceId: z.string().min(1, "Choose a sauce"),
  cheeseId: z.string().min(1, "Choose a cheese"),
  vegetableIds: z.array(z.string()).max(MAX_VEGETABLES, `Choose up to ${MAX_VEGETABLES} vegetables`),
});

type BuilderFormData = z.infer<typeof builderSchema>;

function pickGroup(grouped: Record<string, Ingredient[]> | undefined, keyword: string) {
  if (!grouped) return [];
  return Object.entries(grouped)
    .filter(([name]) => name.includes(keyword))
    .flatMap(([, items]) => items);
}

function OptionGrid({
  options,
  value,
  onChange,
}: {
  options: Ingredient[];
  value: string;
  onChange: (value: string) => void;
}) {
  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">No options available yet.</p>;
  }
  return (
    <RadioGroup value={value} onValueChange={onChange} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {options.map((option) => {
        const disabled = option.stock < 1;
        return (
          <FormItem key={option.id} className="space-y-0">
            <FormLabel
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg bg-muted/60 p-4 font-normal transition-colors hover:bg-accent",
                value === option.id && "bg-primary/10 ring-2 ring-inset ring-primary",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <FormControl>
                <RadioGroupItem value={option.id} disabled={disabled} className="mt-0.5" />
              </FormControl>
              <span className="space-y-1">
                <span className="block font-medium">{option.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {disabled ? "Out of stock" : option.description}
                </span>
              </span>
            </FormLabel>
          </FormItem>
        );
      })}
    </RadioGroup>
  );
}

export function BuildPizzaPage() {
  const { data, isLoading, isError, error, refetch } = useIngredients();
  const [checkout, setCheckout] = useState<CheckoutRequest | null>(null);

  const form = useForm<BuilderFormData>({
    resolver: zodResolver(builderSchema),
    defaultValues: { baseId: "", sauceId: "", cheeseId: "", vegetableIds: [] },
  });

  const bases = pickGroup(data?.grouped, "base");
  const sauces = pickGroup(data?.grouped, "sauce");
  const cheeses = pickGroup(data?.grouped, "cheese");
  const vegetables = pickGroup(data?.grouped, "veg");
  const byId = new Map((data?.all ?? []).map((item) => [item.id, item]));

  const values = useWatch({ control: form.control });
  const vegetableCount = values.vegetableIds?.length ?? 0;
  const total = BASE_PRICE + vegetableCount * VEGETABLE_PRICE;

  const onSubmit = (formValues: BuilderFormData) => {
    const name = (id: string) => byId.get(id)?.name ?? "—";
    const veggieNames = formValues.vegetableIds.map(name);
    setCheckout({
      kind: "custom",
      customPizza: formValues,
      estimatedTotal: total,
      lines: [
        {
          label: "Custom pizza",
          detail: `${name(formValues.baseId)} · ${name(formValues.sauceId)} · ${name(formValues.cheeseId)}`,
          price: BASE_PRICE,
        },
        ...(veggieNames.length
          ? [
              {
                label: `Vegetables (${veggieNames.length})`,
                detail: veggieNames.join(", "),
                price: veggieNames.length * VEGETABLE_PRICE,
              },
            ]
          : []),
      ],
    });
  };

  const sections = [
    { name: "baseId" as const, title: "1. Base", description: "Pick your crust.", options: bases },
    { name: "sauceId" as const, title: "2. Sauce", description: "Choose a sauce.", options: sauces },
    { name: "cheeseId" as const, title: "3. Cheese", description: "Choose a cheese.", options: cheeses },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Build your own pizza"
        description={`Starts at ${formatPrice(BASE_PRICE)} · ${formatPrice(VEGETABLE_PRICE)} per vegetable`}
      />

      {isLoading && <LoadingRows rows={6} />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 lg:grid-cols-[1fr_320px]"
            noValidate
          >
            <div className="space-y-6">
              {sections.map((section) => (
                <Card key={section.name}>
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name={section.name}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <OptionGrid options={section.options} value={field.value} onChange={field.onChange} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">4. Vegetables</CardTitle>
                  <CardDescription>Optional – up to {MAX_VEGETABLES}.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="vegetableIds"
                    render={() => (
                      <FormItem className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {vegetables.map((vegetable) => (
                            <FormField
                              key={vegetable.id}
                              control={form.control}
                              name="vegetableIds"
                              render={({ field }) => {
                                const checked = field.value.includes(vegetable.id);
                                const disabled = vegetable.stock < 1;
                                return (
                                  <FormItem className="space-y-0">
                                    <FormLabel
                                      className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-lg bg-muted/60 p-4 font-normal transition-colors hover:bg-accent",
                                        checked && "bg-primary/10 ring-2 ring-inset ring-primary",
                                        disabled && "cursor-not-allowed opacity-50",
                                      )}
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={checked}
                                          disabled={disabled}
                                          onCheckedChange={(isChecked) =>
                                            field.onChange(
                                              isChecked
                                                ? [...field.value, vegetable.id]
                                                : field.value.filter((id) => id !== vegetable.id),
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <span className="font-medium">{vegetable.name}</span>
                                      {disabled && (
                                        <Badge variant="destructive" className="ml-auto">
                                          Out
                                        </Badge>
                                      )}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="h-fit lg:sticky lg:top-20">
              <CardHeader>
                <CardTitle className="text-lg">Your pizza</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {[
                  ["Base", values.baseId],
                  ["Sauce", values.sauceId],
                  ["Cheese", values.cheeseId],
                ].map(([label, id]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-right font-medium">{(id && byId.get(id)?.name) || "—"}</span>
                  </div>
                ))}
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Vegetables</span>
                  <span className="text-right font-medium">
                    {vegetableCount
                      ? values.vegetableIds?.map((id) => byId.get(id)?.name).join(", ")
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-semibold text-primary">{formatPrice(total)}</span>
                </div>
                <Button type="submit" className="w-full">
                  <ShoppingBag />
                  Continue to checkout
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      )}

      <CheckoutModal
        open={Boolean(checkout)}
        onOpenChange={(open) => !open && setCheckout(null)}
        request={checkout}
        onCompleted={() => form.reset()}
      />
    </div>
  );
}
