import { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/sonner';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DashboardLayout from './components/layouts/DashboardLayout';
import ProfilePage from './pages/Profile';
import AttendancePage from './pages/Attendance';
import LeavePage from './pages/Leave';
import PayrollPage from './pages/Payroll';
import SettingsPage from './pages/Settings';
import EmployeesPage from './pages/Employees';
import AdminLeaveManagement from './pages/AdminLeaveManagement';
import AdminPayrollManagement from './pages/AdminPayrollManagement';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Dashboard router based on role
function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN' || user?.role === 'HR') {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* Public routes */}
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AttendancePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LeavePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Duplicate route for navigation consistency if needed */}
      <Route
        path="/leave-management"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminLeaveManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payroll"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PayrollPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Employees route (Admin only, keeping placeholder for now or reuse Profile for list if needed, but staying minimal) */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EmployeesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ... rest of routes ... */}

      <Route
        path="/payroll-management"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminPayrollManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          }
        >
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
