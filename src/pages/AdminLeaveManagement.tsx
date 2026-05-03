import { API_URL } from '@/config';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLeaveManagement() {
    const [leaves, setLeaves] = useState<any[]>([]);

    const fetchLeaves = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
            const res = await fetch(`${API_URL}/api/auth/leave/fetch`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setLeaves(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        // Since we don't have a specific approve/reject endpoint in the initial setup, we might need to add it or use a generic update if available.
        // Looking at previous session, we only made /api/leave/request and /api/leave/my-leaves and /api/leave/all.
        // I need to add an endpoint to update leave status in the backend first. 
        // For now, I'll assume I will add PUT /api/leave/:id/status
        try {
            const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
            const res = await fetch(`${API_URL}/api/auth/leave/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!res.ok) throw new Error('Failed to update leave status');

            toast.success(`Leave ${status}`);
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display">Leave Management</h1>

            <div className="grid gap-4">
                {leaves.map((leave) => (
                    <Card key={leave.id}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg">{leave.employeeName || 'Employee'}</h3>
                                    <Badge variant={leave.status === 'pending' ? 'outline' : leave.status === 'approved' ? 'default' : 'destructive'}>
                                        {leave.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Type: {leave.type}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm mt-2 font-medium">Reason: {leave.reason}</p>
                            </div>

                            {leave.status === 'pending' && (
                                <div className="flex gap-2">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAction(leave.id, 'approved')}>
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleAction(leave.id, 'rejected')}>
                                        <XCircle className="w-4 h-4 mr-2" /> Reject
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {leaves.length === 0 && <p className="text-center text-muted-foreground">No leave requests found.</p>}
            </div>
        </div>
    );
}
