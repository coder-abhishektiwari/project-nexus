import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Mail, Smartphone, Building, BookText, GraduationCap, Calendar, Save, Loader2 } from 'lucide-react';

const EditUserModal = ({ open, setOpen, user }: any) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    email: user.email || "",
    mobile: user.mobile || "",
    college: user.college || "",
    course: user.course || "",
    specialization: user.specialization || "",
    year: user.year || "",
  });

  // 🟢 NEW: Map keys to their respective icons
  const fieldIcons: { [key: string]: any } = {
    full_name: User,
    email: Mail,
    mobile: Smartphone,
    college: Building,
    course: BookText,
    specialization: GraduationCap,
    year: Calendar,
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "User updated successfully", description: "The user's profile has been saved." }); // 🟢 Added description
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setOpen(false);
    },
    onError: (err) => {
      console.error("Update Error:", err); // 🟢 For debugging
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 p-6 rounded-lg shadow-xl border border-gray-200"> {/* 🟢 Styled DialogContent */}
        <DialogHeader className="border-b border-gray-100 pb-4 mb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2"> {/* 🟢 Styled DialogTitle */}
            <User className="h-6 w-6 text-primary" /> Edit User Profile
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Make changes to the user's profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {Object.keys(formData).map((key) => {
                const IconComponent = fieldIcons[key]; // Get the icon for the current field
                return (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key} className="capitalize text-sm font-medium text-gray-700 flex items-center gap-2">
                      {IconComponent && <IconComponent className="h-4 w-4 text-gray-500" />}
                      {key.replace("_", " ")}
                    </Label>
                    <Input
                      id={key}
                      value={(formData as any)[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-black/70 "
                      disabled={updateMutation.isPending && (key === "email" || key === "full_name")} // Disable Name/Email if updating
                      type={key === "email" ? "email" : "text"} // Add email type for validation
                    />
                  </div>
                );
              })}
            </div>
          </form>
        </div>
        <div className="pt-4 border-t border-gray-100 mt-4">
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-black text-white font-semibold rounded-md shadow-md hover:bg-gray-800 transition-colors duration-200" // 🟢 Styled Button
            onClick={handleSubmit}
            disabled={updateMutation.isPending} // 🟢 Disable button during loading
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" /> // 🟢 Loading Spinner
            ) : (
              <Save className="h-5 w-5" /> // 🟢 Save Icon
            )}
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;