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
import { Label } from "@/components/ui/label";
import {
  Eye,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { updateContactStatus } from "@/app/actions/contact-actions";
import { toast } from "sonner";
import { Card } from "../ui/card";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
  created_at: string;
  updated_at: string;
}

interface ContactSubmissionsTableProps {
  submissions: ContactSubmission[];
}

const statusColors = {
  new: "bg-orange-100 text-orange-800 border-orange-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
};

const statusLabels = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
};

// Component for expandable text
function ExpandableText({
  text,
  maxLength = 100,
}: {
  text: string;
  maxLength?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  return (
    <div>
      <span>{isExpanded ? text : `${text.substring(0, maxLength)}...`}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 ml-2 text-xs text-primary hover:bg-transparent"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-3 h-3 mr-1" />
            Show less
          </>
        ) : (
          <>
            <ChevronDown className="w-3 h-3 mr-1" />
            Show more
          </>
        )}
      </Button>
    </div>
  );
}

export function ContactSubmissionsTable({
  submissions,
}: ContactSubmissionsTableProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const result = await updateContactStatus(id, newStatus);
      if (result.success) {
        toast.success("Status updated successfully");
        // Refresh the page to show updated data
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
        <p className="text-muted-foreground">
          Contact form submissions will appear here when customers reach out.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-medium text-sm mb-1">
                  {submission.name}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Mail className="w-3 h-3" />
                  {submission.email}
                </div>
                {submission.phone && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {submission.phone}
                  </div>
                )}
              </div>
              <Badge
                variant="outline"
                className={statusColors[submission.status]}
              >
                {statusLabels[submission.status]}
              </Badge>
            </div>

            <div className="mb-3">
              <div className="font-medium text-sm mb-1">
                <ExpandableText text={submission.subject} maxLength={40} />
              </div>
              <div className="text-xs text-muted-foreground">
                <ExpandableText text={submission.message} maxLength={60} />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(submission.created_at)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Contact Submission Details</DialogTitle>
                    <DialogDescription>
                      Review and manage this customer inquiry
                    </DialogDescription>
                  </DialogHeader>
                  {selectedSubmission && (
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Name</Label>
                          <p className="text-sm">{selectedSubmission.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <p className="text-sm break-all">
                            {selectedSubmission.email}
                          </p>
                        </div>
                        {selectedSubmission.phone && (
                          <div>
                            <Label className="text-sm font-medium">Phone</Label>
                            <p className="text-sm">
                              {selectedSubmission.phone}
                            </p>
                          </div>
                        )}
                        <div>
                          <Label className="text-sm font-medium">Date</Label>
                          <p className="text-sm">
                            {formatDate(selectedSubmission.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <Label className="text-sm font-medium">Subject</Label>
                        <p className="text-sm mt-1">
                          {selectedSubmission.subject}
                        </p>
                      </div>

                      {/* Message */}
                      <div>
                        <Label className="text-sm font-medium">Message</Label>
                        <div className="mt-1 p-3 bg-muted rounded-md">
                          <p className="text-sm whitespace-pre-wrap">
                            {selectedSubmission.message}
                          </p>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="flex items-center gap-3 mt-2">
                          <Select
                            defaultValue={selectedSubmission.status}
                            onValueChange={(value) =>
                              handleStatusUpdate(selectedSubmission.id, value)
                            }
                            disabled={isUpdating}
                          >
                            <SelectTrigger className="w-full sm:w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in_progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                          {isUpdating && (
                            <span className="text-sm text-muted-foreground">
                              Updating...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Select
                defaultValue={submission.status}
                onValueChange={(value) =>
                  handleStatusUpdate(submission.id, value)
                }
                disabled={isUpdating}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Subject & Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <div className="font-medium">{submission.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm flex items-center gap-1">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate max-w-[200px]">
                      {submission.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {submission.phone ? (
                    <div className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span>{submission.phone}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="max-w-sm">
                    <div className="font-medium text-sm mb-1">
                      <ExpandableText
                        text={submission.subject}
                        maxLength={50}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      <ExpandableText
                        text={submission.message}
                        maxLength={80}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusColors[submission.status]}
                  >
                    {statusLabels[submission.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(submission.created_at)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Contact Submission Details</DialogTitle>
                          <DialogDescription>
                            Review and manage this customer inquiry
                          </DialogDescription>
                        </DialogHeader>
                        {selectedSubmission && (
                          <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">
                                  Name
                                </Label>
                                <p className="text-sm">
                                  {selectedSubmission.name}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Email
                                </Label>
                                <p className="text-sm">
                                  {selectedSubmission.email}
                                </p>
                              </div>
                              {selectedSubmission.phone && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Phone
                                  </Label>
                                  <p className="text-sm">
                                    {selectedSubmission.phone}
                                  </p>
                                </div>
                              )}
                              <div>
                                <Label className="text-sm font-medium">
                                  Date
                                </Label>
                                <p className="text-sm">
                                  {formatDate(selectedSubmission.created_at)}
                                </p>
                              </div>
                            </div>

                            {/* Subject */}
                            <div>
                              <Label className="text-sm font-medium">
                                Subject
                              </Label>
                              <p className="text-sm mt-1">
                                {selectedSubmission.subject}
                              </p>
                            </div>

                            {/* Message */}
                            <div>
                              <Label className="text-sm font-medium">
                                Message
                              </Label>
                              <div className="mt-1 p-3 bg-muted rounded-md">
                                <p className="text-sm whitespace-pre-wrap">
                                  {selectedSubmission.message}
                                </p>
                              </div>
                            </div>

                            {/* Status Update */}
                            <div>
                              <Label className="text-sm font-medium">
                                Status
                              </Label>
                              <div className="flex items-center gap-3 mt-2">
                                <Select
                                  defaultValue={selectedSubmission.status}
                                  onValueChange={(value) =>
                                    handleStatusUpdate(
                                      selectedSubmission.id,
                                      value
                                    )
                                  }
                                  disabled={isUpdating}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="in_progress">
                                      In Progress
                                    </SelectItem>
                                    <SelectItem value="resolved">
                                      Resolved
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {isUpdating && (
                                  <span className="text-sm text-muted-foreground">
                                    Updating...
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Select
                      defaultValue={submission.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(submission.id, value)
                      }
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
