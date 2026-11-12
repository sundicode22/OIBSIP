import { PackagePlus } from "lucide-react";
import { StockBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Ingredient } from "@/types/domain";

interface IngredientsTableProps {
  items: Ingredient[];
  threshold?: number;
  onEditStock: (ingredient: Ingredient) => void;
}

export function IngredientsTable({ items, threshold, onEditStock }: IngredientsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-[0_1px_3px_rgba(16,24,40,0.06),0_4px_12px_-4px_rgba(16,24,40,0.08)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Ingredient</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                Nothing in this category yet.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.type?.name ?? "—"}</TableCell>
                <TableCell className="hidden max-w-[320px] truncate text-muted-foreground md:table-cell">
                  {item.description || "—"}
                </TableCell>
                <TableCell>
                  <StockBadge stock={item.stock} threshold={threshold} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => onEditStock(item)}>
                    <PackagePlus />
                    Update stock
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
