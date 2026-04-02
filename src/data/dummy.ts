import { Route, RoutePoint, Schedule, Driver, Vehicle, Booking, Wallet, Transaction, Rayon } from '@/types/shuttle';

export const dummyRayons: Rayon[] = [
  { id: 'rayon-a', name: 'Rayon A', coverageArea: 'Medan Kota, Medan Timur, Medan Perjuangan', color: '#3b82f6' },
  { id: 'rayon-b', name: 'Rayon B', coverageArea: 'Medan Barat, Medan Sunggal, Medan Helvetia', color: '#10b981' },
  { id: 'rayon-c', name: 'Rayon C', coverageArea: 'Medan Amplas, Medan Denai, Medan Tembung', color: '#f97316' },
  { id: 'rayon-d', name: 'Rayon D', coverageArea: 'Medan Tuntungan, Medan Johor, Medan Polonia', color: '#8b5cf6' },
];

export const dummyRoutes: Route[] = [
  { id: 'r1', name: 'Hermes → Kualanamu', rayonId: 'rayon-a', origin: 'Hermes', destination: 'Kualanamu', distanceMeters: 38000 },
  { id: 'r2', name: 'Amplas → Parapat', rayonId: 'rayon-c', origin: 'Amplas', destination: 'Parapat', distanceMeters: 175000 },
  { id: 'r3', name: 'Pinang Baris → Sibolga', rayonId: 'rayon-b', origin: 'Pinang Baris', destination: 'Sibolga', distanceMeters: 280000 },
  { id: 'r4', name: 'Medan → Berastagi', rayonId: 'rayon-d', origin: 'Medan', destination: 'Berastagi', distanceMeters: 66000 },
  { id: 'r5', name: 'Medan → Pematang Siantar', rayonId: 'rayon-a', origin: 'Medan', destination: 'Pematang Siantar', distanceMeters: 128000 },
  { id: 'r6', name: 'Medan → Rantau Prapat', rayonId: 'rayon-c', origin: 'Medan', destination: 'Rantau Prapat', distanceMeters: 285000 },
  { id: 'r7', name: 'Medan → Padang Sidempuan', rayonId: 'rayon-d', origin: 'Medan', destination: 'Padang Sidempuan', distanceMeters: 390000 },
  { id: 'r8', name: 'Medan → Kisaran', rayonId: 'rayon-a', origin: 'Medan', destination: 'Kisaran', distanceMeters: 195000 },
];

