import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, MapPin, QrCode } from 'lucide-react';
import { generateSeats } from '@/data/dummy';
import { toast } from 'sonner';

const DriverTripDetail = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const { schedules, routes, vehicles, bookings, updateScheduleStatus } = useShuttle();
  const [scanOpen, setScanOpen] = useState(false);
  const [scanInput, setScanInput] = useState('');

  const schedule = schedules.find(s => s.id === scheduleId);
  const route = routes.find(r => r.id === schedule?.routeId);
  const vehicle = vehicles.find(v => v.id === schedule?.vehicleId);
  const passengers = bookings.filter(b => b.scheduleId === scheduleId && b.status !== 'cancelled');

  if (!schedule || !route || !vehicle) return <div className="p-4">Data tidak ditemukan</div>;

  const seats = generateSeats(vehicle.id);
  const bookedSeats = passengers.map(p => p.seatNumber);
  const cols = vehicle.capacity <= 8 ? 2 : 3;

  const handleStart = () => {
    updateScheduleStatus(schedule.id, 'departed');
    toast.success('Perjalanan dimulai!');
  };

  const handleFinish = () => {
    updateScheduleStatus(schedule.id, 'arrived');
    toast.success('Perjalanan selesai!');
  };

  const handleScan = () => {
    const found = bookings.find(b => b.id === scanInput.trim());
    if (found && found.scheduleId === scheduleId) {
      toast.success(`✅ Valid! Penumpang: ${found.userName}, Kursi #${found.seatNumber}`);
    } else if (found) {
      toast.error('❌ Tiket valid tapi bukan untuk perjalanan ini');
    } else {
      toast.error('❌ Tiket tidak ditemukan');
    }
    setScanInput('');
    setScanOpen(false);
  };

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate('/driver')}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
      </Button>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold">{route.name}</h2>
          <p className="text-sm opacity-80">{schedule.departureTime} · {vehicle.name}</p>
        </CardContent>
      </Card>

      {/* Status Controls */}
      <Card>
        <CardContent className="p-4 flex gap-2">
          {schedule.status === 'scheduled' && (
            <Button onClick={handleStart} className="flex-1 bg-secondary hover:bg-secondary/90">Mulai Perjalanan</Button>
          )}
          {(schedule.status === 'boarding' || schedule.status === 'departed') && (
            <Button onClick={handleFinish} className="flex-1">Selesai Perjalanan</Button>
          )}
          {schedule.status === 'arrived' && (
            <Badge className="bg-success text-success-foreground w-full text-center py-2">Perjalanan Selesai</Badge>
          )}
        </CardContent>
      </Card>

      {/* Scan QR */}
      <Button variant="outline" className="w-full" onClick={() => setScanOpen(true)}>
        <QrCode className="h-4 w-4 mr-2" /> Scan QR Tiket
      </Button>

      {/* Seat Map */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Peta Kursi ({passengers.length}/{vehicle.capacity})</CardTitle></CardHeader>
        <CardContent>
          <div className={`grid gap-2 mx-auto ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`} style={{ maxWidth: cols === 3 ? '180px' : '120px' }}>
            {seats.map(seat => {
              const isBooked = bookedSeats.includes(seat.seatNumber);
              return (
                <div
                  key={seat.seatNumber}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold ${
                    isBooked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {seat.seatNumber}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Passengers */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Daftar Penumpang</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {passengers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada penumpang</p>
          ) : (
            passengers.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                <User className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.userName}</p>
                  <p className="text-xs text-muted-foreground"><MapPin className="h-3 w-3 inline" /> {p.pickupPointName}</p>
                </div>
                <Badge variant="outline">Kursi #{p.seatNumber}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Scan QR Dialog */}
      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><QrCode className="h-5 w-5" /> Scan QR Tiket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-8 text-center">
              <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Kamera QR (Simulasi)</p>
            </div>
            <div>
              <p className="text-sm mb-2">Atau masukkan ID Booking manual:</p>
              <Input
                placeholder="Contoh: b1"
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScan()}
              />
            </div>
            <Button className="w-full" onClick={handleScan} disabled={!scanInput.trim()}>
              Validasi Tiket
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverTripDetail;
