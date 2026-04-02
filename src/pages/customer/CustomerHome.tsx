import { useNavigate } from 'react-router-dom';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ChevronRight } from 'lucide-react';

const rayonColors: Record<string, string> = {
  'rayon-a': 'bg-primary text-primary-foreground',
  'rayon-b': 'bg-secondary text-secondary-foreground',
  'rayon-c': 'bg-warning text-warning-foreground',
  'rayon-d': 'bg-destructive text-destructive-foreground',
};

const CustomerHome = () => {
  const { routes, schedules, bookings, rayons } = useShuttle();
  const navigate = useNavigate();

  const getAvailableSchedules = (routeId: string) =>
    schedules.filter(s => s.routeId === routeId && (s.status === 'scheduled' || s.status === 'boarding')).length;

  const routesByRayon = rayons.map(rayon => ({
    ...rayon,
    routes: routes.filter(route => route.rayonId === rayon.id),
  })).filter(rayon => rayon.routes.length > 0);

  return (
    <div className="p-4 space-y-6">
      {/* Active Bookings */}
      {bookings.filter(b => b.status === 'confirmed').length > 0 && (
        <div>
          <h2 className="font-semibold text-foreground mb-3">Booking Aktif</h2>
          <div className="space-y-2">
            {bookings.filter(b => b.status === 'confirmed').slice(0, 2).map(b => (
              <Card key={b.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/customer/booking/${b.id}`)}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{b.routeName}</p>
                    <p className="text-xs text-muted-foreground">{b.departureTime} · Kursi {b.seatNumber}</p>
                  </div>
                  <Badge variant="default" className="bg-success text-success-foreground">Aktif</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Route Selection by Rayon */}
      <div>
        <h2 className="font-semibold text-foreground mb-3">Pilih Rute</h2>
        {routesByRayon.map(rayon => (
          <div key={rayon.id} className="mb-4">
            <Badge className={`${rayonColors[rayon.id] ?? 'bg-muted text-muted-foreground'} mb-2`}>{rayon.name}</Badge>
            <div className="space-y-2">
              {rayon.routes.map(route => (
                <Card
                  key={route.id}
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary"
                  onClick={() => navigate(`/customer/route/${route.id}`)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{route.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {getAvailableSchedules(route.id)} jadwal tersedia · {(route.distanceMeters / 1000).toFixed(0)} km
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerHome;
