import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  UserCheck,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { API_URL } from '@/config';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    employees: { total: 0, trend: '0' },
    attendance: { present: 0, total: 0 },
    leaves: { pending: 0 },
    payroll: { total: 0 }
  });
  const [recentEmployees, setRecentEmployees] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;

        const [analyticsRes, usersRes, leavesRes] = await Promise.all([
          fetch(`${API_URL}/api/analytics/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/leave/all?status=pending`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const analytics = await analyticsRes.json();
        const users = await usersRes.json();
        const leaves = await leavesRes.json();

        setDashboardData(analytics);
        setRecentEmployees(users.slice(0, 5));
        setPendingApprovals(leaves.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch admin dashboard data', error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: 'Total Employees',
      value: dashboardData.employees?.total?.toString() || '0',
      change: '+0',
      trend: 'neutral',
      icon: Users,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Present Today',
      value: dashboardData.attendance?.present?.toString() || '0',
      change: `${dashboardData.attendance?.total ? Math.round((dashboardData.attendance.present / dashboardData.attendance.total) * 100) : 0}%`,
      trend: 'up',
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Pending Leaves',
      value: dashboardData.leaves?.pending?.toString() || '0',
      change: 'Active',
      trend: 'neutral',
      icon: FileText,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Monthly Payroll',
      value: `$${(dashboardData.payroll?.total || 0).toLocaleString()}`,
      change: 'Current',
      trend: 'up',
      icon: DollarSign,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  const attendanceData = [
    { day: 'Mon', present: 235, absent: 13 },
    { day: 'Tue', present: 238, absent: 10 },
    { day: 'Wed', present: 240, absent: 8 },
    { day: 'Thu', present: 236, absent: 12 },
    { day: 'Fri', present: 236, absent: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">{currentDate}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : stat.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      ) : null}
                      <span
                        className={`text-xs font-medium ${stat.trend === 'up'
                          ? 'text-success'
                          : stat.trend === 'down'
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                          }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Directory */}
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Employees</CardTitle>
              <Button size="sm" className="bg-accent hover:bg-accent/90">
                <Users className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEmployees.map((employee) => (
                      <TableRow key={employee.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground mono">{employee.employeeId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department || 'General'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="mono text-sm">
                          {employee.createdAt ? format(new Date(employee.createdAt), 'MMM d, yyyy') : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {recentEmployees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">No employees found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Pending Approvals</span>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                {pendingApprovals.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {pendingApprovals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No pending approvals</p>
              ) : (
                pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="p-4 border rounded-lg hover:bg-muted/30 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{approval.employeeName || 'Employee'}</p>
                        <p className="text-xs text-muted-foreground">{approval.type}</p>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{new Date(approval.startDate).toLocaleDateString()}</span>
                      <span className="text-muted-foreground/60">•</span>
                      <span>{approval.reason}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Heatmap */}
        <Card className="lg:col-span-3 border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Weekly Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-4">
                {attendanceData.map((day) => (
                  <div key={day.day} className="space-y-3">
                    <p className="text-sm font-medium text-center">{day.day}</p>
                    <div className="space-y-2">
                      <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-success" style={{ fontFamily: 'Space Grotesk' }}>
                          {day.present}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Present</p>
                      </div>
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-destructive" style={{ fontFamily: 'Space Grotesk' }}>
                          {day.absent}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Absent</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success"></div>
                    <span className="text-sm text-muted-foreground">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive"></div>
                    <span className="text-sm text-muted-foreground">Absent</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
