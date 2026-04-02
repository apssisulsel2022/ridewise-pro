import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, Booking, Schedule, Route, RoutePoint, Driver, Vehicle, Wallet, Transaction, AuditLog, SystemConfig, MapLayerType, FavoriteLocation, PickupHistory } from '@/types/shuttle';
import { dummyRoutes, dummyRoutePoints, dummySchedules, dummyDrivers, dummyVehicles, dummyBookings, dummyWallets, dummyTransactions, dummyCustomers } from '@/data/dummy';

interface ShuttleContextType {
  currentUser: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  routes: Route[];
  routePoints: RoutePoint[];
  schedules: Schedule[];
  drivers: Driver[];
  customers: User[];
  vehicles: Vehicle[];
  bookings: Booking[];
  wallets: Wallet[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  favorites: FavoriteLocation[];
  pickupHistory: PickupHistory[];
  systemConfig: SystemConfig;
  mapLayer: MapLayerType;
  addBooking: (booking: Booking) => void;
  addTransaction: (transaction: Transaction) => void;
  addAuditLog: (action: string, details: string) => void;
  addFavorite: (favorite: Omit<FavoriteLocation, 'id' | 'userId'>) => void;
  removeFavorite: (id: string) => void;
  addPickupHistory: (point: { pointId: string; pointName: string }) => void;
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
  setMapLayer: (layer: MapLayerType) => void;
  withdrawBalance: (amount: number, bankName: string, accountNumber: string) => Promise<{ success: boolean; message: string; transactionId?: string }>;
  updateScheduleStatus: (scheduleId: string, status: Schedule['status']) => void;
  updateRoutePoints: (routeId: string, points: RoutePoint[]) => void;
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
  setRoutePoints: React.Dispatch<React.SetStateAction<RoutePoint[]>>;
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  setCustomers: React.Dispatch<React.SetStateAction<User[]>>;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
}

const ShuttleContext = createContext<ShuttleContextType | undefined>(undefined);

export const ShuttleProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [routes, setRoutes] = useState<Route[]>(dummyRoutes);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>(dummyRoutePoints);
  const [schedules, setSchedules] = useState<Schedule[]>(dummySchedules);
  const [drivers, setDrivers] = useState<Driver[]>(dummyDrivers);
  const [customers, setCustomers] = useState<User[]>(dummyCustomers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(dummyVehicles);
  const [bookings, setBookings] = useState<Booking[]>(dummyBookings);
  const [wallets, setWallets] = useState<Wallet[]>(dummyWallets);
  const [transactions, setTransactions] = useState<Transaction[]>(dummyTransactions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [pickupHistory, setPickupHistory] = useState<PickupHistory[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    minWithdrawal: 50000,
    maxWithdrawal: 10000000,
    serviceFee: 2500,
    maintenanceMode: false,
  });
  const [mapLayer, setMapLayerState] = useState<MapLayerType>(() => {
    const saved = localStorage.getItem('ridewise_map_layer');
    return (saved as MapLayerType) || 'osm';
  });

  const setMapLayer = (layer: MapLayerType) => {
    setMapLayerState(layer);
    localStorage.setItem('ridewise_map_layer', layer);
  };

  const addAuditLog = (action: string, details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateSystemConfig = (config: Partial<SystemConfig>) => {
    setSystemConfig(prev => ({ ...prev, ...config }));
    addAuditLog('Update System Config', JSON.stringify(config));
  };

  const login = (email: string, _password: string, role: UserRole): boolean => {
    if (role === 'customer') {
      setCurrentUser({ id: 'u1', name: 'Siti Aminah', email, phone: '081200000001', role: 'customer' });
    } else if (role === 'driver') {
      const driver = drivers.find(d => d.email === email);
      if (driver) {
        setCurrentUser({ id: driver.id, name: driver.name, email: driver.email, phone: driver.phone, role: 'driver' });
      } else {
        setCurrentUser({ id: 'd1', name: 'Budi Santoso', email, phone: '081234567890', role: 'driver' });
      }
    } else {
      setCurrentUser({ id: 'admin1', name: 'Administrator', email, phone: '081200000000', role: 'admin' });
    }
    return true;
  };

  const logout = () => setCurrentUser(null);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
    addPickupHistory({ pointId: booking.pickupPointId, pointName: booking.pickupPointName });
  };

  const addFavorite = (favorite: Omit<FavoriteLocation, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newFavorite: FavoriteLocation = {
      id: `fav-${Date.now()}`,
      userId: currentUser.id,
      ...favorite
    };
    setFavorites(prev => [...prev, newFavorite]);
    addAuditLog('Add Favorite Location', `User added ${favorite.name} as favorite`);
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    addAuditLog('Remove Favorite Location', `User removed favorite location ${id}`);
  };

  const addPickupHistory = (point: { pointId: string; pointName: string }) => {
    if (!currentUser) return;
    const newHistory: PickupHistory = {
      id: `hist-${Date.now()}`,
      userId: currentUser.id,
      pointId: point.pointId,
      pointName: point.pointName,
      timestamp: new Date().toISOString(),
    };
    setPickupHistory(prev => {
      const filtered = prev.filter(h => h.pointId !== point.pointId);
      return [newHistory, ...filtered].slice(0, 10);
    });
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
    setWallets(prev => prev.map(w => w.driverId === transaction.driverId ? { ...w, balance: w.balance + transaction.amount } : w));
  };

  const withdrawBalance = async (amount: number, bankName: string, accountNumber: string) => {
    // Simulasi delay API
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!currentUser || currentUser.role !== 'driver') {
      return { success: false, message: 'Unauthorized' };
    }

    const wallet = wallets.find(w => w.driverId === currentUser.id);
    if (!wallet) return { success: false, message: 'Wallet tidak ditemukan' };
    
    // Validasi saldo minimum penarikan (misal 50.000)
    if (amount < 50000) {
      return { success: false, message: 'Minimal penarikan adalah Rp 50.000' };
    }

    if (wallet.balance < amount) {
      return { success: false, message: 'Saldo tidak mencukupi' };
    }

    // Pencegahan penarikan ganda sederhana (cek apakah ada pending withdrawal)
    const pendingWithdrawal = transactions.find(t => 
      t.driverId === currentUser.id && 
      t.type === 'withdrawal' && 
      t.status === 'pending'
    );
    if (pendingWithdrawal) {
      return { success: false, message: 'Ada penarikan yang sedang diproses' };
    }

    const transactionId = `W${Date.now()}`;
    const reference = `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const newTransaction: Transaction = {
      id: transactionId,
      driverId: currentUser.id,
      amount: -amount, // Nilai negatif untuk penarikan
      type: 'withdrawal',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      bankName,
      accountNumber,
      reference
    };

    setTransactions(prev => [...prev, newTransaction]);
    setWallets(prev => prev.map(w => w.driverId === currentUser.id ? { ...w, balance: w.balance - amount } : w));

    addAuditLog('Withdrawal Request', `Driver ${currentUser.name} requested withdrawal of ${amount} to ${bankName} (${accountNumber})`);

    return { success: true, message: 'Permintaan penarikan berhasil diajukan', transactionId };
  };

  const updateScheduleStatus = (scheduleId: string, status: Schedule['status']) => {
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, status } : s));
  };

  const updateRoutePoints = (routeId: string, points: RoutePoint[]) => {
    setRoutePoints(prev => {
      const filtered = prev.filter(p => p.routeId !== routeId);
      return [...filtered, ...points].sort((a, b) => a.order - b.order);
    });
    addAuditLog('Update Route Points', `Updated points for route ID ${routeId}`);
  };

  return (
    <ShuttleContext.Provider value={{
      currentUser, login, logout,
      routes, routePoints, schedules, drivers, customers, vehicles, bookings, wallets, transactions, auditLogs, favorites, pickupHistory, systemConfig, mapLayer,
      addBooking, addTransaction, addAuditLog, addFavorite, removeFavorite, addPickupHistory, updateSystemConfig, setMapLayer, withdrawBalance, updateScheduleStatus, updateRoutePoints,
      setRoutes, setRoutePoints, setSchedules, setDrivers, setCustomers, setVehicles, setBookings, setWallets, setTransactions, setAuditLogs,
    }}>
      {children}
    </ShuttleContext.Provider>
  );
};

export const useShuttle = () => {
  const context = useContext(ShuttleContext);
  if (!context) throw new Error('useShuttle must be used within ShuttleProvider');
  return context;
};
