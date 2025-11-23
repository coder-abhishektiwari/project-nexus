import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface TransactionWithProfile {
  id: string;
  user_id: string;
  project_id: string;
  amount: number;
  payment_id: string;
  payment_status: string;
  created_at: string;
  download_url: string | null;
  download_expires_at: string | null;
  projects: { name: string } | null;
  profile?: {
    id: string;
    full_name: string;
    email: string;
  };
}

const TransactionsViewer = () => {
  const { data: transactions, isLoading } = useQuery<TransactionWithProfile[]>({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, projects(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch user profiles separately
      if (data) {
        const userIds = [...new Set(data.map(t => t.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        
        return data.map(transaction => ({
          ...transaction,
          profile: profiles?.find(p => p.id === transaction.user_id)
        }));
      }
      
      return [];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'failed': return 'bg-red-500/20 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  return (
    <Card className="glass border-border/50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold text-primary">₹{totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-sm">
                    {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.profile?.full_name}</div>
                      <div className="text-sm text-muted-foreground">{transaction.profile?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.projects?.name}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">₹{Number(transaction.amount).toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {transaction.payment_id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.payment_status)}>
                      {transaction.payment_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {transactions?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default TransactionsViewer;