export const dummyRoutePoints: RoutePoint[] = [
  { id: 'rp1', routeId: 'r1', code: 'J1', name: 'Terminal Hermes', order: 1, lat: 3.5952, lng: 98.6722, price: 76000, status: 'active', rayonId: 'rayon-a' },
  { id: 'rp2', routeId: 'r1', code: 'J2', name: 'Simpang Pos', order: 2, lat: 3.5880, lng: 98.6850, price: 70000, status: 'active', rayonId: 'rayon-a' },
  { id: 'rp3', routeId: 'r1', code: 'J3', name: 'Tembung', order: 3, lat: 3.5750, lng: 98.7200, price: 65000, status: 'active', rayonId: 'rayon-c' },
  { id: 'rp4', routeId: 'r1', code: 'J4', name: 'Batang Kuis', order: 4, lat: 3.5400, lng: 98.7600, price: 55000, status: 'inactive', rayonId: 'rayon-c' },
  { id: 'rp5', routeId: 'r1', code: 'J5', name: 'Bandara Kualanamu', order: 5, lat: 3.6422, lng: 98.8853, price: 0, status: 'active', rayonId: 'rayon-a' },
  { id: 'rp6', routeId: 'r2', code: 'J1', name: 'Terminal Amplas', order: 1, lat: 3.5570, lng: 98.6950, price: 262500, status: 'active', rayonId: 'rayon-c' },
  { id: 'rp7', routeId: 'r2', code: 'J2', name: 'Lubuk Pakam', order: 2, lat: 3.5550, lng: 98.8570, price: 240000, status: 'active', rayonId: 'rayon-c' },
  { id: 'rp8', routeId: 'r2', code: 'J3', name: 'Tebing Tinggi', order: 3, lat: 3.3283, lng: 99.1627, price: 200000, status: 'active', rayonId: 'rayon-c' },
  { id: 'rp9', routeId: 'r2', code: 'J4', name: 'Seribu Dolok', order: 4, lat: 2.9000, lng: 99.0500, price: 150000, status: 'active', rayonId: 'rayon-c' },
  { id: 'rp10', routeId: 'r2', code: 'J5', name: 'Parapat', order: 5, lat: 2.6640, lng: 98.9380, price: 0, status: 'active', rayonId: 'rayon-c' },
  { id: 'rp11', routeId: 'r3', code: 'J1', name: 'Pinang Baris', order: 1, lat: 3.6100, lng: 98.6350, price: 336000, status: 'active', rayonId: 'rayon-b' },
  { id: 'rp12', routeId: 'r3', code: 'J2', name: 'Binjai', order: 2, lat: 3.6000, lng: 98.4850, price: 310000, status: 'active', rayonId: 'rayon-b' },
  { id: 'rp13', routeId: 'r3', code: 'J3', name: 'Sibolga', order: 3, lat: 1.7427, lng: 98.7792, price: 0, status: 'active', rayonId: 'rayon-b' },
  { id: 'rp14', routeId: 'r4', code: 'J1', name: 'Medan Center', order: 1, lat: 3.5952, lng: 98.6722, price: 132000, status: 'active', rayonId: 'rayon-d' },
  { id: 'rp15', routeId: 'r4', code: 'J2', name: 'Pancur Batu', order: 2, lat: 3.4700, lng: 98.5700, price: 110000, status: 'active', rayonId: 'rayon-d' },
  { id: 'rp16', routeId: 'r4', code: 'J3', name: 'Berastagi', order: 3, lat: 3.1972, lng: 98.5081, price: 0, status: 'active', rayonId: 'rayon-d' },
  { id: 'rp17', routeId: 'r5', code: 'J1', name: 'Medan Timur', order: 1, lat: 3.6000, lng: 98.7000, price: 192000, status: 'active', rayonId: 'rayon-a' },
  { id: 'rp18', routeId: 'r5', code: 'J2', name: 'P. Siantar', order: 2, lat: 2.9540, lng: 99.0478, price: 0, status: 'active', rayonId: 'rayon-a' },
  { id: 'rp19', routeId: 'r6', code: 'J1', name: 'Medan Barat', order: 1, lat: 3.5900, lng: 98.6600, price: 342000, status: 'active', rayonId: 'rayon-b' },
  { id: 'rp20', routeId: 'r6', code: 'J2', name: 'Rantau Prapat', order: 2, lat: 2.0975, lng: 99.8308, price: 0, status: 'active', rayonId: 'rayon-b' },
  { id: 'rp21', routeId: 'r7', code: 'J1', name: 'Medan Selatan', order: 1, lat: 3.5800, lng: 98.6800, price: 390000, status: 'active', rayonId: 'rayon-d' },
  { id: 'rp22', routeId: 'r7', code: 'J2', name: 'Padang Sidempuan', order: 2, lat: 1.3790, lng: 99.2718, price: 0, status: 'active', rayonId: 'rayon-d' },
  { id: 'rp23', routeId: 'r8', code: 'J1', name: 'Medan Utara', order: 1, lat: 3.6200, lng: 98.6700, price: 253500, status: 'active', rayonId: 'rayon-a' },
  { id: 'rp24', routeId: 'r8', code: 'J2', name: 'Kisaran', order: 2, lat: 2.9833, lng: 99.6167, price: 0, status: 'active', rayonId: 'rayon-a' },
];

