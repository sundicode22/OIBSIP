import { useMemo, useState } from "react";
import { ChefHat, Pizza as PizzaIcon, ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, ErrorState, LoadingCards } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { CheckoutModal, type CheckoutRequest } from "@/features/orders/components/CheckoutModal";
import { PizzaCard } from "../components/PizzaCard";
import { usePizzas } from "../hooks/usePizzas";

export function MenuPage() {
  const { data: pizzas, isLoading, isError, error, refetch } = usePizzas();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const selected = useMemo(
    () => (pizzas ?? []).filter((pizza) => selectedIds.includes(pizza.id)),
    [pizzas, selectedIds],
  );
  const total = selected.reduce((sum, pizza) => sum + pizza.price, 0);

  const toggle = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  const checkoutRequest: CheckoutRequest | null = selected.length
    ? {
        kind: "menu",
        pizzaIds: selected.map((pizza) => pizza.id),
        lines: selected.map((pizza) => ({ label: pizza.name, detail: pizza.description, price: pizza.price })),
        estimatedTotal: total,
      }
    : null;

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title="Menu"
        description="Pick one or more pizzas, then check out."
        actions={
          <Button variant="outline" asChild>
            <Link to="/build">
              <ChefHat />
              Build your own
            </Link>
          </Button>
        }
      />

      {isLoading && <LoadingCards count={8} />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {pizzas && pizzas.length === 0 && (
        <EmptyState
          icon={PizzaIcon}
          title="The menu is empty"
          description="An administrator hasn't added any pizzas yet."
        />
      )}
      {pizzas && pizzas.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {pizzas.map((pizza) => (
            <PizzaCard
              key={pizza.id}
              pizza={pizza}
              selected={selectedIds.includes(pizza.id)}
              onToggle={() => toggle(pizza.id)}
            />
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <Card className="fixed inset-x-4 bottom-4 z-20 mx-auto flex max-w-2xl items-center justify-between gap-4 p-4 shadow-lg">
          <div>
            <p className="font-medium">
              {selected.length} {selected.length === 1 ? "pizza" : "pizzas"} selected
            </p>
            <p className="text-sm text-muted-foreground">Total {formatPrice(total)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSelectedIds([])} aria-label="Clear selection">
              <X />
            </Button>
            <Button onClick={() => setCheckoutOpen(true)}>
              <ShoppingBag />
              Checkout
            </Button>
          </div>
        </Card>
      )}

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        request={checkoutRequest}
        onCompleted={() => setSelectedIds([])}
      />
    </div>
  );
}
