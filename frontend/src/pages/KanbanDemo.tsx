import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-gray-100',
    tasks: [
      { id: 'task-1', title: 'Setup Project Repository', description: 'Initialize Git repository and configure project structure', priority: 'high', assignee: 'John Doe' },
      { id: 'task-2', title: 'Design Database Schema', description: 'Create ERD and define database relationships', priority: 'high' },
      { id: 'task-3', title: 'Create API Documentation', description: 'Document all REST API endpoints with Swagger', priority: 'medium' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-blue-100',
    tasks: [
      { id: 'task-4', title: 'Implement Authentication', description: 'JWT-based authentication with refresh tokens', priority: 'urgent', assignee: 'Jane Smith' },
      { id: 'task-5', title: 'Build Kanban Component', description: 'Create drag & drop Kanban board with real-time updates', priority: 'high', assignee: 'Mike Johnson' },
    ],
  },
  {
    id: 'review',
    title: 'In Review',
    color: 'bg-yellow-100',
    tasks: [
      { id: 'task-6', title: 'WebSocket Integration', description: 'Implement Socket.io for real-time collaboration', priority: 'high', assignee: 'Sarah Wilson' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-green-100',
    tasks: [
      { id: 'task-7', title: 'Project Setup', description: 'Initialize React + TypeScript + Vite project', priority: 'medium' },
      { id: 'task-8', title: 'Tailwind CSS Configuration', description: 'Setup Tailwind CSS with custom theme', priority: 'low' },
    ],
  },
];

const priorityColors = {
  low: 'bg-gray-200 text-gray-800',
  medium: 'bg-blue-200 text-blue-800',
  high: 'bg-orange-200 text-orange-800',
  urgent: 'bg-red-200 text-red-800',
};

function KanbanDemo() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [realtimeActivity, setRealtimeActivity] = useState<string[]>([]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // No movement
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      const newColumns = columns.map(col =>
        col.id === sourceColumn.id ? { ...col, tasks: newTasks } : col
      );

      setColumns(newColumns);
      addRealtimeActivity(`Reordered task "${removed.title}" in ${sourceColumn.title}`);
    } else {
      // Moving to a different column
      const sourceTasks = Array.from(sourceColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, removed);

      const newColumns = columns.map(col => {
        if (col.id === sourceColumn.id) return { ...col, tasks: sourceTasks };
        if (col.id === destColumn.id) return { ...col, tasks: destTasks };
        return col;
      });

      setColumns(newColumns);
      addRealtimeActivity(`Moved task "${removed.title}" from ${sourceColumn.title} to ${destColumn.title}`);
    }
  };

  const addRealtimeActivity = (activity: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setRealtimeActivity(prev => [`[${timestamp}] ${activity}`, ...prev.slice(0, 4)]);
  };

  const getTotalTasks = () => columns.reduce((sum, col) => sum + col.tasks.length, 0);
  const getCompletedTasks = () => columns.find(col => col.id === 'done')?.tasks.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Project Stats */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Demo Project: ProjectHub Development</h2>
        <p className="text-gray-600 mb-6">Interactive Kanban Board Demonstration with Real-time Features</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalTasks()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{columns.find(c => c.id === 'in-progress')?.tasks.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{getCompletedTasks()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round((getCompletedTasks() / getTotalTasks()) * 100)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        {realtimeActivity.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Real-time Activity
            </h3>
            <div className="space-y-2">
              {realtimeActivity.map((activity, index) => (
                <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2">
                  {activity}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className={`${column.color} rounded-t-lg px-4 py-3 border-b-4 border-${column.color.replace('100', '300')}`}>
                <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                  <span>{column.title}</span>
                  <span className="bg-white px-2 py-1 rounded text-sm">{column.tasks.length}</span>
                </h3>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white rounded-b-lg p-4 min-h-[400px] flex-1 ${
                      snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400 rotate-2' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                                  {task.priority}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                              {task.assignee && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold mr-2">
                                    {task.assignee.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span>{task.assignee}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">🎯 Try the Interactive Demo!</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-2">Drag & Drop Features:</p>
            <ul className="space-y-1 ml-4">
              <li>• Drag tasks between columns</li>
              <li>• Reorder tasks within columns</li>
              <li>• Real-time activity tracking</li>
              <li>• Visual feedback on drag</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Production Features:</p>
            <ul className="space-y-1 ml-4">
              <li>• Multi-user real-time sync via WebSocket</li>
              <li>• User presence indicators</li>
              <li>• Notifications and mentions</li>
              <li>• Complete CRUD operations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KanbanDemo;
