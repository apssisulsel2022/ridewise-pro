import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatRupiah } from '@/data/dummy';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminReports = () => {
  const { bookings, routes, schedules, drivers, customers } = useShuttle();

  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.price, 0);
  const completedTrips = schedules.filter(s => s.status === 'arrived').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const totalUsers = drivers.length + customers.length;

  const revenueByRoute = routes.map(r => {
    const routeBookings = bookings.filter(b => b.routeId === r.id && b.status !== 'cancelled');
    return { name: r.name, value: routeBookings.reduce((s, b) => s + b.price, 0), count: routeBookings.length };
  }).filter(r => r.count > 0).sort((a, b) => b.value - a.value);

  // Simulasi data tren pendapatan (7 hari terakhir)
  const revenueTrend = [
    { day: 'Sen', amount: totalRevenue * 0.12 },
    { day: 'Sel', amount: totalRevenue * 0.15 },
    { day: 'Rab', amount: totalRevenue * 0.13 },
    { day: 'Kam', amount: totalRevenue * 0.18 },
    { day: 'Jum', amount: totalRevenue * 0.22 },
    { day: 'Sab', amount: totalRevenue * 0.25 },
    { day: 'Min', amount: totalRevenue * 0.10 },
  ];

  const bookingStatusData = [
    { name: 'Selesai', value: bookings.filter(b => b.status === 'paid').length },
    { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
    { name: 'Batal', value: cancelledBookings },
  ];

  const handleExport = (type: string) => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: `Menyiapkan laporan ${type}...`,
      success: `Laporan ${type} berhasil diunduh`,
      error: 'Gagal mengunduh laporan',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reporting & Analytics</h1>
          <p className="text-sm text-muted-foreground">Analisis performa bisnis dan operasional real-time.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
            <FileText className="h-4 w-4 mr-2" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')}>
            <Download className="h-4 w-4 mr-2" /> Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <Badge variant="success" className="text-[10px]">+12.5%</Badge>
            </div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Total Pendapatan</p>
            <p className="text-2xl font-bold text-primary">{formatRupiah(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-4 w-4 text-success" />
              <Badge variant="outline" className="text-[10px]">Hari Ini</Badge>
            </div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Trip Selesai</p>
            <p className="text-2xl font-bold">{completedTrips}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <Badge variant="outline" className="text-[10px]">Aktif</Badge>
            </div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Total User</p>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="h-4 w-4 text-destructive" />
              <Badge variant="destructive" className="text-[10px] px-1 h-4">{cancelledBookings}</Badge>
            </div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Booking Batal</p>
            <p className="text-2xl font-bold text-destructive">{cancelledBookings}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tren Pendapatan Mingguan</CardTitle>
            <CardDescription>Grafik pendapatan selama 7 hari terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} tickFormatter={(v) => `Rp${v/1000}k`} />
                  <Tooltip 
                    formatter={(v: number) => [formatRupiah(v), 'Pendapatan']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#1D4ED8" strokeWidth={3} dot={{ r: 4, fill: '#1D4ED8' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Pemesanan</CardTitle>
            <CardDescription>Distribusi status seluruh booking.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full max-w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 text-xs mt-4">
                {bookingStatusData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analisis Performa Rute</CardTitle>
          <CardDescription>Pendapatan tertinggi berdasarkan rute perjalanan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByRoute} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={150} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  formatter={(v: number) => [formatRupiah(v), 'Pendapatan']}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="value" fill="#1D4ED8" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
