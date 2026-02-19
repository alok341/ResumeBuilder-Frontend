import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetResumes, apiCreateResume, apiDeleteResume } from "@/lib/api";
import type { Resume } from "@/types/resume";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileText, Trash2, Edit, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadResumes = async () => {
    try {
      const data = await apiGetResumes();
      setResumes(data);
    } catch {
      toast({ title: "Failed to load resumes", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadResumes(); }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const resume = await apiCreateResume(newTitle.trim());
      toast({ title: "Resume created!" });
      navigate(`/editor/${resume._id || resume.id}`);
    } catch (err: any) {
      toast({ title: "Failed to create", description: err.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resume?")) return;
    try {
      await apiDeleteResume(id);
      setResumes((prev) => prev.filter((r) => (r._id || r.id) !== id));
      toast({ title: "Resume deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="mt-1 text-muted-foreground">Manage your resumes</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="btn-glow">
            <Plus className="mr-2 h-4 w-4" /> New Resume
          </Button>
        </div>

        {showCreate && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card mb-8 flex items-center gap-3 rounded-xl p-4">
            <Input
              placeholder="Resume title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </Button>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="glass-card flex flex-col items-center rounded-2xl py-20 text-center">
            <FileText className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h2 className="text-xl font-semibold text-foreground">No resumes yet</h2>
            <p className="mt-1 text-muted-foreground">Create your first resume and start building!</p>
            <Button onClick={() => setShowCreate(true)} className="btn-glow mt-6">
              <Plus className="mr-2 h-4 w-4" /> Create Resume
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume, i) => {
              const id = resume._id || resume.id || "";
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card group rounded-xl p-5 transition-all hover:glow-primary"
                >
                  <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-secondary">
                    {resume.thumbnailLink ? (
                      <img src={resume.thumbnailLink} alt={resume.title} className="h-full w-full rounded-lg object-cover" />
                    ) : (
                      <FileText className="h-10 w-10 text-muted-foreground/30" />
                    )}
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground">{resume.title}</h3>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : "Just created"}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/editor/${id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
