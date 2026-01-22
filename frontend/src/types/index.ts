// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'ON_HOLD';
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
  members?: ProjectMember[];
  boards?: Board[];
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user?: User;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER';
  joinedAt: string;
}

// Board Types
export interface Board {
  id: string;
  name: string;
  projectId: string;
  project?: Project;
  columns?: Column[];
  createdAt: string;
  updatedAt: string;
}

// Column Types
export interface Column {
  id: string;
  title: string;
  position: number;
  boardId: string;
  board?: Board;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  position: number;
  dueDate?: string;
  columnId: string;
  column?: Column;
  assigneeId?: string;
  assignee?: User;
  creatorId: string;
  creator?: User;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  attachments?: Attachment[];
  labels?: Label[];
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  taskId: string;
  task?: Task;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// Attachment Types
export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  taskId: string;
  task?: Task;
  uploadedById: string;
  uploadedBy?: User;
  createdAt: string;
}

// Label Types
export interface Label {
  id: string;
  name: string;
  color: string;
  projectId: string;
  project?: Project;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'COMMENT_ADDED' | 'MENTION' | 'DUE_DATE';
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  user?: User;
  taskId?: string;
  task?: Task;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form Types
export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  assigneeId?: string;
  columnId: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  assigneeId?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'ON_HOLD';
}
