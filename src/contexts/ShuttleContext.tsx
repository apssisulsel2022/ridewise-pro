import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, Booking, Schedule, Route, RoutePoint, Driver, Vehicle, Wallet, Transaction } from '@/types/shuttle';
import { dummyRoutes, dummyRoutePoints, dummySchedules, dummyDrivers, dummyVehicles, dummyBookings, dummyWallets, dummyTransactions } from '@/data/dummy';

interface ShuttleContextType {
  currentUser: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  routes: Route[];
  routePoints: RoutePoint[];
  schedules: Schedule[];
  drivers: Driver[];
  vehicles: Vehicle[];
  bookings: Booking[];
  wallets: Wallet[];
  transactions: Transaction[];
  addBooking: (booking: Booking) => void;
  addTransaction: (transaction: Transaction) => void;
  withdrawBalance: (amount: number, bankName: string, accountNumber: string) => Promise<{ success: boolean; message: string; transactionId?: string }>;
  updateScheduleStatus: (scheduleId: string, status: Schedule['status']) => void;
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
  setRoutePoints: React.Dispatch<React.SetStateAction<RoutePoint[]>>;
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const ShuttleContext = createContext<ShuttleContextType | undefined>(undefined);

export const ShuttleProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [routes, setRoutes] = useState<Route[]>(dummyRoutes);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>(dummyRoutePoints);
  const [schedules, setSchedules] = useState<Schedule[]>(dummySchedules);
  const [drivers, setDrivers] = useState<Driver[]>(dummyDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(dummyVehicles);
  const [bookings, setBookings] = useState<Booking[]>(dummyBookings);
  const [wallets, setWallets] = useState<Wallet[]>(dummyWallets);
  const [transactions, setTransactions] = useState<Transaction[]>(dummyTransactions);

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

  const addBooking = (booking: Booking) => setBookings(prev => [...prev, booking]);

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

    return { success: true, message: 'Permintaan penarikan berhasil diajukan', transactionId };
  };

  const updateScheduleStatus = (scheduleId: string, status: Schedule['status']) => {
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, status } : s));
  };

  return (
    <ShuttleContext.Provider value={{
      currentUser, login, logout,
      routes, routePoints, schedules, drivers, vehicles, bookings, wallets, transactions,
      addBooking, addTransaction, withdrawBalance, updateScheduleStatus,
      setRoutes, setRoutePoints, setSchedules, setDrivers, setVehicles, setBookings, setWallets, setTransactions,
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
