import { API_URL } from '@/config';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function LeavePage() {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        type: 'ANNUAL',
        startDate: '',
        endDate: '',
        status: 'PENDING',
        reason: ''
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        try {
            const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
            const res = await fetch(`${API_URL}/api/auth/leave`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    days: diffDays
                })
            });

            if (!res.ok) throw new Error('Failed to submit request');

            toast.success('Leave requested successfully');
            fetchLeaves();
            setFormData({ type: 'ANNUAL', startDate: '', endDate: '', reason: '', status: 'PENDING' }); // Reset
        } catch (error) {
            toast.error('Error submitting request');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display">Leave Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle>Request Leave</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Leave Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ANNUAL">Annual Leave</SelectItem>
                                        <SelectItem value="SICK">Sick Leave</SelectItem>
                                        <SelectItem value="CASUAL">Casual Leave</SelectItem>
                                        <SelectItem value="MATERNITY">Maternity Leave</SelectItem>
                                        <SelectItem value="PATERNITY">Paternity Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    required
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    required
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Reason</Label>
                                <Input
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                            <Button type="submit" className="w-full">Submit Request</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>My Leaves</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {leaves.map((leave: any) => (
                                <div key={leave.id} className="flex justify-between items-center p-4 border rounded-lg">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold capitalize">{leave.type} Leave</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {leave.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {leave.startDate} to {leave.endDate} ({leave.days} days)
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(leave.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                            {leaves.length === 0 && <p className="text-center text-muted-foreground">No leave history</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