export const dummyDrivers: Driver[] = [
  { id: 'd1', name: 'Budi Santoso', email: 'budi@shuttle.com', phone: '081234567890', licenseNumber: 'SIM-001', status: 'active' },
  { id: 'd2', name: 'Ahmad Ridwan', email: 'ahmad@shuttle.com', phone: '081234567891', licenseNumber: 'SIM-002', status: 'active' },
  { id: 'd3', name: 'Dedi Kurniawan', email: 'dedi@shuttle.com', phone: '081234567892', licenseNumber: 'SIM-003', status: 'active' },
  { id: 'd4', name: 'Eko Prasetyo', email: 'eko@shuttle.com', phone: '081234567893', licenseNumber: 'SIM-004', status: 'inactive' },
  { id: 'd5', name: 'Fajar Nugroho', email: 'fajar@shuttle.com', phone: '081234567894', licenseNumber: 'SIM-005', status: 'active' },
];

export const dummyCustomers: User[] = [
  { id: 'u1', name: 'Siti Aminah', email: 'siti@example.com', phone: '081200000001', role: 'customer' },
  { id: 'u2', name: 'Rudi Hartono', email: 'rudi@example.com', phone: '081200000002', role: 'customer' },
  { id: 'u3', name: 'Linda Susanti', email: 'linda@example.com', phone: '081200000003', role: 'customer' },
  { id: 'u4', name: 'Bambang Pamungkas', email: 'bambang@example.com', phone: '081200000004', role: 'customer' },
];

export const dummyVehicles: Vehicle[] = [
  { id: 'v1', name: 'Hiace Commuter', plateNumber: 'BK 1234 AB', capacity: 12, type: 'Minibus', status: 'active' },
  { id: 'v2', name: 'Elf Long', plateNumber: 'BK 5678 CD', capacity: 10, type: 'Minibus', status: 'active' },
  { id: 'v3', name: 'Avanza', plateNumber: 'BK 9012 EF', capacity: 8, type: 'MPV', status: 'active' },
  { id: 'v4', name: 'Innova Reborn', plateNumber: 'BK 3456 GH', capacity: 8, type: 'MPV', status: 'maintenance' },
  { id: 'v5', name: 'Hiace Premio', plateNumber: 'BK 7890 IJ', capacity: 12, type: 'Minibus', status: 'active' },
];

export const dummySchedules: Schedule[] = [
  { id: 's1', routeId: 'r1', departureTime: '07:00', vehicleId: 'v1', driverId: 'd1', status: 'scheduled' },
  { id: 's2', routeId: 'r1', departureTime: '10:00', vehicleId: 'v2', driverId: 'd2', status: 'scheduled' },
  { id: 's3', routeId: 'r1', departureTime: '14:00', vehicleId: 'v3', driverId: 'd3', status: 'scheduled' },
  { id: 's4', routeId: 'r2', departureTime: '08:00', vehicleId: 'v5', driverId: 'd5', status: 'scheduled' },
  { id: 's5', routeId: 'r2', departureTime: '13:00', vehicleId: 'v1', driverId: 'd1', status: 'scheduled' },
  { id: 's6', routeId: 'r3', departureTime: '06:00', vehicleId: 'v2', driverId: 'd2', status: 'departed' },
  { id: 's7', routeId: 'r4', departureTime: '09:00', vehicleId: 'v3', driverId: 'd3', status: 'scheduled' },
  { id: 's8', routeId: 'r5', departureTime: '07:30', vehicleId: 'v5', driverId: 'd5', status: 'boarding' },
  { id: 's9', routeId: 'r6', departureTime: '11:00', vehicleId: 'v1', driverId: null, status: 'scheduled' },
  { id: 's10', routeId: 'r7', departureTime: '05:00', vehicleId: 'v2', driverId: null, status: 'scheduled' },
];

