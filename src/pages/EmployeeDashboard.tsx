import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/config';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  FileText,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  // State for dashboard data
  const [stats, setStats] = useState({
    attendanceStatus: 'Not Checked In',
    leaveBalance: { annual: 20, sick: 10, casual: 5 },
    recentActivity: [] as any[]
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;

        // Parallel fetch for efficiency
        const [attendanceRes, leaveRes] = await Promise.all([
          fetch(`${API_URL}/api/attendance/my-history`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/leave/my-leaves`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const attendanceData = await attendanceRes.json();
        const leaveData = await leaveRes.json();

        // Calculate Status
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = attendanceData.find((a: any) => a.date === today);
        let status = 'Not Checked In';
        if (todayRecord) {
          status = todayRecord.checkOut ? 'Day Completed' : 'Checked In';
        }

        // Calculate Leave Balance (Simplified logic)
        const usedLeaves = { annual: 0, sick: 0, casual: 0 };
        leaveData.forEach((l: any) => {
          if (l.status === 'approved' && usedLeaves[l.type as keyof typeof usedLeaves] !== undefined) {
            usedLeaves[l.type as keyof typeof usedLeaves] += l.days;
          }
        });

        setStats({
          attendanceStatus: status,
          leaveBalance: {
            annual: 20 - usedLeaves.annual,
            sick: 10 - usedLeaves.sick,
            casual: 5 - usedLeaves.casual
          },
          recentActivity: [
            ...(todayRecord ? [{ id: 1, type: 'attendance', desc: `Status: ${status}`, time: 'Today', status: 'success' }] : []),
            ...leaveData.slice(0, 3).map((l: any, i: number) => ({
              id: i + 2,
              type: 'leave',
              desc: `${l.type} Leave Request`,
              time: new Date(l.createdAt).toLocaleDateString(),
              status: l.status === 'approved' ? 'success' : 'warning'
            }))
          ]
        });

      } catch (error) {
        console.error('Dashboard data fetch error', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleCheckIn = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
      const res = await fetch(`${API_URL}/api/attendance/check-in`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Check-in failed');
      toast.success('Successfully checked in!');
      window.location.reload(); // Quick way to refresh dashboard data
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
      const res = await fetch(`${API_URL}/api/attendance/check-out`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Check-out failed');
      toast.success('Successfully checked out!');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Derived values for UI
  const leaveBalance = {
    annual: { used: 20 - stats.leaveBalance.annual, total: 20 },
    sick: { used: 10 - stats.leaveBalance.sick, total: 10 },
    casual: { used: 5 - stats.leaveBalance.casual, total: 5 },
  };

  const recentActivity = stats.recentActivity.length > 0 ? stats.recentActivity : [
    { id: 0, type: 'info', desc: 'No recent activity', time: '', status: 'info' }
  ];

  const thisWeekAttendance = [
    { day: 'Mon', status: 'present' },
    { day: 'Tue', status: 'present' },
    { day: 'Wed', status: 'present' },
    { day: 'Thu', status: 'present' },
    { day: 'Fri', status: 'today' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
          Welcome back, {user?.username.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">{currentDate}</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card - 2x height */}
        <Card className="lg:col-span-1 lg:row-span-2 border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user && getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{user?.username}</h3>
                <p className="text-sm text-muted-foreground mono">{user?.username}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant="outline">Employee</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Department</span>
                <span className="text-sm font-medium">Engineering</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Join Date</span>
                <span className="text-sm font-medium mono">Jan 15, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Manager</span>
                <span className="text-sm font-medium">Vivek Oberoi</span>
              </div>
            </div>

            <Button className="w-full bg-accent hover:bg-accent/90" size="lg" onClick={() => navigate('/profile')}>
              View Full Profile
            </Button>
          </CardContent>
        </Card>

        {/* Attendance Widget */}
        <Card className="lg:col-span-2 border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Today's Attendance</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
                  9:00 AM
                </p>
                <p className="text-sm text-muted-foreground">Checked in</p>
              </div>
              <Badge className="bg-success text-success-foreground">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Present
              </Badge>
            </div>

            <div className="flex gap-2">
              {stats.attendanceStatus === 'Not Checked In' ? (
                <Button className="flex-1 bg-accent hover:bg-accent/90" onClick={handleCheckIn}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Check In
                </Button>
              ) : stats.attendanceStatus === 'Checked In' ? (
                <Button className="flex-1 bg-accent hover:bg-accent/90" onClick={handleCheckOut}>
                  <Clock className="h-4 w-4 mr-2" />
                  Check Out
                </Button>
              ) : (
                <Button className="flex-1" disabled>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Day Completed
                </Button>
              )}
              <Button variant="outline" className="flex-1" onClick={() => navigate('/attendance')}>
                View History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* This Week Summary */}
        <Card className="lg:col-span-2 border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center gap-4">
              {thisWeekAttendance.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
                  <div
                    className={`w-full h-16 rounded-md flex items-center justify-center ${day.status === 'present'
                      ? 'bg-success/10 border border-success/20'
                      : day.status === 'today'
                        ? 'bg-accent/10 border border-accent/20'
                        : 'bg-muted'
                      }`}
                  >
                    {day.status === 'present' && (
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    )}
                    {day.status === 'today' && <Clock className="h-6 w-6 text-accent" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Attendance rate</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">100%</span>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Balance */}
        <Card className="lg:col-span-3 border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Leave Balance</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Annual Leave</span>
                  <span className="text-sm text-muted-foreground mono">
                    {leaveBalance.annual.used}/{leaveBalance.annual.total}
                  </span>
                </div>
                <Progress
                  value={(leaveBalance.annual.used / leaveBalance.annual.total) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {leaveBalance.annual.total - leaveBalance.annual.used} days remaining
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sick Leave</span>
                  <span className="text-sm text-muted-foreground mono">
                    {leaveBalance.sick.used}/{leaveBalance.sick.total}
                  </span>
                </div>
                <Progress
                  value={(leaveBalance.sick.used / leaveBalance.sick.total) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {leaveBalance.sick.total - leaveBalance.sick.used} days remaining
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Casual Leave</span>
                  <span className="text-sm text-muted-foreground mono">
                    {leaveBalance.casual.used}/{leaveBalance.casual.total}
                  </span>
                </div>
                <Progress
                  value={(leaveBalance.casual.used / leaveBalance.casual.total) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {leaveBalance.casual.total - leaveBalance.casual.used} days remaining
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button className="bg-accent hover:bg-accent/90" onClick={() => navigate('/leave')}>
                <FileText className="h-4 w-4 mr-2" />
                Request Leave
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-1 border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" size="lg" onClick={() => navigate('/attendance')}>
              <Calendar className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg" onClick={() => navigate('/leave')}>
              <FileText className="h-4 w-4 mr-2" />
              Apply for Leave
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg" onClick={() => navigate('/payroll')}>
              <DollarSign className="h-4 w-4 mr-2" />
              Download Payslip
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div
                    className={`mt-1 p-2 rounded-full ${activity.status === 'success'
                      ? 'bg-success/10'
                      : activity.status === 'info'
                        ? 'bg-info/10'
                        : 'bg-warning/10'
                      }`}
                  >
                    {activity.status === 'success' && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                    {activity.status === 'info' && <AlertCircle className="h-4 w-4 text-info" />}
                    {activity.status === 'warning' && (
                      <XCircle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.desc}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
