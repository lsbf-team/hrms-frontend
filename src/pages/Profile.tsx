import { API_URL } from '@/config';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.username || '',
                email: user.email || '',
                phone: user.phone || '+1 (555) 000-0000', // Default if missing
                address: user.address || '123 Business Rd, Tech City' // Default if missing
            });
        }
    }, [user]);

    if (!user) return null;

    const initials = user.username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    const handleSave = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('dayflow_user') || '{}').token;
            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address
                })
            });

            if (!res.ok) throw new Error('Failed to update profile');

            const updatedUser = await res.json();
            // Preserve token from existing user state
            setUser({ ...user, ...updatedUser });
            // Update local storage
            const stored = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
            localStorage.setItem('dayflow_user', JSON.stringify({ ...stored, ...updatedUser }));

            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-display">My Profile</h1>
                <Button
                    variant={isEditing ? "destructive" : "outline"}
                    onClick={() => {
                        if (isEditing) {
                            // Reset form on cancel
                            setFormData({
                                name: user.username || '',
                                email: user.email || '',
                                phone: user.phone || '+1 (555) 000-0000',
                                address: user.address || '123 Business Rd, Tech City'
                            });
                        }
                        setIsEditing(!isEditing);
                    }}
                >
                    {isEditing ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Pencil className="w-4 h-4 mr-2" /> Edit Profile</>}
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left space-y-1 flex-1">
                            {isEditing ? (
                                <Input
                                    className="text-2xl font-bold max-w-xs mx-auto md:mx-0"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            ) : (
                                <h2 className="text-2xl font-bold">{user.username}</h2>
                            )}
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="flex gap-2 justify-center md:justify-start mt-2">
                                <Badge>{user.role}</Badge>
                                <Badge variant="outline" className="font-mono">{user.email}</Badge>
                            </div>
                        </div>
                        {isEditing && (
                            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm text-muted-foreground">Full Name</Label>
                            {isEditing ? (
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            ) : (
                                <p className="font-medium">{user.username}</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Email Address</Label>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Phone</Label>
                            {isEditing ? (
                                <Input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            ) : (
                                <p className="font-medium">{formData.phone}</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Address</Label>
                            {isEditing ? (
                                <Input
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            ) : (
                                <p className="font-medium">{formData.address}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Employment Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm text-muted-foreground">Employee ID</Label>
                            <p className="font-medium font-mono">{user.email}</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Department</Label>
                            <p className="font-medium">Engineering</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Position</Label>
                            <p className="font-medium">Software Engineer</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Joining Date</Label>
                            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
