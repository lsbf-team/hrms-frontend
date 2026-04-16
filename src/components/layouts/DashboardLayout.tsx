import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Users,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  User,
  Settings,
  LogOut,
  Bell,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const employeeMenuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Calendar, label: 'Attendance', path: '/attendance' },
  { icon: FileText, label: 'Leave', path: '/leave' },
  { icon: DollarSign, label: 'Payroll', path: '/payroll' },
];

const adminMenuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Employees', path: '/employees' },
  { icon: Calendar, label: 'Attendance', path: '/attendance' },
  { icon: FileText, label: 'Leave Management', path: '/leave-management' },
  { icon: DollarSign, label: 'Payroll', path: '/payroll-management' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [notifications] = useState(3); // Mock notifications

  const menuItems = ['admin', 'hr'].includes(user?.role || '') ? adminMenuItems : employeeMenuItems;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
              Dayflow
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        {!collapsed && user && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <p className="text-xs text-sidebar-foreground/60 mono">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold" style={{ fontFamily: 'Space Grotesk' }}>
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            {user?.role === 'admin' && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                Admin
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-accent/10"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-accent/10">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-3 hover:bg-muted/50 cursor-pointer border-b">
                    <p className="text-sm font-medium">Leave Request Approved</p>
                    <p className="text-xs text-muted-foreground mt-1">Your leave request for Jan 15-17 has been approved</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 hover:bg-muted/50 cursor-pointer border-b">
                    <p className="text-sm font-medium">New Payslip Available</p>
                    <p className="text-xs text-muted-foreground mt-1">Your December payslip is ready to download</p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                  <div className="p-3 hover:bg-muted/50 cursor-pointer">
                    <p className="text-sm font-medium">Profile Update Reminder</p>
                    <p className="text-xs text-muted-foreground mt-1">Please update your emergency contact information</p>
                    <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user && getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-grain">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
