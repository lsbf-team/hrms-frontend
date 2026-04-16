import { API_URL } from '@/config';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminPayrollManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        userId: '',
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        basicSalary: '',
        bonuses: '0',
        deductions: '0'
    });

    useEffect(() => {
        const fetchUsers = async () => {
            const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
            const res = await fetch(`${API_URL}/api/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
            const res = await fetch(`${API_URL}/api/payroll/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to generate payslip');

            toast.success('Payslip generated successfully');
            setFormData({ ...formData, userId: '', basicSalary: '', bonuses: '0', deductions: '0' });
        } catch (error) {
            toast.error('Failed to generate payslip');
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold font-display">Payroll Management</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Generate Payslip</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Employee</Label>
                            <Select value={formData.userId} onValueChange={v => setFormData({ ...formData, userId: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                                <SelectContent>
                                    {users.map(u => (
                                        <SelectItem key={u.id} value={u.id}>{u.name} ({u.employeeId})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Month</Label>
                            <Input type="month" value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })} required />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Basic Salary</Label>
                                <Input type="number" value={formData.basicSalary} onChange={e => setFormData({ ...formData, basicSalary: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Bonuses</Label>
                                <Input type="number" value={formData.bonuses} onChange={e => setFormData({ ...formData, bonuses: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Deductions</Label>
                                <Input type="number" value={formData.deductions} onChange={e => setFormData({ ...formData, deductions: e.target.value })} />
                            </div>
                        </div>

                        <Button type="submit" className="w-full">Generate Payslip</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
