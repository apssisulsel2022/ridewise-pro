import { useNavigate } from 'react-router-dom';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock } from 'lucide-react';
import WalletBalance from '@/components/driver/WalletBalance';
import { formatRupiah } from '@/data/dummy';

const DriverDashboard = () => {
  const { schedules, routes, vehicles, bookings, routePoints, acceptBooking, currentUser } = useShuttle();
  const navigate = useNavigate();

  const mySchedules = schedules.filter(s => s.driverId === currentUser?.id);
  const driverRouteIds = currentUser ? mySchedules.map((s) => s.routeId) : [];
  const driverRayonIds = new Set(routes.filter((r) => driverRouteIds.includes(r.id)).map((r) => r.rayonId));
  const pendingOrders = bookings.filter((booking) => {
    if (booking.status !== 'requested') return false;
    const point = routePoints.find((p) => p.id === booking.pickupPointId);
    return point ? driverRayonIds.has(point.rayonId) : false;
  });

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
        <div className="rounded-3xl border border-border bg-slate-50 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold">Permintaan Orderan Realtime</h2>
              <p className="text-sm text-muted-foreground">Hanya order yang berada dalam rayon Anda akan muncul di sini.</p>
            </div>
            <Badge variant="outline" className="font-normal text-xs">{pendingOrders.length} order</Badge>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-muted/50 bg-white p-5 text-center">
              <p className="font-medium text-sm">Tidak ada order realtime yang cocok dengan rayon Anda saat ini.</p>
              <p className="text-xs text-muted-foreground mt-2">Pastikan Anda memiliki jadwal aktif di rayon yang tepat untuk menerima order.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((order) => {
                const route = routes.find((r) => r.id === order.routeId);
                const point = routePoints.find((p) => p.id === order.pickupPointId);
                return (
                  <Card key={order.id} className="border border-border shadow-none bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="text-sm font-semibold">{order.userName}</p>
                          <p className="text-xs text-muted-foreground">{route?.name} · {order.departureTime}</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary">{point?.rayonId ? routes.find(r=>r.id===order.routeId)?.rayonId : 'Rayon'}</Badge>
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Titik Jemput</span>
                          <span>{order.pickupPointName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Route</span>
                          <span>{route?.origin} → {route?.destination}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Harga</span>
                          <span>{formatRupiah(order.price)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Titik Rayon</span>
                          <span>{point?.rayonId ? point?.rayonId.replace('rayon-', 'Rayon ').toUpperCase() : 'N/A'}</span>
                        </div>
                        <div className="flex justify-end">
                          <Button size="sm" onClick={() => acceptBooking(order.id)}>Terima Order</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
