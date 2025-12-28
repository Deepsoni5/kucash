"use client";

import { useState, useMemo } from "react";
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
  Phone,
  MapPin,
  CreditCard,
  Hash,
  MessageCircle,
  Search,
  Filter,
  Download,
  SortAsc,
  SortDesc,
} from "lucide-react";
import {
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateUserDetails,
} from "@/app/actions/user-actions";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { CloudinaryImage } from "../ui/cloudinary-image";
import { WhatsAppIcon } from "../ui/whatsapp-icon";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "user" | "agent" | "moderator";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  mobile_number?: string;
  postal_address?: string;
  phone_gpay_number?: string;
  photo_url?: string;
  agent_id?: string;
  user_id?: string;
}

interface UsersTableProps {
  users: User[];
}

const roleColors = {
  admin: "bg-red-100 text-red-800 border-red-200",
  agent: "bg-blue-100 text-blue-800 border-blue-200",
  moderator: "bg-purple-100 text-purple-800 border-purple-200",
  user: "bg-gray-100 text-gray-800 border-gray-200",
};

const roleLabels = {
  admin: "Admin",
  agent: "Agent",
  moderator: "Moderator",
  user: "Customer",
};

const roleIcons = {
  admin: Shield,
  agent: UserCheck,
  moderator: UserCheck,
  user: User,
};

export function UsersTable({ users }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
  });

  // Filter and search logic
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.mobile_number && user.mobile_number.includes(searchTerm)) ||
        (user.agent_id &&
          user.agent_id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof User];
      let bValue: any = b[sortBy as keyof User];

      if (sortBy === "created_at" || sortBy === "updated_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const exportToCSV = () => {
    const headers = [
      "Full Name",
      "Email",
      "Role",
      "Status",
      "Mobile Number",
      "Agent ID",
      "Created Date",
      "Updated Date",
    ];

    const csvData = filteredAndSortedUsers.map((user) => [
      user.full_name,
      user.email,
      roleLabels[user.role],
      user.is_active ? "Active" : "Inactive",
      user.mobile_number || "",
      user.agent_id || "",
      formatDate(user.created_at),
      formatDate(user.updated_at),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Exported users to CSV");
  };

  // Helper function to render user avatar
  const renderUserAvatar = (user: User, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClasses = {
      sm: "w-10 h-10 text-sm",
      md: "w-12 h-12 text-base",
      lg: "w-16 h-16 text-lg",
    };

    if (user.photo_url) {
      return (
        <CloudinaryImage
          src={user.photo_url}
          alt={user.full_name}
          width={size === "sm" ? 40 : size === "md" ? 48 : 64}
          height={size === "sm" ? 40 : size === "md" ? 48 : 64}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      );
    }

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center`}
      >
        <span
          className={`${
            sizeClasses[size].split(" ")[2]
          } font-medium text-white`}
        >
          {user.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </span>
      </div>
    );
  };

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

  const handleWhatsAppContact = (user: User) => {
    if (!user.mobile_number) {
      toast.error("Sorry, user doesn't have any number to contact");
      return;
    }

    // Clean the mobile number (remove any non-digit characters except +)
    const cleanNumber = user.mobile_number.replace(/[^\d+]/g, "");

    // Default message for WhatsApp
    const defaultMessage = `Hello ${user.full_name}, I hope you're doing well. I'm reaching out from our admin team regarding your account. Please let me know if you have any questions or need assistance.`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(defaultMessage);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
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
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users, emails, IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">Customer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Created</SelectItem>
              <SelectItem value="updated_at">Updated</SelectItem>
              <SelectItem value="full_name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="role">Role</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
        </div>

        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedUsers.length} of {users.length} users
      </div>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredAndSortedUsers.map((user) => {
          const RoleIcon = roleIcons[user.role];
          return (
            <Card key={user.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {renderUserAvatar(user, "sm")}
                  <div>
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    {user.mobile_number && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {user.mobile_number}
                      </div>
                    )}
                    {user.agent_id && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Hash className="w-3 h-3" />
                        Agent ID: {user.agent_id}
                      </div>
                    )}
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
                          {renderUserAvatar(selectedUser, "lg")}
                          <div>
                            <h3 className="text-lg font-medium">
                              {selectedUser.full_name}
                            </h3>
                            <p className="text-muted-foreground">
                              {selectedUser.email}
                            </p>
                            {selectedUser.agent_id && (
                              <p className="text-sm text-blue-600 font-medium">
                                Agent ID: {selectedUser.agent_id}
                              </p>
                            )}
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
                          {selectedUser.user_id && (
                            <div>
                              <Label className="text-sm font-medium">
                                Auth User ID
                              </Label>
                              <p className="text-sm font-mono break-all">
                                {selectedUser.user_id}
                              </p>
                            </div>
                          )}
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
                          {selectedUser.mobile_number && (
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                Mobile Number
                              </Label>
                              <p className="text-sm">
                                {selectedUser.mobile_number}
                              </p>
                            </div>
                          )}
                          {selectedUser.phone_gpay_number && (
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                GPay Number
                              </Label>
                              <p className="text-sm">
                                {selectedUser.phone_gpay_number}
                              </p>
                            </div>
                          )}
                          {selectedUser.postal_address && (
                            <div className="sm:col-span-2">
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Address
                              </Label>
                              <p className="text-sm">
                                {selectedUser.postal_address}
                              </p>
                            </div>
                          )}
                          <div>
                            <Label className="text-sm font-medium">
                              Created
                            </Label>
                            <p className="text-sm">
                              {formatDate(selectedUser.created_at)}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Updated
                            </Label>
                            <p className="text-sm">
                              {formatDate(selectedUser.updated_at)}
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
                            variant="outline"
                            onClick={() => handleWhatsAppContact(selectedUser)}
                            className="text-green-600 hover:text-green-700"
                            title="Contact via WhatsApp"
                          >
                            <WhatsAppIcon className="w-4 h-4" />
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
                    <SelectItem value="user">Customer</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWhatsAppContact(user)}
                  className="text-green-600 hover:text-green-700"
                  title="Contact via WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </Button>

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
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedUsers.map((user) => {
              const RoleIcon = roleIcons[user.role];
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {renderUserAvatar(user, "sm")}
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.agent_id
                            ? `Agent: ${user.agent_id}`
                            : `ID: ${user.id.slice(0, 8)}...`}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate max-w-[200px]">
                          {user.email}
                        </span>
                      </div>
                      {user.mobile_number && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {user.mobile_number}
                          </span>
                        </div>
                      )}
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
                          <SelectItem value="user">Customer</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* WhatsApp Contact */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWhatsAppContact(user)}
                        className="text-green-600 hover:text-green-700"
                        title="Contact via WhatsApp"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                      </Button>

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
