import { api } from '../lib/axios';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data.data || [];
  },

  markAsRead: async (id: string) => {
    await api.put(`/notifications/${id}/read`);
  },

  acceptInvitation: async (id: string) => {
    await api.post(`/notifications/${id}/accept`);
  },

  declineInvitation: async (id: string) => {
    await api.post(`/notifications/${id}/decline`);
  },
};
