export type UserRole = 'customer' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: 'active' | 'inactive';
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  capacity: number;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
}

export interface Route {
  id: string;
  name: string;
  rayon: 'A' | 'B' | 'C' | 'D';
  origin: string;
  destination: string;
  distanceMeters: number;
  pricePerMeter: number;
  price: number;
}

export interface RoutePoint {
  id: string;
  routeId: string;
  code: string;
  name: string;
  order: number;
  lat: number;
  lng: number;
  address?: string;
  notes?: string;
  imageUrl?: string;
}

export interface Schedule {
  id: string;
  routeId: string;
  departureTime: string;
  vehicleId: string;
  driverId: string | null;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
}

export interface Seat {
  id: string;
  vehicleId: string;
  seatNumber: number;
  row: number;
  column: number;
  isAvailable: boolean;
}

export type PaymentMethod = 'qris' | 'bank_transfer' | 'credit_card';
export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'failed';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  scheduleId: string;
  routeId: string;
  routeName: string;
  pickupPointId: string;
  pickupPointName: string;
  seatNumber: number;
  price: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookingDate: string;
  departureTime: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
}

export interface TripDetail {
  schedule: Schedule;
  route: Route;
  vehicle: Vehicle;
  driver: Driver | null;
  passengers: Booking[];
  seats: SeatStatus[];
}

export interface SeatStatus {
  seatNumber: number;
  row: number;
  column: number;
  isBooked: boolean;
  passengerName?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'trip' | 'system';
  read: boolean;
  timestamp: string;
  role: UserRole;
}

export interface PaymentConfig {
  provider: 'midtrans' | 'xendit';
  serverKey: string;
  clientKey: string;
  environment: 'sandbox' | 'production';
  enabled: boolean;
}

export interface Wallet {
  driverId: string;
  balance: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface FavoriteLocation {
  id: string;
  userId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface PickupHistory {
  id: string;
  userId: string;
  pointId: string;
  pointName: string;
  timestamp: string;
}

export interface SystemConfig {
  minWithdrawal: number;
  maxWithdrawal: number;
  serviceFee: number;
  maintenanceMode: boolean;
}

export interface Transaction {
  id: string;
  driverId: string;
  amount: number;
  type: 'top-up' | 'payout' | 'fee' | 'commission' | 'withdrawal';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  bankName?: string;
  accountNumber?: string;
  reference?: string;
}

export type MapLayerType = 'osm' | 'satellite' | 'terrain' | 'dark';

export interface MapConfig {
  layer: MapLayerType;
  zoom: number;
  center: [number, number];
}
