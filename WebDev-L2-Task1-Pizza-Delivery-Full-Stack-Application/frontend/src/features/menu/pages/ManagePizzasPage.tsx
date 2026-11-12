import { useState } from "react";
import { Pencil, Pizza as PizzaIcon, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, ErrorState, LoadingRows } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getErrorMessage } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { Pizza } from "@/types/domain";
import { toast } from "sonner";
import { PizzaFormModal } from "../components/PizzaFormModal";
import { useDeletePizza, usePizzas } from "../hooks/usePizzas";

export function ManagePizzasPage() {
  const { data: pizzas, isLoading, isError, error, refetch } = usePizzas();
  const deletePizza = useDeletePizza();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Pizza | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (pizza: Pizza) => {
    setEditingId(pizza.id);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deletePizza.mutate(deleting.id, {
      onSuccess: () => setDeleting(null),
      onError: (err) => toast.error(getErrorMessage(err, "Could not delete the pizza")),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Menu pizzas"
        description="Create, edit and remove the pizzas customers can order."
        actions={
          <Button onClick={openCreate}>
            <Plus />
            New pizza
          </Button>
        }
      />

      {isLoading && <LoadingRows />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {pizzas && pizzas.length === 0 && (
        <EmptyState
          icon={PizzaIcon}
          title="No pizzas on the menu"
          description="Add the first one to start taking orders."
          action={
            <Button onClick={openCreate}>
              <Plus />
              New pizza
            </Button>
          }
        />
      )}
      {pizzas && pizzas.length > 0 && (
        <div className="overflow-hidden rounded-xl bg-card shadow-[0_1px_3px_rgba(16,24,40,0.06),0_4px_12px_-4px_rgba(16,24,40,0.08)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Pizza</TableHead>
                <TableHead className="hidden lg:table-cell">Ingredients</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pizzas.map((pizza) => (
                <TableRow key={pizza.id}>
                  <TableCell>
                    <div className="font-medium">{pizza.name}</div>
                    <div className="max-w-[360px] truncate text-xs text-muted-foreground">{pizza.description}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex max-w-[420px] flex-wrap gap-1">
                      {pizza.ingredients?.map((ingredient) => (
                        <Badge key={ingredient.id} variant="secondary" className="font-normal">
                          {ingredient.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(pizza.price)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(pizza)}>
                        <Pencil />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleting(pizza)}
                      >
                        <Trash2 />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PizzaFormModal open={formOpen} onOpenChange={setFormOpen} pizzaId={editingId} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "pizza"}?`}
        description="It will be removed from the menu. Past orders keep their history."
        isPending={deletePizza.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
