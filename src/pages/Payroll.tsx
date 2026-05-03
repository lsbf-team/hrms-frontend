import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, DollarSign } from 'lucide-react';
import { generatePayslip } from '@/lib/pdfGenerator';
import { API_URL } from '@/config';

export default function PayrollPage() {
    const { user } = useAuth();
    const [slips, setSlips] = useState<any[]>([]);

    useEffect(() => {
        const fetchSlips = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
                const res = await fetch(`${API_URL}/api/auth/payslip/fetch`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setSlips(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSlips();
    }, []);

    const handleDownload = (slip: any) => {
        if (user) {
            generatePayslip(user, slip);
            toast.success(`Downloaded payslip for ${slip.month}`);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display">Payroll</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {slips.map((slip: any) => (
                    <Card key={slip.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">{slip.month}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-4">
                                ${(Number(slip.netSalary) || ((Number(slip.basicSalary) || 0) + (Number(slip.allowances) || 0) - (Number(slip.deductions) || 0))).toLocaleString()}
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Basic Salary</span>
                                    <span>${(Number(slip.basicSalary) || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Allowances</span>
                                    <span className="text-green-600">+${(Number(slip.allowances) || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Deductions</span>
                                    <span className="text-red-600">-${(Number(slip.deductions) || 0).toLocaleString()}</span>
                                </div>
                                <div className="pt-4 mt-4 border-t">
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={() => handleDownload(slip)}
                                    >
                                        <Download className="mr-2 h-4 w-4" /> Download Slip
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {slips.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                        <p>No payslips generated yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
