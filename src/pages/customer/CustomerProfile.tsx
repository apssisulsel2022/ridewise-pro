import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone } from 'lucide-react';

const CustomerProfile = () => {
  const { currentUser, bookings } = useShuttle();

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="p-4 space-y-4">
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">{currentUser?.name}</h2>
          <Badge className="bg-primary-foreground/20 text-primary-foreground mt-1">Customer</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm">{currentUser?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Telepon</p>
              <p className="text-sm">{currentUser?.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalBookings}</p>
            <p className="text-xs text-muted-foreground">Total Booking</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{activeBookings}</p>
            <p className="text-xs text-muted-foreground">Booking Aktif</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerProfile;
