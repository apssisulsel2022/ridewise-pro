import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const CustomerLogin = () => {
  const [email, setEmail] = useState('siti@example.com');
  const [password, setPassword] = useState('password');
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useShuttle();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, 'customer');
    navigate('/customer');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🚐</div>
          <CardTitle>{isRegister ? 'Daftar Akun' : 'Login Customer'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input placeholder="Nama lengkap" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {isRegister && (
              <div className="space-y-2">
                <Label>No. Telepon</Label>
                <Input placeholder="08xxxxxxxxxx" />
              </div>
            )}
            <Button type="submit" className="w-full">{isRegister ? 'Daftar' : 'Masuk'}</Button>
            <p className="text-center text-sm text-muted-foreground">
              {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
              <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-primary font-medium">{isRegister ? 'Masuk' : 'Daftar'}</button>
            </p>
            <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-primary">← Kembali</Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerLogin;
