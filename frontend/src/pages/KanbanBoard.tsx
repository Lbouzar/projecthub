import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { projectService } from '../services/projectService';
import { Column, Task, Project } from '../types';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import TaskModal from '../components/TaskModal';
import CreateTaskModal from '../components/CreateTaskModal';
import InviteMemberModal from '../components/InviteMemberModal';

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
};

interface ColumnWithTasks extends Column {
  tasks: Task[];
}

export default function KanbanBoard() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalColumnId, setCreateModalColumnId] = useState<string>('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const projectData = await projectService.getProject(projectId!);
      setProject(projectData);

      const boards = await projectService.getProjectBoards(projectId!);
      if (boards.length > 0) {
        const boardColumns = await projectService.getBoardColumns(boards[0].id);
        
        const columnsWithTasks = await Promise.all(
          boardColumns.map(async (column) => {
            const tasks = await projectService.getColumnTasks(column.id);
            return { ...column, tasks };
          })
        );

        setColumns(columnsWithTasks.sort((a, b) => a.position - b.position));
      }
    } catch (error: any) {
      toast.error('Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find((col) => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const task = sourceColumn.tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Optimistic update
    const newColumns = [...columns];
    const sourceIdx = newColumns.findIndex((col) => col.id === source.droppableId);
    const destIdx = newColumns.findIndex((col) => col.id === destination.droppableId);

    // Remove from source
    newColumns[sourceIdx] = {
      ...newColumns[sourceIdx],
      tasks: newColumns[sourceIdx].tasks.filter((t) => t.id !== draggableId),
    };

    // Add to destination
    const updatedTask = { ...task, columnId: destination.droppableId };
    newColumns[destIdx] = {
      ...newColumns[destIdx],
      tasks: [
        ...newColumns[destIdx].tasks.slice(0, destination.index),
        updatedTask,
        ...newColumns[destIdx].tasks.slice(destination.index),
      ],
    };

    setColumns(newColumns);

    // Update backend
    try {
      await projectService.moveTask(draggableId, destination.droppableId, destination.index);
    } catch (error) {
      toast.error('Failed to move task');
      loadProjectData(); // Reload on error
    }
  };

  const handleOpenCreateModal = (columnId: string) => {
    setCreateModalColumnId(columnId);
    setIsCreateModalOpen(true);
  };

  const handleTaskCreated = () => {
    loadProjectData();
    setIsCreateModalOpen(false);
  };

  const handleTaskUpdated = () => {
    loadProjectData();
    setSelectedTask(null);
  };

  const handleTaskDeleted = async (taskId: string) => {
    try {
      await projectService.deleteTask(taskId);
      toast.success('Task deleted');
      loadProjectData();
      setSelectedTask(null);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading board...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
            {project?.description && (
              <p className="mt-1 text-sm text-gray-600">{project.description}</p>
            )}
          </div>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium"
          >
            Invite Team
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col">
                <div className="bg-gray-100 px-4 py-3 border-b-2 border-gray-300">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <span className="bg-white px-2 py-1 text-sm text-gray-600">
                      {column.tasks.length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-gray-50 p-4 min-h-[500px] flex-1 ${
                        snapshot.isDraggingOver ? 'bg-gray-100' : ''
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
                                onClick={() => setSelectedTask(task)}
                                className={`bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow ${
                                  snapshot.isDragging ? 'shadow-lg border-gray-400' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-gray-900 text-sm flex-1">
                                    {task.title}
                                  </h4>
                                  <span
                                    className={`text-xs px-2 py-1 ml-2 ${
                                      priorityColors[task.priority]
                                    }`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                                {task.description && (
                                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                                {task.assignee && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <div className="w-6 h-6 bg-gray-300 flex items-center justify-center text-white font-semibold mr-2">
                                      {task.assignee.firstName[0]}
                                      {task.assignee.lastName[0]}
                                    </div>
                                    <span>
                                      {task.assignee.firstName} {task.assignee.lastName}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                      <button
                        onClick={() => handleOpenCreateModal(column.id)}
                        className="w-full mt-3 py-2 border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900 text-sm"
                      >
                        Add task
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdated}
          onDelete={handleTaskDeleted}
        />
      )}

      {isCreateModalOpen && (
        <CreateTaskModal
          columnId={createModalColumnId}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleTaskCreated}
        />
      )}

      {isInviteModalOpen && (
        <InviteMemberModal
          projectId={projectId!}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={() => {
            setIsInviteModalOpen(false);
            loadProjectData();
          }}
        />
      )}
    </Layout>
  );
}
