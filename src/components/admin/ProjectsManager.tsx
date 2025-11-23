import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectForm {
  name: string;
  description: string;
  long_description: string;
  price: number;
  is_free: boolean;
  technologies: string[];
  best_for: string;
  screenshot_url: string;
  features: string[];
  learning_outcomes: string[];
  setup_steps: string[];
}

const ProjectsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState<ProjectForm>({
    name: '',
    description: '',
    long_description: '',
    price: 0,
    is_free: false,
    technologies: [],
    best_for: '',
    screenshot_url: '',
    features: [],
    learning_outcomes: [],
    setup_steps: []
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProjectForm) => {
      const { error } = await supabase.from('projects').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({ title: 'Project created successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Failed to create project', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectForm> }) => {
      const { error } = await supabase.from('projects').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({ title: 'Project updated successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update project', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({ title: 'Project deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to delete project', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      long_description: '',
      price: 0,
      is_free: false,
      technologies: [],
      best_for: '',
      screenshot_url: '',
      features: [],
      learning_outcomes: [],
      setup_steps: []
    });
    setEditingProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      long_description: project.long_description,
      price: project.price,
      is_free: project.is_free,
      technologies: project.technologies || [],
      best_for: project.best_for,
      screenshot_url: project.screenshot_url,
      features: project.features || [],
      learning_outcomes: project.learning_outcomes || [],
      setup_steps: project.setup_steps || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id);
    }
  };

  const parseArrayField = (value: string) => {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  };

  return (
    <Card className="glass border-border/50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="glow-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="long_description">Long Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="is_free"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked, price: e.target.checked ? 0 : formData.price })}
                  />
                  <Label htmlFor="is_free">Free Project</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="technologies">Technologies (comma separated)</Label>
                <Input
                  id="technologies"
                  value={formData.technologies.join(', ')}
                  onChange={(e) => setFormData({ ...formData, technologies: parseArrayField(e.target.value) })}
                  placeholder="React, Node.js, MongoDB"
                  required
                />
              </div>
              <div>
                <Label htmlFor="best_for">Best For</Label>
                <Input
                  id="best_for"
                  value={formData.best_for}
                  onChange={(e) => setFormData({ ...formData, best_for: e.target.value })}
                  placeholder="BTech 3rd Year, BCA Final Year"
                  required
                />
              </div>
              <div>
                <Label htmlFor="screenshot_url">Screenshot URL</Label>
                <Input
                  id="screenshot_url"
                  type="url"
                  value={formData.screenshot_url}
                  onChange={(e) => setFormData({ ...formData, screenshot_url: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="features">Features (comma separated)</Label>
                <Textarea
                  id="features"
                  value={formData.features.join(', ')}
                  onChange={(e) => setFormData({ ...formData, features: parseArrayField(e.target.value) })}
                  placeholder="User Auth, Payment Gateway, Admin Panel"
                />
              </div>
              <div>
                <Label htmlFor="learning_outcomes">Learning Outcomes (comma separated)</Label>
                <Textarea
                  id="learning_outcomes"
                  value={formData.learning_outcomes.join(', ')}
                  onChange={(e) => setFormData({ ...formData, learning_outcomes: parseArrayField(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="setup_steps">Setup Steps (comma separated)</Label>
                <Textarea
                  id="setup_steps"
                  value={formData.setup_steps.join(', ')}
                  onChange={(e) => setFormData({ ...formData, setup_steps: parseArrayField(e.target.value) })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingProject ? 'Update Project' : 'Create Project'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  {project.is_free ? (
                    <Badge variant="secondary">Free</Badge>
                  ) : (
                    <span>₹{project.price}</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies?.slice(0, 3).map((tech: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{project.downloads_count}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(project)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default ProjectsManager;
