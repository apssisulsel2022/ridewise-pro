import { useShuttle } from '@/contexts/ShuttleContext';
import { ETicket } from '@/components/ETicket';

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
          <ETicket key={b.id} booking={b} compact />
        ))
      )}
    </div>
  );
};

export default CustomerTickets;
