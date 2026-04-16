import { API_URL } from '@/config';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendancePage() {
    const { user } = useAuth();
    const [history, setHistory] = useState<any[]>([]);
    const [todayRecord, setTodayRecord] = useState<any>(null);

    const fetchHistory = async () => {
        if (!user) return;
        try {
            const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
            const res = await fetch(`${API_URL}/api/attendance/my-history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setHistory(data);

            const today = new Date().toISOString().split('T')[0];
            setTodayRecord(data.find((d: any) => d.date === today));
        } catch (error) {
            console.error('Failed to fetch attendance', error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const handleCheckIn = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
            const res = await fetch(`${API_URL}/api/attendance/check-in`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error('Check-in failed');
            toast.success('Checked in successfully!');
            fetchHistory();
        } catch (error) {
            toast.error('Failed to check in');
        }
    };

    const handleCheckOut = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
            const res = await fetch(`${API_URL}/api/attendance/check-out`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error('Check-out failed');
            toast.success('Checked out successfully!');
            fetchHistory();
        } catch (error) {
            toast.error('Failed to check out');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display">Attendance</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Today's Status</CardTitle></CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="text-center p-6 bg-muted rounded-lg">
                            {todayRecord ? (
                                <>
                                    <p className="text-2xl font-bold mb-2">
                                        {todayRecord.checkOut ? 'Day Completed' : 'Checked In'}
                                    </p>
                                    <p className="text-muted-foreground">
                                        In: {new Date(todayRecord.checkIn).toLocaleTimeString()}
                                        {todayRecord.checkOut && ` - Out: ${new Date(todayRecord.checkOut).toLocaleTimeString()}`}
                                    </p>
                                </>
                            ) : (
                                <p className="text-xl text-muted-foreground">Not checked in yet</p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={handleCheckIn}
                                disabled={!!todayRecord}
                            >
                                Check In
                            </Button>
                            <Button
                                className="flex-1 bg-orange-600 hover:bg-orange-700"
                                onClick={handleCheckOut}
                                disabled={!todayRecord || !!todayRecord.checkOut}
                            >
                                Check Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Total Present</span>
                                <span className="font-bold">{history.filter(h => h.status === 'present').length} Days</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Attendance History</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {history.map((record: any) => (
                            <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${record.status === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {record.status === 'present' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(record.checkIn).toLocaleTimeString()} -
                                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : ' Active'}
                                        </p>
                                    </div>
                                </div>
                                <span className="capitalize text-sm font-medium">{record.status}</span>
                            </div>
                        ))}
                        {history.length === 0 && <p className="text-center text-muted-foreground">No records found</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
