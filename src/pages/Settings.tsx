import { API_URL } from '@/config';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwords.new.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
            const res = await fetch(`${API_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update password');

            toast.success('Password updated successfully');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold font-display">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the interface theme</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium">Theme Preference</p>
                            <p className="text-sm text-muted-foreground">
                                Current: <span className="capitalize">{theme}</span>
                            </p>
                        </div>
                        <Button variant="outline" size="icon" onClick={toggleTheme}>
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your password and account security</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input
                                type="password"
                                required
                                value={passwords.current}
                                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                required
                                value={passwords.new}
                                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm New Password</Label>
                            <Input
                                type="password"
                                required
                                value={passwords.confirm}
                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
