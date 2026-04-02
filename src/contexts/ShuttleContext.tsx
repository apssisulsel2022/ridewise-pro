import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, Booking, Schedule, Route, RoutePoint, Driver, Vehicle } from '@/types/shuttle';
import { dummyRoutes, dummyRoutePoints, dummySchedules, dummyDrivers, dummyVehicles, dummyBookings } from '@/data/dummy';

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
  addBooking: (booking: Booking) => void;
  updateScheduleStatus: (scheduleId: string, status: Schedule['status']) => void;
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
  setRoutePoints: React.Dispatch<React.SetStateAction<RoutePoint[]>>;
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
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

  const updateScheduleStatus = (scheduleId: string, status: Schedule['status']) => {
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, status } : s));
  };

  return (
    <ShuttleContext.Provider value={{
      currentUser, login, logout,
      routes, routePoints, schedules, drivers, vehicles, bookings,
      addBooking, updateScheduleStatus,
      setRoutes, setRoutePoints, setSchedules, setDrivers, setVehicles, setBookings,
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
