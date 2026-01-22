import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import CreateProjectModal from '../components/CreateProjectModal';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error: any) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = () => {
    loadProjects();
    setIsCreateModalOpen(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading projects...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium"
          >
            Create Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white shadow border border-gray-200 px-4 py-12 text-center">
            <p className="text-gray-500 mb-4">No projects found</p>
            <p className="text-sm text-gray-400">Create your first project to get started</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 text-sm"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white shadow border border-gray-200 hover:border-gray-400 transition-colors p-6 block"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={`px-2 py-1 ${
                      project.status === 'ACTIVE'
                        ? 'bg-gray-100 text-gray-800'
                        : project.status === 'ARCHIVED'
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleProjectCreated}
        />
      )}
    </Layout>
  );
}
