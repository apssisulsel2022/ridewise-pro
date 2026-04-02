import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LayoutDashboard, MapPin, Navigation, CalendarDays, Users, Bus, Link2, BookOpen, FileText, LogOut, Map, BarChart3, CreditCard, Activity, Zap, ShieldCheck, Settings } from 'lucide-react';
import { useShuttle } from '@/contexts/ShuttleContext';
import { NotificationCenter } from '@/components/NotificationCenter';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';

const adminMenuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
  { title: 'Tracking', url: '/admin/tracking', icon: Map },
  { title: 'Rute', url: '/admin/routes', icon: Navigation },
  { title: 'Titik Jemput', url: '/admin/points', icon: MapPin },
  { title: 'Jadwal', url: '/admin/schedules', icon: CalendarDays },
  { title: 'User Management', url: '/admin/users', icon: Users },
  { title: 'Kendaraan', url: '/admin/vehicles', icon: Bus },
  { title: 'Assign Driver', url: '/admin/assign', icon: Link2 },
  { title: 'Booking', url: '/admin/bookings', icon: BookOpen },
  { title: 'Laporan', url: '/admin/reports', icon: FileText },
  { title: 'Audit Trail', url: '/admin/audit', icon: Activity },
  { title: 'Monitoring', url: '/admin/monitoring', icon: Zap },
  { title: 'Payment', url: '/admin/payment-settings', icon: CreditCard },
];

const superAdminMenuItems = [
  { title: 'Dashboard', url: '/superadmin', icon: LayoutDashboard },
  { title: 'Manajemen Admin', url: '/superadmin/admins', icon: ShieldCheck },
  { title: 'Pengaturan Bisnis', url: '/superadmin/business-config', icon: Settings },
  { title: 'Monitoring Global', url: '/superadmin/monitoring', icon: Zap },
  { title: 'Analytics Global', url: '/superadmin/analytics', icon: BarChart3 },
  { title: 'Audit Trail Global', url: '/superadmin/audit', icon: Activity },
];

const AdminSidebar = ({ role }: { role: string }) => {
  const menuItems = role === 'superadmin' ? superAdminMenuItems : adminMenuItems;
  
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {role === 'superadmin' ? 'Super Admin Menu' : 'Menu Admin'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useShuttle();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar role={currentUser.role} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-semibold text-lg">
                {isSuperAdmin ? 'Super Admin Panel' : 'Admin Panel'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <NotificationCenter role={currentUser.role as any} />
              <span className="text-sm text-muted-foreground">{currentUser?.name}</span>
              <button onClick={() => { logout(); navigate('/'); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
