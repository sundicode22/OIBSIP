import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { UserFormDialog } from "./UserFormDialog";
import type { UserFormData } from "../schemas/user.schema";
import { toast } from "sonner";
import {
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  UserPlusIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import type { User } from "../types/user.types";

export function UserTable() {
  const { data: users, isLoading, isError, error, refetch } = useUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        message={(error as Error).message}
        retry={() => refetch()}
      />
    );
  }

  const filteredUsers = (users || [])
    .filter(
      (user: User) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: User, b: User) => {
      const cmp = a.name.localeCompare(b.name);
      return sortAsc ? cmp : -cmp;
    });

  const handleCreateOpen = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleEditOpen = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleFormSave = (formData: UserFormData) => {
    toast.success(
      selectedUser
        ? `User "${formData.name}" updated successfully!`
        : `User "${formData.name}" created successfully!`
    );
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {filteredUsers.length} of {users?.length || 0} records
          </span>
          <Button onClick={handleCreateOpen} className="gap-2">
            <UserPlusIcon className="h-4 w-4" />
            Add User (Dialog Form)
          </Button>
        </div>
      </div>

      {/* shadcn UI Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="flex items-center gap-1 font-semibold hover:text-foreground transition-colors"
                >
                  Name
                  <ArrowsUpDownIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                  No records match your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: User) => (
                <TableRow key={user.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell className="font-medium">
                    <div>
                      {user.name}
                      <div className="text-xs text-muted-foreground font-normal">
                        @{user.username}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <EnvelopeIcon className="h-3.5 w-3.5" />
                      {user.email}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{user.phone}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-xs">
                      <BuildingOfficeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      {user.company?.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{user.address?.city}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleEditOpen(user)}
                        title="Edit User in Large Dialog"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={isDeleting}
                        onClick={() => deleteUser(user.id)}
                        title="Delete User"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 70% Dialog Form */}
      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSubmit={handleFormSave}
      />
    </div>
  );
}
