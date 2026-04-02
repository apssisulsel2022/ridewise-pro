export type UserRole = 'customer' | 'driver' | 'admin' | 'superadmin';

export type Permission = 
  | 'manage_admins'
  | 'manage_business'
  | 'manage_system'
  | 'view_analytics'
  | 'manage_finance'
  | 'manage_users'
  | 'manage_drivers'
  | 'manage_vehicles'
  | 'manage_routes';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  permissions?: Permission[];
  status?: 'active' | 'suspended' | 'blocked';
  deactivationReason?: string;
}

export interface AdminUser extends User {
  role: 'admin' | 'superadmin';
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'offline' | 'suspended';
  rating: number;
  totalTrips: number;
  walletBalance: number;
  suspensionEnd?: string;
  suspensionReason?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  capacity: number;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  imageUrl?: string;
  stnkUrl?: string;
  nextMaintenanceDate?: string;
}

export interface Rayon {
  id: string;
  name: string;
  coverageArea: string; // e.g. "Medan Utara, Binjai, Stabat"
  color: string; // e.g. "#FF5733"
}

export interface Route {
  id: string;
  name: string;
  rayonId: string;
  origin: string;
  destination: string;
  distanceMeters: number;
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
  price: number;
  status: 'active' | 'inactive';
  rayonId: string;
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
  oldValue?: string;
  newValue?: string;
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

export interface BusinessConfig {
  platformFeePercentage: number;
  driverCommissionPercentage: number;
  basePricePerKm: number;
  currency: string;
  history: {
    timestamp: string;
    updatedBy: string;
    changes: string;
  }[];
}

export interface SystemConfig extends BusinessConfig {
  minWithdrawal: number;
  maxWithdrawal: number;
  serviceFee: number;
  maintenanceMode: boolean;
}

export interface Transaction {
  id: string;
  bookingId?: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'topup' | 'payment' | 'withdraw' | 'refund';
  method: PaymentMethod;
  platformFee: number;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
}

export type MapLayerType = 'osm' | 'satellite' | 'terrain' | 'dark';

export interface MapConfig {
  layer: MapLayerType;
  zoom: number;
  center: [number, number];
}
