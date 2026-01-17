import { useAuth } from "@/hooks/useAuth";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function useProjectDownload(project: any) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { initiatePayment, loading } = useRazorpay();
  const [hasPurchased, setHasPurchased] = useState(false);

  // check purchase
  useEffect(() => {
    if (!user || !project?.id) return;
    const checkPurchase = async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .eq("project_id", project.id)
        .eq("payment_status", "completed")
        .maybeSingle();
      setHasPurchased(!!data);
    };

    checkPurchase();
  }, [user, project?.id]);


  const handleDownload = async () => {
    if (!project) return;
    let fileUrl = project.zip_url;

    if (!fileUrl && project.project_file_path) {
      const { data } = supabase.storage
        .from("project-files")
        .getPublicUrl(project.project_file_path);

      fileUrl = data.publicUrl;
    }

    // Free or purchased → Direct download
    if (project.is_free || hasPurchased) {
      await supabase.rpc("increment", {
        table_name: "projects",
        row_id: project.id,
        column_name: "downloads_count"
      });


      if (fileUrl) {
        // window.open(fileUrl, "_blank");
        const hiddenLink = document.createElement("a");
        hiddenLink.href = fileUrl;
        hiddenLink.download = project.name || "project.zip";
        hiddenLink.style.display = "none";
        document.body.appendChild(hiddenLink);
        hiddenLink.click();
        document.body.removeChild(hiddenLink);

      } else {
        toast({ title: "No Download Link!", variant: "destructive" });
      }
      return;
    }
    if (!user) {
      toast({ title: "Login Required", description: "Please login to buy." });
      return "login";
    }

    initiatePayment({
      projectId: project.id,
      projectName: project.name,
      amount: project.price,

      // On success → DB entry inserted → mark as purchased
      onSuccess: async () => {
        // recheck from DB also (delay fix)
        const { data } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .eq("project_id", project.id)
          .eq("payment_status", "completed")
          .maybeSingle();

        if (data) setHasPurchased(true);

        toast({
          title: "Purchase Successful!",
          description: "Download unlocked!",
        });
      },
    });
  };

  return { hasPurchased, handleDownload, paymentLoading: loading };
}
