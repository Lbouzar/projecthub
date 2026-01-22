import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Redirect authenticated users to projects
  useEffect(() => {
    if (user) {
      navigate('/projects');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
                <span className="text-white font-bold text-sm">PH</span>
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-900">ProjectHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Collaborate. Organize. Deliver.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A powerful project management platform designed for modern teams. 
            Manage tasks, collaborate in real-time, and ship projects faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gray-900 text-white px-8 py-3 text-lg font-medium hover:bg-gray-800 inline-block"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border-2 border-gray-900 text-gray-900 px-8 py-3 text-lg font-medium hover:bg-gray-50 inline-block"
            >
              Sign In
            </Link>
          </div>
          
          {/* Kanban Board Preview */}
          <div className="mt-16 border border-gray-200 shadow-xl bg-white p-6 max-w-6xl mx-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Website Redesign Project</h3>
              <p className="text-sm text-gray-600">Marketing Team</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* To Do Column */}
              <div className="bg-gray-50 min-h-[300px]">
                <div className="bg-gray-100 px-3 py-2 border-b-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-gray-900">To Do</h4>
                    <span className="bg-white px-2 py-0.5 text-xs text-gray-600">3</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="bg-white border border-gray-200 p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-medium text-gray-900">Design new homepage</p>
                      <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700">HIGH</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Create mockups for landing page</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 shadow-sm">
                    <p className="text-xs font-medium text-gray-900">Setup analytics</p>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 inline-block mt-1">LOW</span>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 shadow-sm">
                    <p className="text-xs font-medium text-gray-900">Update documentation</p>
                  </div>
                </div>
              </div>

              {/* In Progress Column */}
              <div className="bg-gray-50 min-h-[300px]">
                <div className="bg-gray-100 px-3 py-2 border-b-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-gray-900">In Progress</h4>
                    <span className="bg-white px-2 py-0.5 text-xs text-gray-600">2</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="bg-white border border-gray-200 p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-medium text-gray-900">Build contact form</p>
                      <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700">MEDIUM</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="w-5 h-5 bg-gray-300 flex items-center justify-center text-white text-xs font-semibold">
                        JD
                      </div>
                      <span className="text-xs text-gray-500 ml-1">John Doe</span>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 shadow-sm">
                    <p className="text-xs font-medium text-gray-900">Optimize images</p>
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 inline-block mt-1">MEDIUM</span>
                  </div>
                </div>
              </div>

              {/* In Review Column */}
              <div className="bg-gray-50 min-h-[300px]">
                <div className="bg-gray-100 px-3 py-2 border-b-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-gray-900">In Review</h4>
                    <span className="bg-white px-2 py-0.5 text-xs text-gray-600">1</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="bg-white border border-gray-200 p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-medium text-gray-900">Mobile responsive layout</p>
                      <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700">URGENT</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Test on various devices</p>
                    <div className="flex items-center mt-2">
                      <div className="w-5 h-5 bg-gray-300 flex items-center justify-center text-white text-xs font-semibold">
                        SM
                      </div>
                      <span className="text-xs text-gray-500 ml-1">Sarah Miller</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Done Column */}
              <div className="bg-gray-50 min-h-[300px]">
                <div className="bg-gray-100 px-3 py-2 border-b-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-gray-900">Done</h4>
                    <span className="bg-white px-2 py-0.5 text-xs text-gray-600">2</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="bg-white border border-gray-200 p-3 shadow-sm opacity-75">
                    <p className="text-xs font-medium text-gray-900">Update color scheme</p>
                    <div className="flex items-center mt-2">
                      <div className="w-5 h-5 bg-gray-300 flex items-center justify-center text-white text-xs font-semibold">
                        AJ
                      </div>
                      <span className="text-xs text-gray-500 ml-1">Alex Johnson</span>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 shadow-sm opacity-75">
                    <p className="text-xs font-medium text-gray-900">Fix navigation menu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage projects
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features that help teams stay organized and productive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-900 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kanban Boards</h3>
              <p className="text-gray-600">
                Visual task management with drag-and-drop functionality. Organize work into customizable columns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-900 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Invite team members, assign tasks, and collaborate in real-time on shared projects.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-900 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Notifications</h3>
              <p className="text-gray-600">
                Stay updated with instant notifications for invitations, task updates, and team activities.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-900 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Management</h3>
              <p className="text-gray-600">
                Create, edit, and prioritize tasks with descriptions, due dates, and assignees.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-900 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security and role-based access control.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-900 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Intuitive</h3>
              <p className="text-gray-600">
                Lightning-fast performance with a clean, intuitive interface that teams love to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get started in minutes
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to transform how your team works
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Projects</h3>
              <p className="text-gray-600">
                Sign up and create your first project in seconds. Organize your work into boards and columns.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Invite Your Team</h3>
              <p className="text-gray-600">
                Add team members by email and assign roles. Collaborate on projects together.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Tasks</h3>
              <p className="text-gray-600">
                Create tasks, set priorities, and track progress. Watch your projects move forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get organized?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join teams around the world using ProjectHub to manage their projects
          </p>
          <Link
            to="/register"
            className="bg-white text-gray-900 px-8 py-3 text-lg font-medium hover:bg-gray-100 inline-block"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
                <span className="text-white font-bold text-sm">PH</span>
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-900">ProjectHub</span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2026 ProjectHub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
