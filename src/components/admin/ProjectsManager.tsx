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
import { Pencil, Trash2, Download, UploadCloud, Plus, Type, FileText, IndianRupee, Layers, GraduationCap, Image as ImageIcon, FolderArchive, ListChecks, BookOpen, Settings, X } from 'lucide-react';

interface ProjectForm {
  name: string;
  description: string;
  long_description: string;
  price: number;
  is_free: boolean;
  technologies: string;
  best_for: string;
  screenshot_url: string;
  gallery_urls: string[];
  project_file_path?: string;
  features: string;
  learning_outcomes: string;
  setup_steps: string;
}

const emptyForm = (): ProjectForm => ({
  name: '',
  description: '',
  long_description: '',
  price: 0,
  is_free: false,
  technologies: '',
  best_for: '',
  screenshot_url: '',
  gallery_urls: [],
  project_file_path: undefined,
  features: '',
  learning_outcomes: '',
  setup_steps: ''
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

  const stringToArray = (str: string) => str.split(',').map(s => s.trim()).filter(Boolean);
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
          technologies: stringToArray(data.technologies),
          best_for: data.best_for,
          screenshot_url: screenshotUrl,
          gallery_urls: galleryUrls,
          project_file_path: projectFilePath,
          features: stringToArray(data.features),
          learning_outcomes: stringToArray(data.learning_outcomes),
          setup_steps: stringToArray(data.setup_steps)
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

        const payload: any = {
          ...data,
          technologies: stringToArray(data.technologies),
          features: stringToArray(data.features),
          learning_outcomes: stringToArray(data.learning_outcomes),
          setup_steps: stringToArray(data.setup_steps),
        };
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
      technologies: project.technologies?.join(', ') || '',
      best_for: project.best_for || '',
      screenshot_url: project.screenshot_url || '',
      gallery_urls: project.gallery_urls || [],
      project_file_path: project.project_file_path || undefined,
      features: project.features?.join(', ') || '',
      learning_outcomes: project.learning_outcomes?.join(', ') || '',
      setup_steps: project.setup_steps?.join(', ') || '',
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
    <Card className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 text-black">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Manage Projects</h2>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-lg shadow-md px-5 py-2.5 transition-all flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </Button>
          </DialogTrigger>

          {/* MODAL */}
          <DialogContent className="sm:max-w-[700px] max-h-[85vh] bg-white text-gray-900 border border-gray-200 shadow-2xl rounded-2xl p-0 overflow-hidden flex flex-col">
            <DialogHeader className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {editingProject ? (
                  <Settings className="w-5 h-5 text-gray-500" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-500" />
                )}
                {editingProject ? "Edit Project Details" : "Create New Project"}
              </DialogTitle>
            </DialogHeader>

            {/* SCROLLABLE FORM AREA */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* SECTION 1: BASIC INFO */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Type className="w-4 h-4 text-gray-500" /> Project Name
                    </Label>
                    <Input
                      className="h-11 bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg"
                      placeholder="e.g. E-Commerce Dashboard"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Short Desc */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FileText className="w-4 h-4 text-gray-500" /> Short Description
                    </Label>
                    <Textarea
                      className="bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg min-h-[80px]"
                      placeholder="Brief overview for the card preview..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  {/* Long Desc */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <BookOpen className="w-4 h-4 text-gray-500" /> Detailed Description
                    </Label>
                    <Textarea
                      className="bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg min-h-[120px]"
                      placeholder="Full project details..."
                      value={formData.long_description}
                      onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-4" />

                {/* SECTION 2: METADATA GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Price */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <IndianRupee className="w-4 h-4 text-gray-500" /> Price
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        className={`h-11 bg-white border-gray-200 rounded-lg ${formData.is_free ? 'opacity-50 pointer-events-none' : ''}`}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        required={!formData.is_free}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="is_free"
                        className="rounded border-gray-300 text-black focus:ring-black"
                        checked={formData.is_free}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_free: e.target.checked,
                            price: e.target.checked ? 0 : formData.price,
                          })
                        }
                      />
                      <Label htmlFor="is_free" className="text-sm cursor-pointer select-none">Mark as Free Project</Label>
                    </div>
                  </div>

                  {/* Best For */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <GraduationCap className="w-4 h-4 text-gray-500" /> Best For
                    </Label>
                    <Input
                      className="h-11 bg-white border-gray-200 rounded-lg"
                      placeholder="e.g. BTech Final Year"
                      value={formData.best_for}
                      onChange={(e) => setFormData({ ...formData, best_for: e.target.value })}
                      required
                    />
                  </div>

                  {/* Technologies */}
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Layers className="w-4 h-4 text-gray-500" /> Technologies
                    </Label>
                    <Input
                      className="h-11 bg-white border-gray-200 rounded-lg"
                      placeholder="React, Node.js, MongoDB (Comma separated)"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-4" />

                {/* SECTION 3: MEDIA & FILES (Styled as Cards) */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-900">Media & Files</Label>

                  {/* Main Screenshot */}
                  <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <ImageIcon className="w-4 h-4" /> Main Cover Image
                        </Label>
                        <input
                          type="file"
                          accept="image/*"
                          className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                          onChange={onMainFileChange}
                        />
                      </div>
                      {/* Preview */}
                      {formData.screenshot_url && !mainFile && (
                        <div className="shrink-0">
                          <img src={formData.screenshot_url} className="h-16 w-24 rounded-lg object-cover shadow-sm border border-gray-200" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Screenshots */}
                  <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Layers className="w-4 h-4" /> Gallery Images
                      </Label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                        onChange={onGalleryChange}
                      />
                      {/* Previews Grid */}
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {(formData.gallery_urls || []).slice(0, 4).map((u, i) => (
                          <img key={i} src={u} className="h-12 w-20 rounded-md object-cover border border-gray-200" />
                        ))}
                        {galleryFiles.slice(0, 4).map((f, i) => (
                          <img key={i} src={URL.createObjectURL(f)} className="h-12 w-20 rounded-md object-cover border border-gray-200" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ZIP File */}
                  <div className="p-4 bg-blue-50/50 border border-dashed border-blue-200 rounded-xl">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <Label className="flex items-center gap-2 text-sm font-medium text-blue-900">
                          <FolderArchive className="w-4 h-4" /> Source Code (ZIP)
                        </Label>
                        <input
                          type="file"
                          accept=".zip"
                          className="text-xs text-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                          onChange={onZipChange}
                        />
                      </div>
                      {formData.project_file_path && !zipFile && (
                        <div className="px-3 py-1 bg-white rounded-md border border-blue-100 text-xs text-blue-600 font-medium truncate max-w-[150px]">
                          {formData.project_file_path.split('/').pop()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-4" />

                {/* SECTION 4: LISTS (Features, Outcomes, Steps) */}
                <div className="space-y-5">
                  {[
                    { label: 'Features', icon: ListChecks, key: 'features', placeholder: 'Feature 1, Feature 2, Feature 3' },
                    { label: 'Learning Outcomes', icon: GraduationCap, key: 'learning_outcomes', placeholder: 'Outcome 1, Outcome 2...' },
                    { label: 'Setup Steps', icon: Settings, key: 'setup_steps', placeholder: 'Step 1, Step 2...' }
                  ].map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <field.icon className="w-4 h-4 text-gray-500" /> {field.label}
                      </Label>
                      <Textarea
                        className="bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg min-h-[80px]"
                        placeholder={field.placeholder}
                        value={formData[field.key as keyof ProjectForm].toString()}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      />
                      <p className="text-[10px] text-gray-400 text-right">Comma separated values</p>
                    </div>
                  ))}
                </div>

              </form>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 bg-black text-white hover:bg-gray-800 font-medium shadow-sm"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 animate-bounce" /> Uploading...
                  </span>
                ) : (
                  editingProject ? "Save Changes" : "Create Project"
                )}
              </Button>
            </div>

          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-gray-400 border-t-black rounded-full" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-gray-100">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b border-gray-200 hover:bg-transparent">
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Project Name
                </TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stack
                </TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Downloads
                </TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {projects?.map((project) => (
                <TableRow
                  key={project.id}
                  className="group border-b border-gray-100 hover:bg-gray-50/60 transition-colors duration-200"
                >
                  {/* Name Column */}
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">
                        {project.name}
                      </span>
                      {/* Optional: Add a small ID or date below name for extra pro feel */}
                      <span className="text-[10px] text-gray-400">ID: #{project.id.toString().padStart(4, '0')}</span>
                    </div>
                  </TableCell>

                  {/* Price Column */}
                  <TableCell className="px-6 py-4">
                    {project.is_free ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Free
                      </span>
                    ) : (
                      <span className="font-medium text-gray-700 font-mono text-sm">
                        ₹{project.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </TableCell>

                  {/* Technologies Column */}
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 3).map((tech: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium border border-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="inline-flex items-center px-1.5 py-1 text-[10px] text-gray-400">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Downloads Column */}
                  <TableCell className="px-6 py-4 text-gray-600 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-gray-400" />
                      {project.downloads_count}
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="px-6 py-4 text-right" >
                    <div className="flex items-center justify-end gap-2 ">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-100/50"
                        onClick={() => handleEdit(project)}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-100/50"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {projects?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No Projects here 
            </div>
          )}
        </div>
      )}


    </Card>
  );



};

export default ProjectsManager;
