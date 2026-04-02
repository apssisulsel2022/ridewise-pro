import { useNavigate } from 'react-router-dom';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock } from 'lucide-react';
import WalletBalance from '@/components/driver/WalletBalance';

const DriverDashboard = () => {
  const { schedules, routes, vehicles, bookings, currentUser } = useShuttle();
  const navigate = useNavigate();

  const mySchedules = schedules.filter(s => s.driverId === currentUser?.id);

  const statusColor: Record<string, string> = {
    scheduled: 'bg-primary text-primary-foreground',
    boarding: 'bg-warning text-warning-foreground',
    departed: 'bg-secondary text-secondary-foreground',
    arrived: 'bg-success text-success-foreground',
    cancelled: 'bg-destructive text-destructive-foreground',
  };

  const statusLabel: Record<string, string> = {
    scheduled: 'Terjadwal',
    boarding: 'Boarding',
    departed: 'Berangkat',
    arrived: 'Tiba',
    cancelled: 'Batal',
  };

  return (
    <div className="p-4 space-y-6">
      <WalletBalance />
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Perjalanan Hari Ini
          <Badge variant="outline" className="ml-2 font-normal text-xs">{mySchedules.length}</Badge>
        </h2>

        {mySchedules.length === 0 ? (
          <div className="bg-muted/30 border-2 border-dashed border-muted rounded-xl p-10 text-center">
            <p className="text-muted-foreground font-medium">Tidak ada perjalanan hari ini</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Jadwal Anda akan muncul di sini</p>
          </div>
        ) : (
          mySchedules.map(schedule => {
            const route = routes.find(r => r.id === schedule.routeId);
            const vehicle = vehicles.find(v => v.id === schedule.vehicleId);
            const passengers = bookings.filter(b => b.scheduleId === schedule.id && b.status !== 'cancelled');

            return (
              <Card
                key={schedule.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/driver/trip/${schedule.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{route?.name}</h3>
                    <Badge className={statusColor[schedule.status]}>{statusLabel[schedule.status]}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {schedule.departureTime}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {vehicle?.name} · {vehicle?.plateNumber}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {passengers.length}/{vehicle?.capacity} penumpang</div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
