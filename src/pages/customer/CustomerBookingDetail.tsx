import { useParams, useNavigate } from 'react-router-dom';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, MapPin, Clock, Armchair } from 'lucide-react';
import { formatRupiah } from '@/data/dummy';
import { ETicket } from '@/components/ETicket';

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

      {/* E-Ticket */}
      <ETicket booking={booking} />

      {/* Print button */}
      <Button variant="outline" className="w-full" onClick={() => window.print()}>
        📥 Download / Print Tiket
      </Button>
    </div>
  );
};

export default CustomerBookingDetail;
