import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Bus, Truck, Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const roles = [
    { title: 'Customer', description: 'Pesan tiket shuttle, pilih rute & kursi', icon: Bus, path: '/customer/login', color: 'bg-primary' },
    { title: 'Driver', description: 'Kelola perjalanan & lihat penumpang', icon: Truck, path: '/driver/login', color: 'bg-secondary' },
    { title: 'Admin', description: 'Kelola sistem, rute, jadwal & laporan', icon: Shield, path: '/admin/login', color: 'bg-foreground' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🚐</div>
        <h1 className="text-3xl font-bold text-foreground mb-2">ShuttleKu</h1>
        <p className="text-muted-foreground">Sistem Manajemen Shuttle & Rental Mobil</p>
      </div>

      <div className="grid gap-4 w-full max-w-sm">
        {roles.map(role => (
          <Card
            key={role.title}
            className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 border-2 hover:border-primary"
            onClick={() => navigate(role.path)}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`${role.color} text-white p-3 rounded-xl`}>
                <role.icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">{role.title}</h2>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-8">© 2026 ShuttleKu — Sistem Transportasi Terpadu</p>
    </div>
  );
};

export default Index;
