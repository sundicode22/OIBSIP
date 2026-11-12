import { useState } from "react";
import { AlertTriangle, Boxes, PackageCheck, PackageX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState, LoadingRows } from "@/components/shared/QueryState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Ingredient } from "@/types/domain";
import { IngredientsTable } from "@/features/ingredients/components/IngredientsTable";
import { StockFormModal } from "@/features/ingredients/components/StockFormModal";
import { useInventory } from "../hooks/useAdmin";

const CATEGORY_LABELS = {
  bases: "Bases",
  sauces: "Sauces",
  cheeses: "Cheeses",
  vegetables: "Vegetables",
  other: "Other",
} as const;

function StatCard({ title, value, icon: Icon, tone }: { title: string; value: number; icon: LucideIcon; tone: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`flex size-9 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function InventoryPage() {
  const { data, isLoading, isError, error, refetch } = useInventory();
  const [editing, setEditing] = useState<Ingredient | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Stock levels for every ingredient, lowest first." />

      {isLoading && <LoadingRows rows={6} />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="Tracked ingredients" value={data.totalItems} icon={Boxes} tone="bg-primary/10 text-primary" />
            <StatCard
              title={`Below ${data.threshold} units`}
              value={data.lowStockCount}
              icon={AlertTriangle}
              tone="bg-amber-100 text-amber-700"
            />
            <StatCard
              title="Out of stock"
              value={data.items.filter((item) => item.stock <= 0).length}
              icon={PackageX}
              tone="bg-red-100 text-red-700"
            />
          </div>

          {data.lowStockCount > 0 ? (
            <Alert className="bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
              <AlertTriangle className="size-4" />
              <AlertTitle>Restock needed</AlertTitle>
              <AlertDescription>
                {data.lowStockItems.map((item) => `${item.name} (${item.stock})`).join(", ")}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-primary/10 text-primary [&>svg]:text-primary">
              <PackageCheck className="size-4" />
              <AlertTitle>All stocked up</AlertTitle>
              <AlertDescription>Every ingredient is above the low-stock threshold.</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="h-auto flex-wrap justify-start">
              <TabsTrigger value="all">All ({data.items.length})</TabsTrigger>
              {(Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[])
                .filter((key) => key !== "other" || data.categories.other.length > 0)
                .map((key) => (
                  <TabsTrigger key={key} value={key}>
                    {CATEGORY_LABELS[key]} ({data.categories[key].length})
                  </TabsTrigger>
                ))}
            </TabsList>
            <TabsContent value="all">
              <IngredientsTable items={data.items} threshold={data.threshold} onEditStock={setEditing} />
            </TabsContent>
            {(Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map((key) => (
              <TabsContent key={key} value={key}>
                <IngredientsTable
                  items={data.categories[key]}
                  threshold={data.threshold}
                  onEditStock={setEditing}
                />
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}

      <StockFormModal
        ingredient={editing}
        onClose={() => setEditing(null)}
        source="inventory"
        threshold={data?.threshold}
      />
    </div>
  );
}
