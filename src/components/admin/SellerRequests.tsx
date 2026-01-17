import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import ViewSellerApplicationModal from "./ViewSellerApplicationModal";

const SellerRequestsViewer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<any>(null);

  /* ---------------- FETCH SELLER APPLICATIONS (FIXED) ---------------- */
  const {
    data: requests = [],
    isLoading,
  } = useQuery({
    queryKey: ["admin-seller-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seller_applications")
        .select(`
          id,
          user_id,
          status,
          created_at,

          full_name,
          whatsapp,
          github_profile,
          linkedin_profile,

          upload_method,
          source_zip_url,
          github_repo_url,
          documentation_url,

          pan_number,
          aadhaar_number,

          bank_account_name,
          bank_ifsc,
          bank_account_number
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  /* ---------------- UPDATE STATUS (ADMIN ONLY) ---------------- */
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: string;
    }) => {
      const { error } = await supabase
        .from("seller_applications")
        .update({ status })
        .eq("id", applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-seller-applications"],
      });
      toast({ title: "Application updated successfully" });
      setSelectedApp(null);
    },
    onError: (err: any) => {
      toast({
        title: "Action failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-600";
      case "approved":
        return "bg-green-500/20 text-green-600";
      case "rejected":
        return "bg-red-500/20 text-red-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 text-black">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Seller Applications
        </h2>

        <div className="overflow-x-auto rounded-lg ring-1 ring-gray-100">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center">
                    Loading…
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    No seller applications
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                requests.map((req: any) => (
                  <TableRow key={req.id} className="hover:bg-gray-50/60">
                    <TableCell className="font-mono text-sm">
                      {format(new Date(req.created_at), "MMM dd, yyyy")}
                    </TableCell>

                    <TableCell className="font-semibold">
                      {req.full_name}
                    </TableCell>

                    <TableCell>
                      <Badge className={getStatusColor(req.status)}>
                        {req.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white hover:bg-black/10"
                        onClick={() => setSelectedApp(req)}
                      >
                        View
                      </Button>

                      <Select
                        value={req.status}
                        onValueChange={(value) =>
                          updateStatusMutation.mutate({
                            applicationId: req.id,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-32 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approve</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* 🔍 VIEW APPLICATION MODAL */}
      {selectedApp && (
        <ViewSellerApplicationModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={() =>
            updateStatusMutation.mutate({
              applicationId: selectedApp.id,
              status: "approved",
            })
          }
          onReject={() =>
            updateStatusMutation.mutate({
              applicationId: selectedApp.id,
              status: "rejected",
            })
          }
        />
      )}
    </>
  );
};

export default SellerRequestsViewer;
