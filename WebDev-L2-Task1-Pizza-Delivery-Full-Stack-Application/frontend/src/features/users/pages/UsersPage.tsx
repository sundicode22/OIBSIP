import { useState } from "react";
import { UserTable } from "../components/UserTable";
import { UserList } from "../components/UserList";
import { Button } from "@/components/ui/button";
import {
  TableCellsIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export function UsersPage() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-sm text-muted-foreground">
            Displaying user records via shadcn Table, 70% Dialog Form, and Heroicons
          </p>
        </div>
        <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/40 self-start sm:self-auto">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setViewMode("table")}
          >
            <TableCellsIcon className="h-4 w-4" />
            Table View
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setViewMode("cards")}
          >
            <Squares2X2Icon className="h-4 w-4" />
            Card View
          </Button>
        </div>
      </div>

      {viewMode === "table" ? <UserTable /> : <UserList />}
    </section>
  );
}
