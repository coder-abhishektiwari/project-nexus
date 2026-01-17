import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const RequestsViewer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .order('created_at', { ascending: false });


      if (error) throw error;
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('project_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
      toast({ title: 'Status updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update status', description: error.message, variant: 'destructive' });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'in_progress': return 'bg-blue-500/20 text-blue-500';
      case 'completed': return 'bg-green-500/20 text-green-500';
      case 'rejected': return 'bg-red-500/20 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 text-black">
    <h2 className="text-2xl font-bold tracking-tight mb-6">
        <span className="inline-flex items-center gap-2">
            Custom Project Requests
        </span>
    </h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-gray-100">
          <Table>
            <TableHeader className="bg-gray-50/50"> {/* 🟢 Added Header Style */}
              <TableRow className="border-b border-gray-200 hover:bg-transparent">
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Idea</TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Technologies</TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((request) => (
                <TableRow
                  key={request.id}
                  className="group border-b border-gray-100 hover:bg-gray-50/60 transition-colors duration-200" 
                >
                  <TableCell className="px-6 py-4 text-sm font-mono text-gray-700"> 
                    {format(new Date(request.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{request.full_name}</div> 
                      <div className="text-xs text-gray-500">{request.email}</div> 
                      {request.college && (
                        <div className="text-[10px] text-gray-400 mt-0.5">{request.college} - {request.year}</div> 
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 max-w-[250px]"> 
                    <div className="truncate text-sm text-gray-700" title={request.project_idea}>
                      {request.project_idea}
                    </div>
                    {request.suggested_name && (
                      <div className="text-xs text-gray-500 mt-1">
                        <b>Name:</b> {request.suggested_name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-gray-700">{request.technologies}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium"> 
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200"> 
                      {request.budget}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Select
                      value={request.status}
                      onValueChange={(value) => updateStatusMutation.mutate({ id: request.id, status: value })}
                    >
                      <SelectTrigger className="w-32 h-9 bg-white border-gray-200 hover:border-gray-300 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {requests?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No custom requests yet
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default RequestsViewer;
