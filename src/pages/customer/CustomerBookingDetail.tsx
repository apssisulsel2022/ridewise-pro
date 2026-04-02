import { useParams, useNavigate } from 'react-router-dom';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, MapPin, Clock, Armchair } from 'lucide-react';
import { formatRupiah } from '@/data/dummy';

const CustomerBookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings } = useShuttle();

  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return <div className="p-4">Booking tidak ditemukan</div>;

  const statusColor = {
    confirmed: 'bg-success text-success-foreground',
    completed: 'bg-muted text-muted-foreground',
    cancelled: 'bg-destructive text-destructive-foreground',
  };

  const statusLabel = {
    confirmed: 'Dikonfirmasi',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate('/customer')}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
      </Button>

      <div className="text-center py-4">
        <CheckCircle className="h-16 w-16 text-success mx-auto mb-2" />
        <h2 className="text-xl font-bold">Detail Booking</h2>
        <Badge className={statusColor[booking.status]}>{statusLabel[booking.status]}</Badge>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">ID Booking</CardTitle></CardHeader>
        <CardContent><p className="font-mono text-sm">{booking.id}</p></CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Rute</p>
              <p className="font-medium">{booking.routeName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">Titik Jemput</p>
              <p className="font-medium">{booking.pickupPointName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Waktu Keberangkatan</p>
              <p className="font-medium">{booking.departureTime} · {booking.bookingDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Armchair className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Nomor Kursi</p>
              <p className="font-medium text-xl">#{booking.seatNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Harga</p>
          <p className="text-3xl font-bold text-primary">{formatRupiah(booking.price)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerBookingDetail;
