// ProjectsManagerWithUploads.tsx
import { useState, useEffect } from 'react';
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
import { Plus, Pencil, Trash2, UploadCloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectForm {
  name: string;
  description: string;
  long_description: string;
  price: number;
  is_free: boolean;
  technologies: string[];
  best_for: string;
  screenshot_url: string; // public url for main image
  gallery_urls: string[];  // public urls
  project_file_path?: string; // private path in storage (not public)
  features: string[];
  learning_outcomes: string[];
  setup_steps: string[];
}

const emptyForm = (): ProjectForm => ({
  name: '',
  description: '',
  long_description: '',
  price: 0,
  is_free: false,
  technologies: [],
  best_for: '',
  screenshot_url: '',
  gallery_urls: [],
  project_file_path: undefined,
  features: [],
  learning_outcomes: [],
  setup_steps: []
});

const ProjectsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState<ProjectForm>(emptyForm());
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  // helper: parse comma string to array
  const parseArrayField = (value: string) => value.split(',').map(item => item.trim()).filter(Boolean);

  // Upload helpers
  // 1) upload image(s) to public bucket and return public urls array or single url
  const uploadImage = async (file: File, folder = ''): Promise<string | null> => {
    if (!file) return null;

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${folder}${fileName}`;

    const { error } = await supabase.storage
      .from('project-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error("Image upload error:", error);
      throw error;
    }

    // Now get public URL
    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(path);

    return data.publicUrl;  // <-- PERFECT
  };

  // 2) upload zip file to private bucket, return storage path (not public)
  const uploadZip = async (file: File, folder = ''): Promise<string | null> => {
    if (!file) return null;
    // enforce .zip
    if (!file.name.endsWith('.zip')) {
      throw new Error('Only .zip files are allowed for project upload.');
    }
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.zip`;
    const path = `${folder}${fileName}`;
    const { error } = await supabase.storage
      .from('project-files')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Zip upload error', error);
      throw error;
    }
    // store path in DB, do NOT return public url (we will create signed url when needed)
    return path;
  };

  // create / update mutations will perform uploads then insert/update DB
  const createMutation = useMutation({
    mutationFn: async (data: ProjectForm) => {
      setUploading(true);
      try {
        // 1) upload main image if chosen
        let screenshotUrl = data.screenshot_url || '';
        if (mainFile) {
          const url = await uploadImage(mainFile, 'main/');
          screenshotUrl = url || screenshotUrl;
        }

        // 2) upload gallery files if chosen
        let galleryUrls = data.gallery_urls || [];
        if (galleryFiles && galleryFiles.length > 0) {
          const uploaded = [];
          for (const f of galleryFiles) {
            const url = await uploadImage(f, 'gallery/');
            if (url) uploaded.push(url);
          }
          galleryUrls = [...galleryUrls, ...uploaded];
        }

        // 3) upload zip
        let projectFilePath = data.project_file_path;
        if (zipFile) {
          const p = await uploadZip(zipFile, 'projects/');
          projectFilePath = p || projectFilePath;
        }

        // 4) insert record with file urls/paths
        const payload = {
          name: data.name,
          description: data.description,
          long_description: data.long_description,
          price: data.price,
          is_free: data.is_free,
          technologies: data.technologies,
          best_for: data.best_for,
          screenshot_url: screenshotUrl,
          gallery_urls: galleryUrls,
          project_file_path: projectFilePath,
          features: data.features,
          learning_outcomes: data.learning_outcomes,
          setup_steps: data.setup_steps
        };

        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({ title: 'Project created successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      setUploading(false);
      toast({ title: 'Failed to create project', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectForm> }) => {
      setUploading(true);
      try {
        let screenshotUrl = data.screenshot_url;
        if (mainFile) {
          const url = await uploadImage(mainFile, `projects/${id}/main/`);
          screenshotUrl = url || screenshotUrl;
        }

        let galleryUrls = data.gallery_urls || [];
        if (galleryFiles && galleryFiles.length > 0) {
          const uploaded = [];
          for (const f of galleryFiles) {
            const url = await uploadImage(f, `projects/${id}/gallery/`);
            if (url) uploaded.push(url);
          }
          galleryUrls = [...(galleryUrls || []), ...uploaded];
        }

        let projectFilePath = data.project_file_path;
        if (zipFile) {
          const p = await uploadZip(zipFile, `projects/${id}/files/`);
          projectFilePath = p || projectFilePath;
        }

        const payload: any = { ...data };
        if (screenshotUrl) payload.screenshot_url = screenshotUrl;
        if (galleryUrls) payload.gallery_urls = galleryUrls;
        if (projectFilePath) payload.project_file_path = projectFilePath;

        const { error } = await supabase.from('projects').update(payload).eq('id', id);
        if (error) throw error;
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({ title: 'Project updated successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      setUploading(false);
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
    setFormData(emptyForm());
    setEditingProject(null);
    setMainFile(null);
    setGalleryFiles([]);
    setZipFile(null);
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
      name: project.name || '',
      description: project.description || '',
      long_description: project.long_description || '',
      price: project.price || 0,
      is_free: project.is_free || false,
      technologies: project.technologies || [],
      best_for: project.best_for || '',
      screenshot_url: project.screenshot_url || '',
      gallery_urls: project.gallery_urls || [],
      project_file_path: project.project_file_path || undefined,
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

  // UI file input handlers
  const onMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainFile(e.target.files[0]);
    }
  };

  const onGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const arr = Array.from(e.target.files);
      setGalleryFiles(arr);
    }
  };

  const onZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (!f.name.endsWith('.zip')) {
        toast({ title: 'Only .zip files allowed', variant: 'destructive' });
        return;
      }
      setZipFile(f);
    }
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
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>

              <div>
                <Label htmlFor="long_description">Long Description</Label>
                <Textarea id="long_description" value={formData.long_description} onChange={(e) => setFormData({ ...formData, long_description: e.target.value })} rows={5} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required={!formData.is_free} />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input type="checkbox" id="is_free" checked={formData.is_free} onChange={(e) => setFormData({ ...formData, is_free: e.target.checked, price: e.target.checked ? 0 : formData.price })} />
                  <Label htmlFor="is_free">Free Project</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="technologies">Technologies (comma separated)</Label>
                <Input id="technologies" value={formData.technologies.join(', ')} onChange={(e) => setFormData({ ...formData, technologies: parseArrayField(e.target.value) })} placeholder="React, Node.js, MongoDB" required />
              </div>

              <div>
                <Label htmlFor="best_for">Best For</Label>
                <Input id="best_for" value={formData.best_for} onChange={(e) => setFormData({ ...formData, best_for: e.target.value })} placeholder="BTech 3rd Year, BCA Final Year" required />
              </div>

              {/* IMAGE UPLOADS */}
              <div>
                <Label>Main UI Screenshot (recommended 1200x700)</Label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={onMainFileChange} />
                  {formData.screenshot_url && !mainFile && (
                    <img src={formData.screenshot_url} alt="main" className="h-12 w-20 object-cover rounded" />
                  )}
                </div>
              </div>

              <div>
                <Label>Gallery Screenshots (multiple allowed)</Label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" multiple onChange={onGalleryChange} />
                  <div className="flex gap-2">
                    {formData.gallery_urls?.slice(0, 4).map((u, i) => (
                      <img key={i} src={u} alt={`g${i}`} className="h-12 w-20 object-cover rounded" />
                    ))}
                    {galleryFiles.slice(0, 4).map((f, i) => (
                      <img key={i} src={URL.createObjectURL(f)} alt={`new${i}`} className="h-12 w-20 object-cover rounded" />
                    ))}
                  </div>
                </div>
              </div>

              {/* ZIP upload */}
              <div>
                <Label>Project .zip (only .zip allowed)</Label>
                <div className="flex items-center gap-3">
                  <input type="file" accept=".zip" onChange={onZipChange} />
                  {formData.project_file_path && !zipFile && <span className="text-sm text-muted-foreground">{formData.project_file_path}</span>}
                </div>
              </div>

              <div>
                <Label htmlFor="features">Features (comma separated)</Label>
                <Textarea id="features" value={formData.features.join(', ')} onChange={(e) => setFormData({ ...formData, features: parseArrayField(e.target.value) })} placeholder="User Auth, Payment Gateway, Admin Panel" />
              </div>

              <div>
                <Label htmlFor="learning_outcomes">Learning Outcomes (comma separated)</Label>
                <Textarea id="learning_outcomes" value={formData.learning_outcomes.join(', ')} onChange={(e) => setFormData({ ...formData, learning_outcomes: parseArrayField(e.target.value) })} />
              </div>

              <div>
                <Label htmlFor="setup_steps">Setup Steps (comma separated)</Label>
                <Textarea id="setup_steps" value={formData.setup_steps.join(', ')} onChange={(e) => setFormData({ ...formData, setup_steps: parseArrayField(e.target.value) })} />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={uploading}>
                  {uploading ? 'Uploading...' : editingProject ? 'Update Project' : 'Create Project'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { resetForm(); setIsDialogOpen(false); }}>
                  Cancel
                </Button>
              </div>
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
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
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
