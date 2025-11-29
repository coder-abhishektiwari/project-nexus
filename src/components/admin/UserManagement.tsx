import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import EditUserModal from '../EditUserModel';

const UserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (pErr) throw pErr;

      const { data: roles, error: rErr } = await supabase
        .from('user_roles')
        .select('*');
      if (rErr) throw rErr;

      return profiles
        .map(user => ({
          ...user,
          roles: roles.filter(r => r.user_id === user.id).map(r => r.role)
        }))
        .filter(u => !u.roles.includes("admin"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: "User deleted successfully" });
    },
    onError: (err) => {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Delete this user permanently?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  return (
    <>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 text-black">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          User Management
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg ring-1 ring-gray-100">
            <Table >
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-b border-gray-200 hover:bg-transparent">
                  <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">College</TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialization</TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users?.map((user: any) => (
                  <TableRow
                    key={user.id}
                    className="group border-b border-gray-100 hover:bg-gray-50/60 transition-colors duration-200"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="font-semibold text-gray-900 whitespace-nowrap">{user.full_name}</div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">{user.email}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-700 font-mono">{user.mobile || "-"}</TableCell> {/* 🟢 Styled Mobile */}
                    <TableCell className="px-6 py-4 text-xs text-gray-600 max-w-[150px] truncate">{user.college || "-"}</TableCell>
                    <TableCell className="px-6 py-4 text-xs text-gray-600">{user.course || "-"}</TableCell>
                    <TableCell className="px-6 py-4 text-xs text-gray-600">{user.specialization || "-"}</TableCell>
                    <TableCell className="px-6 py-4 text-xs text-gray-600">{user.year || "-"}</TableCell>
                    <TableCell className="px-6 py-4 text-xs text-gray-500">{format(new Date(user.created_at), "MMM dd, yyyy")}</TableCell> {/* 🟢 Styled Date */}
                    <TableCell className="px-6 py-4 text-xs text-gray-500">{format(new Date(user.updated_at), "MMM dd, yyyy")}</TableCell> {/* 🟢 Styled Date */}

                    <TableCell className="px-6 py-4 flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="hover:bg-blue-100/50">
                        <Pencil className="h-4 w-4 text-blue-600" /> 
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="hover:bg-red-100/50">
                        <Trash2 className="h-4 w-4 text-red-600" /> 
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {users?.length === 0 && (
              <p className="text-center text-gray-500 py-10 border-t border-gray-100">No users found</p>
            )}
          </div>
        )}
      </Card>

      {/* Edit User Modal - Unchanged logic */}
      {isEditOpen && (
        <EditUserModal
          open={isEditOpen}
          setOpen={setIsEditOpen}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default UserManagement;
