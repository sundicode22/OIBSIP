import { useState } from "react";
import { Plus, Tags } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState, LoadingRows } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Ingredient } from "@/types/domain";
import { IngredientFormModal } from "../components/IngredientFormModal";
import { IngredientsTable } from "../components/IngredientsTable";
import { IngredientTypeFormModal } from "../components/IngredientTypeFormModal";
import { StockFormModal } from "../components/StockFormModal";
import { useIngredients, useIngredientTypes } from "../hooks/useIngredients";

export function IngredientsPage() {
  const ingredients = useIngredients();
  const types = useIngredientTypes();
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);

  const all = ingredients.data?.all ?? [];
  const typeList = types.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ingredients"
        description="The catalogue of bases, sauces, cheeses and toppings."
        actions={
          <>
            <Button variant="outline" onClick={() => setTypeModalOpen(true)}>
              <Tags />
              New type
            </Button>
            <Button onClick={() => setIngredientModalOpen(true)} disabled={!types.data}>
              <Plus />
              New ingredient
            </Button>
          </>
        }
      />

      {(ingredients.isLoading || types.isLoading) && <LoadingRows rows={6} />}
      {ingredients.isError && <ErrorState error={ingredients.error} onRetry={() => ingredients.refetch()} />}
      {types.isError && <ErrorState error={types.error} onRetry={() => types.refetch()} />}

      {ingredients.data && types.data && (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="all">All ({all.length})</TabsTrigger>
            {typeList.map((type) => (
              <TabsTrigger key={type.id} value={type.id}>
                {type.name} ({all.filter((item) => item.typeId === type.id).length})
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <IngredientsTable items={all} onEditStock={setEditing} />
          </TabsContent>
          {typeList.map((type) => (
            <TabsContent key={type.id} value={type.id}>
              <IngredientsTable
                items={all.filter((item) => item.typeId === type.id)}
                onEditStock={setEditing}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <IngredientTypeFormModal open={typeModalOpen} onOpenChange={setTypeModalOpen} />
      <IngredientFormModal open={ingredientModalOpen} onOpenChange={setIngredientModalOpen} types={typeList} />
      <StockFormModal ingredient={editing} onClose={() => setEditing(null)} source="ingredients" />
    </div>
  );
}
