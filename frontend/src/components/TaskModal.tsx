import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { projectService } from '../services/projectService';
import { Task, UpdateTaskInput } from '../types';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (taskId: string) => void;
}

export default function TaskModal({ task, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTaskInput>({
    defaultValues: {
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    },
  });

  const onSubmit = async (data: UpdateTaskInput) => {
    setIsSubmitting(true);
    try {
      await projectService.updateTask(task.id, data);
      toast.success('Task updated successfully');
      onUpdate();
    } catch (error: any) {
      toast.error('Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  {...register('priority')}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700"
              >
                Delete Task
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 ${
                      task.priority === 'LOW'
                        ? 'bg-gray-100 text-gray-700'
                        : task.priority === 'MEDIUM'
                        ? 'bg-blue-100 text-blue-700'
                        : task.priority === 'HIGH'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-500">{task.status}</span>
                </div>
              </div>

              {task.description && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>
                </div>
              )}

              {task.dueDate && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Due Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {task.assignee && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Assigned To</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gray-300 flex items-center justify-center text-white font-semibold mr-2">
                      {task.assignee.firstName[0]}
                      {task.assignee.lastName[0]}
                    </div>
                    <span>
                      {task.assignee.firstName} {task.assignee.lastName}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Created</p>
                <p className="text-sm text-gray-600">
                  {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700"
              >
                Delete Task
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800"
                >
                  Edit Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
