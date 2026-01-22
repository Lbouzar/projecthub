import { api } from '../lib/axios';
import { Project, Board, Column, Task, CreateTaskInput, UpdateTaskInput, ApiResponse } from '../types';

export const projectService = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    // Handle different response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.data?.projects && Array.isArray(response.data.data.projects)) {
      return response.data.data.projects;
    }
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  },

  createProject: async (data: { name: string; description?: string }): Promise<Project> => {
    const response = await api.post('/projects', data);
    // Handle different response structures
    if ((response.data as any).data?.project) {
      return (response.data as any).data.project;
    }
    if (response.data.data) {
      return response.data.data as Project;
    }
    if ((response.data as any).project) {
      return (response.data as any).project;
    }
    return response.data as any;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data!;
  },

  // Boards
  getProjectBoards: async (projectId: string): Promise<Board[]> => {
    const response = await api.get<ApiResponse<Board[]>>(`/projects/${projectId}/boards`);
    return response.data.data || [];
  },

  getBoard: async (boardId: string): Promise<Board> => {
    const response = await api.get<ApiResponse<Board>>(`/boards/${boardId}`);
    return response.data.data!;
  },

  // Columns
  getBoardColumns: async (boardId: string): Promise<Column[]> => {
    const response = await api.get<ApiResponse<Column[]>>(`/boards/${boardId}/columns`);
    return response.data.data || [];
  },

  // Tasks
  getColumnTasks: async (columnId: string): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>(`/columns/${columnId}/tasks`);
    return response.data.data || [];
  },

  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>(`/columns/${data.columnId}/tasks`, data);
    return response.data.data!;
  },

  updateTask: async (taskId: string, data: UpdateTaskInput): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${taskId}`, data);
    return response.data.data!;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },

  moveTask: async (taskId: string, columnId: string, position: number): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${taskId}/move`, {
      columnId,
      position,
    });
    return response.data.data!;
  },

  // Members
  getProjectMembers: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/members`);
    return response.data.data;
  },

  inviteMember: async (projectId: string, email: string, role: string = 'MEMBER') => {
    const response = await api.post(`/projects/${projectId}/members`, { email, role });
    return response.data.data;
  },

  removeMember: async (projectId: string, memberId: string) => {
    await api.delete(`/projects/${projectId}/members/${memberId}`);
  },
};
