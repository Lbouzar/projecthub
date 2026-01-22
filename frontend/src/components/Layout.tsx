import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { notificationService, Notification } from '../services/notificationService';
import { toast } from 'react-toastify';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, refreshToken, logout } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  useEffect(() => {
    loadNotifications();
    // Reload notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      // Silently fail
    }
  };

  const handleAcceptInvitation = async (notificationId: string) => {
    setIsLoadingNotifications(true);
    try {
      await notificationService.acceptInvitation(notificationId);
      toast.success('Invitation accepted!');
      loadNotifications();
      setShowNotifications(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept invitation');
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleDeclineInvitation = async (notificationId: string) => {
    setIsLoadingNotifications(true);
    try {
      await notificationService.declineInvitation(notificationId);
      toast.success('Invitation declined');
      loadNotifications();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to decline invitation');
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/projects" className="flex items-center">
                <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PH</span>
                </div>
                <span className="ml-3 text-lg font-semibold text-gray-900">ProjectHub</span>
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  to="/projects"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Projects
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-700 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-gray-100 ${
                              !notification.isRead ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {notification.type === 'PROJECT_INVITED' && !notification.isRead && (
                              <div className="mt-3 flex space-x-2">
                                <button
                                  onClick={() => handleAcceptInvitation(notification.id)}
                                  disabled={isLoadingNotifications}
                                  className="flex-1 px-3 py-1 bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-50"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleDeclineInvitation(notification.id)}
                                  disabled={isLoadingNotifications}
                                  className="flex-1 px-3 py-1 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 border border-gray-300 hover:border-gray-400"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
