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
  UserCheck,
  UserX,
  Phone,
  MapPin,
  CreditCard,
  Hash,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Briefcase,
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

interface Agent {
  id: string;
  full_name: string;
  email: string;
  role: "agent";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  mobile_number?: string;
  postal_address?: string;
  phone_gpay_number?: string;
  photo_url?: string;
  agent_id?: string;
  user_id?: string;
  totalLoans: number;
  pendingLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  pendingCommission: number;
  earnedCommission: number;
  rejectedCommission: number;
  totalCommission: number;
  totalLoanAmount: number;
}

interface AgentsTableProps {
  agents: Agent[];
}

export function AgentsTable({ agents }: AgentsTableProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
  });

  // Helper function to render agent avatar
  const renderAgentAvatar = (agent: Agent, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClasses = {
      sm: "w-10 h-10 text-sm",
      md: "w-12 h-12 text-base",
      lg: "w-16 h-16 text-lg",
    };

    if (agent.photo_url) {
      return (
        <CloudinaryImage
          src={agent.photo_url}
          alt={agent.full_name}
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
          {agent.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </span>
      </div>
    );
  };

  const handleStatusUpdate = async (agentId: string, isActive: boolean) => {
    setIsUpdating(true);
    try {
      const result = await updateUserStatus(agentId, isActive);
      if (result.success) {
        toast.success(
          `Agent ${isActive ? "activated" : "deactivated"} successfully`
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

  const handleAgentDelete = async (agentId: string) => {
    setIsUpdating(true);
    try {
      const result = await deleteUser(agentId);
      if (result.success) {
        toast.success("Agent deleted successfully");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to delete agent");
      }
    } catch (error) {
      toast.error("An error occurred while deleting agent");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAgentEdit = async () => {
    if (!editingAgent) return;

    setIsUpdating(true);
    try {
      const result = await updateUserDetails(editingAgent.id, editForm);
      if (result.success) {
        toast.success("Agent details updated successfully");
        setEditingAgent(null);
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to update agent");
      }
    } catch (error) {
      toast.error("An error occurred while updating agent");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWhatsAppContact = (agent: Agent) => {
    if (!agent.mobile_number) {
      toast.error("Sorry, agent doesn't have any number to contact");
      return;
    }

    // Clean the mobile number (remove any non-digit characters except +)
    const cleanNumber = agent.mobile_number.replace(/[^\d+]/g, "");

    // Default message for WhatsApp
    const defaultMessage = `Hello ${agent.full_name}, I hope you're doing well. I'm reaching out from our admin team regarding your agent account. Please let me know if you have any questions or need assistance.`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(defaultMessage);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSuccessRate = (approved: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((approved / total) * 100);
  };

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">No agents found</h3>
        <p className="text-muted-foreground">
          Agent accounts will appear here once they are created.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {renderAgentAvatar(agent, "sm")}
                <div>
                  <div className="font-medium">{agent.full_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {agent.email}
                  </div>
                  {agent.mobile_number && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {agent.mobile_number}
                    </div>
                  )}
                  {agent.agent_id && (
                    <div className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
                      <Hash className="w-3 h-3" />
                      {agent.agent_id}
                    </div>
                  )}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Agent Details & Performance</DialogTitle>
                    <DialogDescription>
                      View agent information and loan performance metrics
                    </DialogDescription>
                  </DialogHeader>
                  {selectedAgent && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        {renderAgentAvatar(selectedAgent, "lg")}
                        <div>
                          <h3 className="text-lg font-medium">
                            {selectedAgent.full_name}
                          </h3>
                          <p className="text-muted-foreground">
                            {selectedAgent.email}
                          </p>
                          {selectedAgent.agent_id && (
                            <p className="text-sm text-blue-600 font-medium">
                              Agent ID: {selectedAgent.agent_id}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Performance Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <TrendingUp className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedAgent.totalLoans}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total Loans
                          </div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <Clock className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
                          <div className="text-2xl font-bold text-yellow-600">
                            {selectedAgent.pendingLoans}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Pending
                          </div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
                          <div className="text-2xl font-bold text-green-600">
                            {selectedAgent.approvedLoans}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Approved
                          </div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <XCircle className="w-6 h-6 mx-auto mb-1 text-red-600" />
                          <div className="text-2xl font-bold text-red-600">
                            {selectedAgent.rejectedLoans}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Rejected
                          </div>
                        </div>
                      </div>

                      {/* Financial Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                          <div className="text-xl font-bold text-purple-600">
                            {formatCurrency(selectedAgent.totalCommission)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Commission
                          </div>
                        </div>
                        <div className="text-center p-4 bg-indigo-50 rounded-lg">
                          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                          <div className="text-xl font-bold text-indigo-600">
                            {formatCurrency(selectedAgent.totalLoanAmount)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Loan Amount
                          </div>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 rounded-lg">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                          <div className="text-xl font-bold text-emerald-600">
                            {getSuccessRate(
                              selectedAgent.approvedLoans,
                              selectedAgent.totalLoans
                            )}
                            %
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Success Rate
                          </div>
                        </div>
                      </div>

                      {/* Agent Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Agent ID
                          </Label>
                          <p className="text-sm font-mono break-all">
                            {selectedAgent.agent_id || "Not assigned"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Database ID
                          </Label>
                          <p className="text-sm font-mono break-all">
                            {selectedAgent.id}
                          </p>
                        </div>
                        {selectedAgent.user_id && (
                          <div>
                            <Label className="text-sm font-medium">
                              Auth User ID
                            </Label>
                            <p className="text-sm font-mono break-all">
                              {selectedAgent.user_id}
                            </p>
                          </div>
                        )}
                        <div>
                          <Label className="text-sm font-medium">Status</Label>
                          <div className="mt-1">
                            <Badge
                              variant={
                                selectedAgent.is_active
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {selectedAgent.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        {selectedAgent.mobile_number && (
                          <div>
                            <Label className="text-sm font-medium flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              Mobile Number
                            </Label>
                            <p className="text-sm">
                              {selectedAgent.mobile_number}
                            </p>
                          </div>
                        )}
                        {selectedAgent.phone_gpay_number && (
                          <div>
                            <Label className="text-sm font-medium flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />
                              GPay Number
                            </Label>
                            <p className="text-sm">
                              {selectedAgent.phone_gpay_number}
                            </p>
                          </div>
                        )}
                        {selectedAgent.postal_address && (
                          <div className="sm:col-span-2">
                            <Label className="text-sm font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Address
                            </Label>
                            <p className="text-sm">
                              {selectedAgent.postal_address}
                            </p>
                          </div>
                        )}
                        <div>
                          <Label className="text-sm font-medium">Created</Label>
                          <p className="text-sm">
                            {formatDate(selectedAgent.created_at)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Updated</Label>
                          <p className="text-sm">
                            {formatDate(selectedAgent.updated_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingAgent(selectedAgent);
                            setEditForm({
                              full_name: selectedAgent.full_name,
                              email: selectedAgent.email,
                            });
                          }}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleWhatsAppContact(selectedAgent)}
                          className="text-green-600 hover:text-green-700"
                          title="Contact via WhatsApp"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={
                            selectedAgent.is_active ? "outline" : "default"
                          }
                          onClick={() =>
                            handleStatusUpdate(
                              selectedAgent.id,
                              !selectedAgent.is_active
                            )
                          }
                          disabled={isUpdating}
                          className="flex-1"
                        >
                          {selectedAgent.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="text-sm font-bold text-yellow-600">
                  {formatCurrency(agent.pendingCommission)}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-sm font-bold text-green-600">
                  {formatCurrency(agent.earnedCommission)}
                </div>
                <div className="text-xs text-muted-foreground">Earned</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="text-sm font-bold text-red-600">
                  {formatCurrency(agent.rejectedCommission)}
                </div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant={agent.is_active ? "default" : "secondary"}
                  className={
                    agent.is_active
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {agent.is_active ? (
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
                <Badge variant="outline" className="text-blue-600">
                  Total: {formatCurrency(agent.totalCommission)}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(agent.created_at)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWhatsAppContact(agent)}
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
                    <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {agent.full_name}? This
                      action cannot be undone and will affect all their loan
                      applications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleAgentDelete(agent.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {renderAgentAvatar(agent, "sm")}
                    <div>
                      <div className="font-medium">{agent.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {agent.agent_id
                          ? `ID: ${agent.agent_id}`
                          : `${agent.id.slice(0, 8)}...`}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate max-w-[200px]">
                        {agent.email}
                      </span>
                    </div>
                    {agent.mobile_number && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {agent.mobile_number}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-blue-500" />
                        {agent.totalLoans}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {agent.approvedLoans}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-yellow-500" />
                        {agent.pendingLoans}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getSuccessRate(agent.approvedLoans, agent.totalLoans)}%
                      success rate
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Clock className="w-3 h-3" />
                        Pending: {formatCurrency(agent.pendingCommission)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Earned: {formatCurrency(agent.earnedCommission)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle className="w-3 h-3" />
                        Rejected: {formatCurrency(agent.rejectedCommission)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={agent.is_active ? "default" : "secondary"}
                    className={
                      agent.is_active
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }
                  >
                    {agent.is_active ? (
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
                  <div className="flex items-center gap-2">
                    {/* View Details Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAgent(agent)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Agent Details & Performance</DialogTitle>
                          <DialogDescription>
                            View agent information and loan performance metrics
                          </DialogDescription>
                        </DialogHeader>
                        {selectedAgent && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              {renderAgentAvatar(selectedAgent, "lg")}
                              <div>
                                <h3 className="text-lg font-medium">
                                  {selectedAgent.full_name}
                                </h3>
                                <p className="text-muted-foreground">
                                  {selectedAgent.email}
                                </p>
                                {selectedAgent.agent_id && (
                                  <p className="text-sm text-blue-600 font-medium">
                                    Agent ID: {selectedAgent.agent_id}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Performance Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <TrendingUp className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                                <div className="text-2xl font-bold text-blue-600">
                                  {selectedAgent.totalLoans}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Total Loans
                                </div>
                              </div>
                              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <Clock className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
                                <div className="text-2xl font-bold text-yellow-600">
                                  {selectedAgent.pendingLoans}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Pending
                                </div>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
                                <div className="text-2xl font-bold text-green-600">
                                  {selectedAgent.approvedLoans}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Approved
                                </div>
                              </div>
                              <div className="text-center p-3 bg-red-50 rounded-lg">
                                <XCircle className="w-6 h-6 mx-auto mb-1 text-red-600" />
                                <div className="text-2xl font-bold text-red-600">
                                  {selectedAgent.rejectedLoans}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Rejected
                                </div>
                              </div>
                            </div>

                            {/* Commission Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                                <div className="text-xl font-bold text-yellow-600">
                                  {formatCurrency(
                                    selectedAgent.pendingCommission
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Pending Commission
                                </div>
                              </div>
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                <div className="text-xl font-bold text-green-600">
                                  {formatCurrency(
                                    selectedAgent.earnedCommission
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Earned Commission
                                </div>
                              </div>
                              <div className="text-center p-4 bg-red-50 rounded-lg">
                                <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                                <div className="text-xl font-bold text-red-600">
                                  {formatCurrency(
                                    selectedAgent.rejectedCommission
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Rejected Commission
                                </div>
                              </div>
                            </div>

                            {/* Agent Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">
                                  Agent ID
                                </Label>
                                <p className="text-sm font-mono break-all">
                                  {selectedAgent.agent_id || "Not assigned"}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Database ID
                                </Label>
                                <p className="text-sm font-mono break-all">
                                  {selectedAgent.id}
                                </p>
                              </div>
                              {selectedAgent.user_id && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Auth User ID
                                  </Label>
                                  <p className="text-sm font-mono break-all">
                                    {selectedAgent.user_id}
                                  </p>
                                </div>
                              )}
                              <div>
                                <Label className="text-sm font-medium">
                                  Status
                                </Label>
                                <div className="mt-1">
                                  <Badge
                                    variant={
                                      selectedAgent.is_active
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {selectedAgent.is_active
                                      ? "Active"
                                      : "Inactive"}
                                  </Badge>
                                </div>
                              </div>
                              {selectedAgent.mobile_number && (
                                <div>
                                  <Label className="text-sm font-medium flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    Mobile Number
                                  </Label>
                                  <p className="text-sm">
                                    {selectedAgent.mobile_number}
                                  </p>
                                </div>
                              )}
                              {selectedAgent.phone_gpay_number && (
                                <div>
                                  <Label className="text-sm font-medium flex items-center gap-1">
                                    <CreditCard className="w-3 h-3" />
                                    GPay Number
                                  </Label>
                                  <p className="text-sm">
                                    {selectedAgent.phone_gpay_number}
                                  </p>
                                </div>
                              )}
                              {selectedAgent.postal_address && (
                                <div className="sm:col-span-2">
                                  <Label className="text-sm font-medium flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    Address
                                  </Label>
                                  <p className="text-sm">
                                    {selectedAgent.postal_address}
                                  </p>
                                </div>
                              )}
                              <div>
                                <Label className="text-sm font-medium">
                                  Created
                                </Label>
                                <p className="text-sm">
                                  {formatDate(selectedAgent.created_at)}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Updated
                                </Label>
                                <p className="text-sm">
                                  {formatDate(selectedAgent.updated_at)}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditingAgent(selectedAgent);
                                  setEditForm({
                                    full_name: selectedAgent.full_name,
                                    email: selectedAgent.email,
                                  });
                                }}
                                className="flex-1"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Details
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleWhatsAppContact(selectedAgent)
                                }
                                className="text-green-600 hover:text-green-700"
                                title="Contact via WhatsApp"
                              >
                                <WhatsAppIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={
                                  selectedAgent.is_active
                                    ? "outline"
                                    : "default"
                                }
                                onClick={() =>
                                  handleStatusUpdate(
                                    selectedAgent.id,
                                    !selectedAgent.is_active
                                  )
                                }
                                disabled={isUpdating}
                                className="flex-1"
                              >
                                {selectedAgent.is_active
                                  ? "Deactivate"
                                  : "Activate"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* WhatsApp Contact */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWhatsAppContact(agent)}
                      className="text-green-600 hover:text-green-700"
                      title="Contact via WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                    </Button>

                    {/* Delete Agent */}
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
                          <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {agent.full_name}?
                            This action cannot be undone and will affect all
                            their loan applications.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAgentDelete(agent.id)}
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Agent Dialog */}
      <Dialog open={!!editingAgent} onOpenChange={() => setEditingAgent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent Details</DialogTitle>
            <DialogDescription>Update agent information</DialogDescription>
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
              <Button onClick={handleAgentEdit} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Agent"}
              </Button>
              <Button variant="outline" onClick={() => setEditingAgent(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
