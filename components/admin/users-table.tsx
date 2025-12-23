"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Users,
  Shield,
  User,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateUserDetails,
} from "@/app/actions/user-actions";
import { toast } from "sonner";
import { Card } from "../ui/card";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  is_active: boolean;
  created_at: string;
}

interface UsersTableProps {
  users: User[];
}

const roleColors = {
  admin: "bg-red-100 text-red-800 border-red-200",
  moderator: "bg-blue-100 text-blue-800 border-blue-200",
  user: "bg-gray-100 text-gray-800 border-gray-200",
};

const roleLabels = {
  admin: "Admin",
  moderator: "Moderator",
  user: "User",
};

const roleIcons = {
  admin: Shield,
  moderator: UserCheck,
  user: User,
};

export function UsersTable({ users }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
  });

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    setIsUpdating(true);
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success("User role updated successfully");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("An error occurred while updating role");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = async (userId: string, isActive: boolean) => {
    setIsUpdating(true);
    try {
      const result = await updateUserStatus(userId, isActive);
      if (result.success) {
        toast.success(
          `User ${isActive ? "activated" : "deactivated"} successfully`
        );
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUserDelete = async (userId: string) => {
    setIsUpdating(true);
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success("User deleted successfully");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred while deleting user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUserEdit = async () => {
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      const result = await updateUserDetails(editingUser.id, editForm);
      if (result.success) {
        toast.success("User details updated successfully");
        setEditingUser(null);
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to update user");
      }
    } catch (error) {
      toast.error("An error occurred while updating user");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">No users found</h3>
        <p className="text-muted-foreground">
          User accounts will appear here once they are created.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {users.map((user) => {
          const RoleIcon = roleIcons[user.role];
          return (
            <Card key={user.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>User Details</DialogTitle>
                      <DialogDescription>
                        View and manage user information
                      </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-lg font-medium text-white">
                              {selectedUser.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">
                              {selectedUser.full_name}
                            </h3>
                            <p className="text-muted-foreground">
                              {selectedUser.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">
                              User ID
                            </Label>
                            <p className="text-sm font-mono break-all">
                              {selectedUser.id}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Role</Label>
                            <div className="mt-1">
                              <Badge
                                variant="outline"
                                className={roleColors[selectedUser.role]}
                              >
                                {roleLabels[selectedUser.role]}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Status
                            </Label>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  selectedUser.is_active
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {selectedUser.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Created
                            </Label>
                            <p className="text-sm">
                              {formatDate(selectedUser.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingUser(selectedUser);
                              setEditForm({
                                full_name: selectedUser.full_name,
                                email: selectedUser.email,
                              });
                            }}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Details
                          </Button>
                          <Button
                            variant={
                              selectedUser.is_active ? "outline" : "default"
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                selectedUser.id,
                                !selectedUser.is_active
                              )
                            }
                            disabled={isUpdating}
                            className="flex-1"
                          >
                            {selectedUser.is_active ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${
                      roleColors[user.role]
                    } flex items-center gap-1`}
                  >
                    <RoleIcon className="w-3 h-3" />
                    {roleLabels[user.role]}
                  </Badge>
                  <Badge
                    variant={user.is_active ? "default" : "secondary"}
                    className={
                      user.is_active
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }
                  >
                    {user.is_active ? (
                      <>
                        <UserCheck className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <UserX className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(user.created_at)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  defaultValue={user.role}
                  onValueChange={(value) => handleRoleUpdate(user.id, value)}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {user.full_name}? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleUserDelete(user.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const RoleIcon = roleIcons[user.role];
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {user.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate max-w-[200px]">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        roleColors[user.role]
                      } flex items-center gap-1 w-fit`}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.is_active ? "default" : "secondary"}
                      className={
                        user.is_active
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {user.is_active ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(user.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* View Details Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>
                              View and manage user information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                  <span className="text-lg font-medium text-white">
                                    {selectedUser.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium">
                                    {selectedUser.full_name}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    {selectedUser.email}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">
                                    User ID
                                  </Label>
                                  <p className="text-sm font-mono">
                                    {selectedUser.id}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Role
                                  </Label>
                                  <div className="mt-1">
                                    <Badge
                                      variant="outline"
                                      className={roleColors[selectedUser.role]}
                                    >
                                      {roleLabels[selectedUser.role]}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Status
                                  </Label>
                                  <div className="mt-1">
                                    <Badge
                                      variant={
                                        selectedUser.is_active
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {selectedUser.is_active
                                        ? "Active"
                                        : "Inactive"}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Created
                                  </Label>
                                  <p className="text-sm">
                                    {formatDate(selectedUser.created_at)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingUser(selectedUser);
                                    setEditForm({
                                      full_name: selectedUser.full_name,
                                      email: selectedUser.email,
                                    });
                                  }}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Details
                                </Button>
                                <Button
                                  variant={
                                    selectedUser.is_active
                                      ? "outline"
                                      : "default"
                                  }
                                  onClick={() =>
                                    handleStatusUpdate(
                                      selectedUser.id,
                                      !selectedUser.is_active
                                    )
                                  }
                                  disabled={isUpdating}
                                >
                                  {selectedUser.is_active
                                    ? "Deactivate"
                                    : "Activate"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Quick Role Update */}
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) =>
                          handleRoleUpdate(user.id, value)
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Delete User */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.full_name}?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleUserDelete(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.full_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
                disabled={isUpdating}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                disabled={isUpdating}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUserEdit} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update User"}
              </Button>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
