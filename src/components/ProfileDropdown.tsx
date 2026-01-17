import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Shield, ShoppingBag, Store, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  /* -------- CHECK ADMIN -------- */
  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <DropdownMenu>
      {/* TRIGGER */}
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full transition">
          <ProfileAvatar
            name={user?.user_metadata?.full_name}
            image={user?.user_metadata?.avatar_url}
          />
        </button>
      </DropdownMenuTrigger>

      {/* CONTENT */}
      <DropdownMenuContent align="end" className="w-56 mt-2 bg-white border border-gray-200 shadow-md rounded-xl z-50">
        {/* USER INFO */}
        <DropdownMenuItem
          className="cursor-pointer rounded-xl focus:bg-slate-50 p-2"
          onClick={() => navigate("/profile-setting")}
        >
          <div className="flex items-center gap-3 w-full">
            <ProfileAvatar
              name={user?.user_metadata?.full_name}
              image={user?.user_metadata?.avatar_url}
              className="h-10 w-10 shrink-0" 
            />
            <div className="flex flex-col truncate">
              <p className="text-sm text-slate-900 font-bold truncate">
                {user.user_metadata?.full_name || "User"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* SELLER LOGIC */}
        {!user.user_metadata?.is_seller && (
          <DropdownMenuItem
            className="cursor-pointer text-black"
            onClick={() => navigate("/become-seller")}
          >
            <Store className="mr-2 h-4 w-4" />
            Become a Seller
          </DropdownMenuItem>
        )}

        {user.user_metadata?.is_seller && (
          <DropdownMenuItem
            className="cursor-pointer text-black"
            onClick={() => navigate("/seller/dashboard")}
          >
            <Store className="mr-2 h-4 w-4" />
            Seller Dashboard
          </DropdownMenuItem>
        )}

        {/* PURCHASED PROJECTS */}
        <DropdownMenuItem
          className="cursor-pointer text-black"
          onClick={() => navigate("/my-projects")}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          My Purchased Projects
        </DropdownMenuItem>

        {/* ADMIN */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-black"
              onClick={() => navigate("/admin")}
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        {/* LOGOUT */}
        <DropdownMenuItem
          className="cursor-pointer text-red-600 hover:bg-red-600"
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
