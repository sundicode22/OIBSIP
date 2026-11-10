import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, Trash2 } from "lucide-react";
import type { User } from "../types/user.types";

interface UserCardProps {
  user: User;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export function UserCard({ user, onDelete, isDeleting }: UserCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-base">{user.name}</CardTitle>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(user.id)}
            disabled={isDeleting}
            aria-label="Delete user"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5" />
          {user.email}
        </span>
        <span className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5" />
          {user.phone}
        </span>
        <span className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5" />
          {user.website}
        </span>
        <p className="mt-2 text-xs">
          {user.company.name} · {user.address.city}
        </p>
      </CardContent>
    </Card>
  );
}
