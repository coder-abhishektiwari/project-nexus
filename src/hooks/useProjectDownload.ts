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
    const check = async () => {
      if (!user || !project) return;

      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .eq("project_id", project.id)
        .eq("payment_status", "completed")
        .maybeSingle();

      setHasPurchased(!!data);
    };

    check();
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
      if (fileUrl) {
        window.open(fileUrl, "_blank");
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

        setHasPurchased(true);

        toast({
          title: "Purchase Successful!",
          description: "Download unlocked!",
        });
      },
    });
  };

  return { hasPurchased, handleDownload, paymentLoading: loading };
}
