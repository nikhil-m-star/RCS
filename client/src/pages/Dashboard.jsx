import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Plus, Trash2, Folder, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Navbar } from '../components/layout/Navbar';

const API_BASE = 'http://localhost:5000/api';

export function Dashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      await axios.post(`${API_BASE}/projects`, newProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewProject({ name: '', description: '' });
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API_BASE}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 container">
      <Navbar />
      <div className="hero-glow"></div>

      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Command Dashboard</h1>
          <p className="text-text-muted">Welcome back, {user?.firstName || 'Commander'}. Monitoring all regional sectors.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Initialize Project
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass rounded-3xl p-20 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Folder size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">No Projects Detected</h3>
            <p className="text-text-muted">Initiate your first regional operation to begin monitoring.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass rounded-3xl p-6 group hover:translate-y-[-4px] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Folder size={24} />
                </div>
                <button 
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-2 text-text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-text-muted text-sm line-clamp-2 mb-6 h-10">
                {project.description || 'No description provided for this regional operation.'}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border-glass">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Clock size={14} />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <button className="text-primary flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Open System
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Initialize Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <form 
            onSubmit={handleCreateProject}
            className="glass w-full max-w-md rounded-3xl p-8 z-10 relative animate-in fade-in zoom-in duration-300"
          >
            <h2 className="text-2xl font-bold mb-6">Initialize New Project</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Project Name</label>
                <input 
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-border-glass rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. Sector-7 Monitoring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Description</label>
                <textarea 
                  rows="3"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full bg-slate-900/50 border border-border-glass rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Summarize the regional operation mission..."
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-border-glass hover:bg-white/5 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 btn-primary"
              >
                Launch Sector
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
