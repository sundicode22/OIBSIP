import { Check, Pizza as PizzaIcon, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Pizza } from "@/types/domain";

interface PizzaCardProps {
  pizza: Pizza;
  selected: boolean;
  onToggle: () => void;
}

export function PizzaCard({ pizza, selected, onToggle }: PizzaCardProps) {
  const outOfStock = pizza.ingredients?.some((ingredient) => ingredient.stock < 1) ?? false;

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden transition-shadow hover:shadow-md",
        selected && "ring-2 ring-primary",
      )}
    >
      <div className="relative flex aspect-[16/10] items-center justify-center bg-primary/5">
        {pizza.imageUrl ? (
          <img src={pizza.imageUrl} alt={pizza.name} className="size-full object-cover" />
        ) : (
          <PizzaIcon className="size-14 text-primary/40" />
        )}
        {outOfStock && (
          <Badge variant="destructive" className="absolute left-3 top-3">
            Unavailable
          </Badge>
        )}
      </div>
      <CardContent className="flex-1 space-y-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight">{pizza.name}</h3>
          <span className="font-semibold text-primary">{formatPrice(pizza.price)}</span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{pizza.description}</p>
        {pizza.ingredients && pizza.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pizza.ingredients.slice(0, 5).map((ingredient) => (
              <Badge key={ingredient.id} variant="secondary" className="font-normal">
                {ingredient.name}
              </Badge>
            ))}
            {pizza.ingredients.length > 5 && (
              <Badge variant="secondary" className="font-normal">
                +{pizza.ingredients.length - 5}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full"
          variant={selected ? "secondary" : "default"}
          disabled={outOfStock}
          onClick={onToggle}
        >
          {selected ? <Check /> : <Plus />}
          {selected ? "Added to order" : "Add to order"}
        </Button>
      </CardFooter>
    </Card>
  );
}
