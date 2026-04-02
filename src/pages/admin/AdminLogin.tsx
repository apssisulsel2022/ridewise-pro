import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types/shuttle';

const AdminLogin = () => {
  const [email, setEmail] = useState('superadmin@shuttle.com');
  const [password, setPassword] = useState('superadmin');
  const [role, setRole] = useState<UserRole>('superadmin');
  const { login } = useShuttle();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password, role);
    if (success) {
      toast.success(`Berhasil masuk sebagai ${role}`);
      // Give state time to propagate before navigation
      setTimeout(() => {
        navigate(role === 'superadmin' ? '/superadmin' : '/admin');
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center pb-2">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <CardTitle className="text-2xl font-black">Admin Access</CardTitle>
          <p className="text-sm text-muted-foreground">Otentikasi khusus staf operasional & manajemen.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">Tingkat Akses</Label>
              <Select value={role} onValueChange={(v: any) => setRole(v)}>
                <SelectTrigger className="h-11 border-slate-200">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator (Operasional)</SelectItem>
                  <SelectItem value="superadmin">Super Admin (Management)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">Email Bisnis</Label>
              <Input 
                type="email" 
                className="h-11 border-slate-200" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">Password</Label>
              <Input 
                type="password" 
                className="h-11 border-slate-200" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
              />
            </div>
            
            <Button type="submit" className="w-full h-11 text-sm font-bold shadow-lg shadow-primary/20">
              Masuk ke Panel Kendali
            </Button>
            
            <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Kembali ke Beranda
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
