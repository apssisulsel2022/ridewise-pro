import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Star, History, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomerProfile = () => {
  const { currentUser, bookings, favorites, pickupHistory, removeFavorite } = useShuttle();

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="p-4 space-y-6">
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

      {/* Lokasi Favorit */}
      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> Lokasi Favorit</h3>
        {favorites.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Belum ada lokasi favorit.</p>
        ) : (
          <div className="space-y-2">
            {favorites.map(fav => (
              <Card key={fav.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{fav.name}</p>
                      <p className="text-xs text-muted-foreground">{fav.address}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFavorite(fav.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Riwayat Titik Jemput */}
      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2"><History className="h-4 w-4 text-blue-500" /> Riwayat Titik Jemput</h3>
        {pickupHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Belum ada riwayat penjemputan.</p>
        ) : (
          <div className="space-y-2">
            {pickupHistory.map(hist => (
              <Card key={hist.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-100 p-2 rounded-full">
                      <MapPin className="h-3 w-3 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{hist.pointName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(hist.timestamp).toLocaleDateString('id-ID', { 
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
