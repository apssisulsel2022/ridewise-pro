import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, Info, Navigation, History, Star, Users, Clock } from 'lucide-react';
import { formatRupiah, generateSeats } from '@/data/dummy';
import { toast } from 'sonner';
import { PaymentModal } from '@/components/PaymentModal';
import { PaymentMethod } from '@/types/shuttle';
import { CustomerPickupMap } from '@/components/customer/CustomerPickupMap';
import { Separator } from '@/components/ui/separator';

const CustomerBookingNew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { routes, routePoints, schedules, vehicles, bookings, addBooking, setBookings, currentUser, addAuditLog } = useShuttle();

  const scheduleId = searchParams.get('scheduleId') || '';
  const routeId = searchParams.get('routeId') || '';

  const schedule = schedules.find(s => s.id === scheduleId);
  const route = routes.find(r => r.id === routeId);
  const vehicle = vehicles.find(v => v.id === schedule?.vehicleId);
  const points = routePoints.filter(p => p.routeId === routeId).sort((a, b) => a.order - b.order);

  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [selectedPickup, setSelectedPickup] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [lastBookingId, setLastBookingId] = useState('');

  const handlePaymentConfirm = (method: PaymentMethod) => {
    setBookings(prev => prev.map(b => b.id === lastBookingId ? { ...b, paymentStatus: 'paid' as const, paymentMethod: method } : b));
    setShowPayment(false);
    toast.success('Booking & pembayaran berhasil!');
    
    // Notification to Admin/Driver via Audit Log & UI
    addAuditLog('New Booking Confirmed', `User ${currentUser?.name} confirmed booking ${lastBookingId} via ${method}`);
    
    navigate(`/customer/booking/${lastBookingId}`);
  };

  if (!schedule || !route || !vehicle) return <div className="p-4">Data tidak ditemukan</div>;

  const seats = generateSeats(vehicle.id);
  const bookedSeats = bookings.filter(b => b.scheduleId === scheduleId && b.status !== 'cancelled').map(b => b.seatNumber);
  const cols = vehicle.capacity <= 8 ? 2 : 3;

  const handleBooking = () => {
    if (!selectedSeat || !selectedPickup) {
      toast.error('Pilih kursi dan titik penjemputan!');
      return;
    }
    const pickup = points.find(p => p.id === selectedPickup);
    const newBooking = {
      id: `b${Date.now()}`,
      userId: currentUser?.id || 'u1',
      userName: currentUser?.name || 'Guest',
      scheduleId,
      routeId,
      routeName: route.name,
      pickupPointId: selectedPickup,
      pickupPointName: pickup?.name || '',
      seatNumber: selectedSeat,
      price: route.price,
      status: 'confirmed' as const,
      bookingDate: new Date().toISOString().split('T')[0],
      departureTime: schedule.departureTime,
      paymentStatus: 'pending' as const,
      paymentMethod: null,
    };
    addBooking(newBooking);
    setLastBookingId(newBooking.id);
    setShowPayment(true);
    
    // Real-time synchronization hint: Notify admin of pending booking
    addAuditLog('New Booking Pending', `User ${currentUser?.name} created a new booking ${newBooking.id}`);
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10 hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
        </Button>
        <Badge variant="outline" className="text-xs font-mono">
          ID: {scheduleId.substring(0, 8)}
        </Badge>
      </div>

      <Card className="border-none shadow-md bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs opacity-70 uppercase tracking-widest font-bold">Rute Perjalanan</p>
              <h2 className="text-2xl font-bold leading-tight">{route.name}</h2>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <Navigation className="h-6 w-6" />
            </div>
          </div>
          
          <Separator className="bg-white/20" />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 opacity-70" />
              <span>{schedule.departureTime} WIB</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 opacity-70" />
              <span>{vehicle.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Point with Integrated Map */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Pilih Titik Jemput
            </CardTitle>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-slate-200">Real-time Data</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <CustomerPickupMap 
            selectedPointId={selectedPickup}
            onPointSelect={setSelectedPickup}
            routePoints={points}
          />
          
          <div className="space-y-2">
            <Select value={selectedPickup} onValueChange={setSelectedPickup}>
              <SelectTrigger className="h-12 border-slate-200 focus:ring-primary">
                <SelectValue placeholder="Pilih titik jemput dari peta atau daftar" />
              </SelectTrigger>
              <SelectContent>
                {points.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-[10px] px-1.5 h-5">{p.code}</Badge>
                      <span>{p.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1.5 px-1">
              <Info className="h-3 w-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground leading-none">Driver akan menjemput Anda tepat di titik lokasi yang dipilih.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Selection */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Pilih Kursi
            </CardTitle>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-[10px] font-medium"><span className="w-2 h-2 rounded bg-success" /> Tersedia</div>
              <div className="flex items-center gap-1 text-[10px] font-medium"><span className="w-2 h-2 rounded bg-destructive" /> Terisi</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 ring-1 ring-slate-200/50">
            <div className="flex justify-between items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-inner">KEMUDI</div>
              <div className="h-2 w-12 rounded-full bg-slate-400/20" />
            </div>
            
            <div className={`grid gap-4 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`} style={{ maxWidth: cols === 3 ? '220px' : '140px', margin: '0 auto' }}>
              {seats.map(seat => {
                const isBooked = bookedSeats.includes(seat.seatNumber);
                const isSelected = selectedSeat === seat.seatNumber;
                return (
                  <button
                    key={seat.seatNumber}
                    disabled={isBooked}
                    onClick={() => setSelectedSeat(isSelected ? null : seat.seatNumber)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative overflow-hidden ${
                      isBooked ? 'bg-destructive/10 text-destructive cursor-not-allowed border-destructive/20' :
                      isSelected ? 'bg-primary text-primary-foreground scale-110 shadow-lg ring-4 ring-primary/20' :
                      'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {seat.seatNumber}
                    {isBooked && <div className="absolute inset-0 flex items-center justify-center bg-destructive/10"><span className="w-1/2 h-[2px] bg-destructive/40 rotate-45" /><span className="w-1/2 h-[2px] bg-destructive/40 -rotate-45" /></div>}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="sticky bottom-4 z-40 px-1">
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl ring-1 ring-black/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Estimasi Pembayaran</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-primary">{formatRupiah(route.price)}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">/ pax</p>
                </div>
              </div>
              <Button 
                className="h-12 px-8 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 transition-all active:scale-95 flex-1 max-w-[180px]" 
                size="lg" 
                onClick={handleBooking} 
                disabled={!selectedSeat || !selectedPickup}
              >
                Booking Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={route.price}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
};

export default CustomerBookingNew;
