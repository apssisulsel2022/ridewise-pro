import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/data/dummy';

const CustomerTickets = () => {
  const { bookings } = useShuttle();
  const active = bookings.filter(b => b.status === 'confirmed');

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Tiket Aktif</h2>
      {active.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">Tidak ada tiket aktif</p>
      ) : (
        active.map(b => (
          <Card key={b.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{b.routeName}</h3>
                <Badge className="bg-success text-success-foreground">Aktif</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Tanggal:</span> {b.bookingDate}</div>
                <div><span className="text-muted-foreground">Waktu:</span> {b.departureTime}</div>
                <div><span className="text-muted-foreground">Kursi:</span> #{b.seatNumber}</div>
                <div><span className="text-muted-foreground">Jemput:</span> {b.pickupPointName}</div>
              </div>
              <div className="mt-2 text-right">
                <span className="font-bold text-primary">{formatRupiah(b.price)}</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default CustomerTickets;
