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
    <Card className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 text-black">
    {/* 1. Header Section Styling */}
    <div className="flex justify-between items-center mb-6 border-gray-100 pb-4">
        <h2 className="text-2xl font-bold tracking-tight">
            Transactions
        </h2>
        <div className="text-right">
            <div className="text-sm text-gray-500 font-medium">Total Revenue</div>
            <div className="text-3xl font-extrabold text-green-600 tracking-tight">
                {/* Assuming totalRevenue is available */}
                ₹{totalRevenue.toFixed(2)}
            </div>
        </div>
    </div>

    {/* 2. Loading State Styling */}
    {isLoading ? (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary"></div>
        </div>
    ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-gray-100">
            {/* 3. Table Styling */}
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="border-b border-gray-200 hover:bg-transparent">
                        <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</TableHead>
                        <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</TableHead>
                        <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</TableHead>
                        <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</TableHead>
                        <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment ID</TableHead>
                        <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions?.map((transaction) => (
                        <TableRow 
                            key={transaction.id}
                            className="group border-b border-gray-100 hover:bg-gray-50/60 transition-colors duration-200"
                        >
                            <TableCell className="px-6 py-4 text-xs font-mono text-gray-700">
                                {/* Assuming 'format' function is imported and works */}
                                {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div>
                                    <div className="font-semibold text-gray-900">{transaction.profile?.full_name}</div>
                                    <div className="text-xs text-gray-500">{transaction.profile?.email}</div>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 font-medium text-gray-700 max-w-[200px] truncate">
                                {transaction.projects?.name}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                                <span className="font-extrabold text-green-700">
                                    ₹{Number(transaction.amount).toFixed(2)}
                                </span>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <code className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                                    {transaction.payment_id}
                                </code>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <Badge className={getStatusColor(transaction.payment_status)}>
                                    {transaction.payment_status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* 4. No Data State Styling */}
            {transactions?.length === 0 && (
                <div className="text-center py-10 text-gray-500 border-t border-gray-100 mt-0">
                    No transactions yet
                </div>
            )}
        </div>
    )}
</Card>
  );
};

export default TransactionsViewer;