export const dummyBookings: Booking[] = [
  { id: 'b1', userId: 'u1', userName: 'Siti Aminah', scheduleId: 's1', routeId: 'r1', routeName: 'Hermes → Kualanamu', pickupPointId: 'rp1', pickupPointName: 'Terminal Hermes', seatNumber: 1, price: 76000, status: 'confirmed', bookingDate: '2026-04-02', departureTime: '07:00', paymentStatus: 'paid', paymentMethod: 'bank_transfer' },
  { id: 'b2', userId: 'u1', userName: 'Siti Aminah', scheduleId: 's1', routeId: 'r1', routeName: 'Hermes → Kualanamu', pickupPointId: 'rp2', pickupPointName: 'Simpang Pos', seatNumber: 3, price: 76000, status: 'confirmed', bookingDate: '2026-04-02', departureTime: '07:00', paymentStatus: 'paid', paymentMethod: 'ewallet' },
  { id: 'b3', userId: 'u2', userName: 'Rudi Hartono', scheduleId: 's1', routeId: 'r1', routeName: 'Hermes → Kualanamu', pickupPointId: 'rp3', pickupPointName: 'Tembung', seatNumber: 5, price: 76000, status: 'confirmed', bookingDate: '2026-04-02', departureTime: '07:00', paymentStatus: 'paid', paymentMethod: 'qris' },
  { id: 'b4', userId: 'u3', userName: 'Linda Susanti', scheduleId: 's4', routeId: 'r2', routeName: 'Amplas → Parapat', pickupPointId: 'rp6', pickupPointName: 'Terminal Amplas', seatNumber: 2, price: 262500, status: 'confirmed', bookingDate: '2026-04-02', departureTime: '08:00', paymentStatus: 'pending', paymentMethod: null },
  { id: 'b5', userId: 'u1', userName: 'Siti Aminah', scheduleId: 's6', routeId: 'r3', routeName: 'Pinang Baris → Sibolga', pickupPointId: 'rp11', pickupPointName: 'Pinang Baris', seatNumber: 1, price: 336000, status: 'completed', bookingDate: '2026-04-01', departureTime: '06:00', paymentStatus: 'paid', paymentMethod: 'bank_transfer' },
  { id: 'b6', userId: 'u4', userName: 'Bambang Pamungkas', scheduleId: 's9', routeId: 'r6', routeName: 'Medan → Rantau Prapat', pickupPointId: 'rp19', pickupPointName: 'Medan Barat', seatNumber: 1, price: 342000, status: 'requested', bookingDate: '2026-04-02', departureTime: '11:00', paymentStatus: 'pending', paymentMethod: null },
  { id: 'b7', userId: 'u2', userName: 'Rudi Hartono', scheduleId: 's10', routeId: 'r7', routeName: 'Medan → Padang Sidempuan', pickupPointId: 'rp21', pickupPointName: 'Medan Selatan', seatNumber: 1, price: 390000, status: 'requested', bookingDate: '2026-04-02', departureTime: '05:00', paymentStatus: 'pending', paymentMethod: null },
];

export const generateSeats = (vehicleId: string): { seatNumber: number; row: number; column: number }[] => {
  const vehicle = dummyVehicles.find(v => v.id === vehicleId);
  if (!vehicle) return [];
  const seats: { seatNumber: number; row: number; column: number }[] = [];
  const cols = vehicle.capacity <= 8 ? 2 : 3;
  const rows = Math.ceil(vehicle.capacity / cols);
  let num = 1;
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      if (num <= vehicle.capacity) {
        seats.push({ seatNumber: num, row: r, column: c });
        num++;
      }
    }
  }
  return seats;
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export const dummyWallets: Wallet[] = [
  { driverId: 'd1', balance: 1500000 },
  { driverId: 'd2', balance: 850000 },
  { driverId: 'd3', balance: 2300000 },
  { driverId: 'd4', balance: 50000 },
  { driverId: 'd5', balance: 1200000 },
];

export const dummyTransactions: Transaction[] = [
  { id: 't1', driverId: 'd1', amount: 500000, type: 'top-up', status: 'completed', date: '2026-03-28' },
  { id: 't2', driverId: 'd1', amount: 76000, type: 'commission', status: 'completed', date: '2026-03-29' },
  { id: 't3', driverId: 'd2', amount: 300000, type: 'top-up', status: 'completed', date: '2026-03-30' },
  { id: 't4', driverId: 'd1', amount: 150000, type: 'payout', status: 'completed', date: '2026-03-31' },
  { id: 't5', driverId: 'd3', amount: 1000000, type: 'top-up', status: 'completed', date: '2026-04-01' },
  { id: 't6', driverId: 'd2', amount: 262500, type: 'commission', status: 'completed', date: '2026-04-02' },
];
