import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectsManager from '@/components/admin/ProjectsManager';
import RequestsViewer from '@/components/admin/RequestsViewer';
import TransactionsViewer from '@/components/admin/TransactionsViewer';
import { LayoutDashboard, Package, FileText, CreditCard, Users } from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';

const Admin = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8" />
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Manage projects, view requests, and track transactions</p>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 glass">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Custom Requests
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="requests">
            <RequestsViewer />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsViewer />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
