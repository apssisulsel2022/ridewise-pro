import { useState, useEffect } from 'react';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Map as MapIcon, Navigation, Search, TrendingUp, Users, Info, ArrowUpDown, ChevronUp, ChevronDown, PackageOpen, Loader2 } from 'lucide-react';
import { formatRupiah } from '@/data/dummy';
import { toast } from 'sonner';
import { Route, RoutePoint } from '@/types/shuttle';
import RouteEditorMap from '@/components/map/RouteEditorMap';
import { cn } from '@/lib/utils';

const AdminRoutes = () => {
  const { routes, setRoutes, routePoints, updateRoutePoints, schedules, bookings, drivers, vehicles } = useShuttle();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Route | null>(null);
  const [selectedRouteForMap, setSelectedRouteForMap] = useState<Route | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Route; direction: 'asc' | 'desc' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({ 
    name: '', 
    rayon: 'A' as Route['rayon'], 
    origin: '', 
    destination: '', 
    distanceMeters: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Nama rute harus diisi';
    if (!form.origin.trim()) newErrors.origin = 'Titik asal harus diisi';
    if (!form.destination.trim()) newErrors.destination = 'Titik tujuan harus diisi';
    if (form.distanceMeters <= 0) newErrors.distanceMeters = 'Jarak harus lebih dari 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSort = (key: keyof Route) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRoutes = [...routes].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredRoutes = sortedRoutes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalActiveTrips = schedules.filter(s => s.status === 'departed' || s.status === 'boarding').length;
  const totalBookings = bookings.length;

  const openNew = () => { 
    setEditing(null); 
    setForm({ name: '', rayon: 'A', origin: '', destination: '', distanceMeters: 0 }); 
    setErrors({});
    setOpen(true); 
  };

  const openEdit = (r: Route) => { 
    setEditing(r); 
    setForm({ name: r.name, rayon: r.rayon, origin: r.origin, destination: r.destination, distanceMeters: r.distanceMeters }); 
    setErrors({});
    setOpen(true); 
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Harap lengkapi data rute dengan benar');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      if (editing) {
        setRoutes(prev => prev.map(r => r.id === editing.id ? { ...r, ...form } : r));
        toast.success('Rute diperbarui');
      } else {
        const newRoute: Route = { id: `r${Date.now()}`, ...form };
        setRoutes(prev => [...prev, newRoute]);
        setSelectedRouteForMap(newRoute);
        toast.success('Rute ditambahkan. Sekarang tentukan titik rute pada peta.');
      }
      setIsSubmitting(false);
      setOpen(false);
    }, 600);
  };

  const handleDelete = (id: string) => { 
    setRoutes(prev => prev.filter(r => r.id !== id)); 
    if (selectedRouteForMap?.id === id) setSelectedRouteForMap(null);
    toast.success('Rute dihapus'); 
  };

  const handlePointsChange = (points: RoutePoint[], distance: number) => {
    if (selectedRouteForMap) {
      updateRoutePoints(selectedRouteForMap.id, points);
      // Update distance in the route itself
      setRoutes(prev => prev.map(r => r.id === selectedRouteForMap.id ? { ...r, distanceMeters: distance } : r));
    }
  };

  const SortIcon = ({ column }: { column: keyof Route }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Navigation className="h-6 w-6 text-primary" />
            </div>
            Manajemen Rute & Visualisasi
          </h1>
          <p className="text-sm text-muted-foreground">Kelola rute perjalanan dan pantau tracking kendaraan secara real-time.</p>
        </div>
        {!open && (
          <div className="flex gap-2">
            <Button onClick={openNew} className="shadow-lg hover:shadow-xl transition-all duration-300 gap-2">
              <Plus className="h-4 w-4" /> Tambah Rute Baru
            </Button>
          </div>
        )}
      </div>

      {/* Inline Form Card */}
      {open && (
        <Card className="border-none shadow-2xl animate-in slide-in-from-top duration-500 overflow-hidden ring-1 ring-black/[0.05]">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-full">
                  <MapIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">{editing ? 'Edit Detail Rute' : 'Buat Rute Baru'}</CardTitle>
                  <CardDescription className="text-sm">Lengkapi informasi di bawah untuk mendaftarkan rute baru ke sistem.</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className={cn("font-semibold", errors.name && "text-destructive")}>Nama Rute</Label>
                  <Input 
                    placeholder="Contoh: Medan - Berastagi" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})}
                    className={cn("h-11 transition-all focus:ring-2", errors.name && "border-destructive ring-destructive/20")}
                  />
                  {errors.name && <p className="text-[10px] font-bold text-destructive uppercase tracking-wider">{errors.name}</p>}
                </div>
                
                <div className="grid gap-2">
                  <Label className="font-semibold">Rayon Operasional</Label>
                  <Select value={form.rayon} onValueChange={v => setForm({...form, rayon: v as Route['rayon']})}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>{['A','B','C','D'].map(r => <SelectItem key={r} value={r}>Rayon {r} (Wilayah {r === 'A' ? 'Utara' : r === 'B' ? 'Selatan' : r === 'C' ? 'Barat' : 'Timur'})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className={cn("font-semibold", errors.origin && "text-destructive")}>Titik Asal</Label>
                    <Input 
                      placeholder="Medan" 
                      value={form.origin} 
                      onChange={e => setForm({...form, origin: e.target.value})}
                      className={cn("h-11", errors.origin && "border-destructive")}
                    />
                    {errors.origin && <p className="text-[10px] font-bold text-destructive uppercase">{errors.origin}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label className={cn("font-semibold", errors.destination && "text-destructive")}>Titik Tujuan</Label>
                    <Input 
                      placeholder="Berastagi" 
                      value={form.destination} 
                      onChange={e => setForm({...form, destination: e.target.value})}
                      className={cn("h-11", errors.destination && "border-destructive")}
                    />
                    {errors.destination && <p className="text-[10px] font-bold text-destructive uppercase">{errors.destination}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="grid gap-2">
                    <Label className={cn("font-semibold", errors.distanceMeters && "text-destructive")}>Estimasi Jarak (m)</Label>
                    <Input 
                      type="number" 
                      value={form.distanceMeters} 
                      onChange={e => setForm({...form, distanceMeters: Number(e.target.value)})}
                      className={cn("h-11", errors.distanceMeters && "border-destructive")}
                    />
                    {errors.distanceMeters && <p className="text-[10px] font-bold text-destructive uppercase">{errors.distanceMeters}</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end gap-4">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 font-bold h-12">Batal</Button>
                  <Button onClick={handleSave} disabled={isSubmitting} className="flex-1 font-bold h-12 shadow-lg hover:shadow-primary/20">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : editing ? 'Simpan Perubahan' : 'Lanjutkan ke Peta'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <RouteEditorMap 
            route={selectedRouteForMap} 
            onPointsChange={handlePointsChange}
          />
          
          <Card className="border-none shadow-xl overflow-hidden ring-1 ring-black/[0.05]">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 space-y-4 md:space-y-0 bg-white/50 backdrop-blur-sm border-b">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold tracking-tight">Daftar Rute Operasional</CardTitle>
                <CardDescription className="text-xs">Klik baris untuk memvisualisasikan rute pada peta Leaflet.</CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari rute, asal, atau tujuan..." 
                  className="pl-9 h-10 bg-muted/30 border-none focus-visible:ring-1 transition-all" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-[300px] cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('name')}>
                        <div className="flex items-center font-bold uppercase text-[11px] tracking-widest">
                          Informasi Rute <SortIcon column="name" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('rayon')}>
                        <div className="flex items-center font-bold uppercase text-[11px] tracking-widest">
                          Rayon <SortIcon column="rayon" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('distanceMeters')}>
                        <div className="flex items-center font-bold uppercase text-[11px] tracking-widest">
                          Jarak <SortIcon column="distanceMeters" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right font-bold uppercase text-[11px] tracking-widest">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoutes.map(r => (
                      <TableRow 
                        key={r.id} 
                        className={cn(
                          "group cursor-pointer transition-all duration-200 border-l-4 border-l-transparent",
                          selectedRouteForMap?.id === r.id ? "bg-primary/[0.03] border-l-primary" : "hover:bg-muted/30"
                        )}
                        onClick={() => setSelectedRouteForMap(r)}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-lg shrink-0 transition-colors",
                              selectedRouteForMap?.id === r.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                              <Navigation className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm tracking-tight">{r.name}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded uppercase">{r.origin}</span>
                                <span className="text-[10px] text-muted-foreground opacity-30">→</span>
                                <span className="text-[10px] text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded uppercase">{r.destination}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-[10px] font-black tracking-widest border-2",
                            r.rayon === 'A' ? "border-blue-200 text-blue-700 bg-blue-50" :
                            r.rayon === 'B' ? "border-green-200 text-green-700 bg-green-50" :
                            r.rayon === 'C' ? "border-orange-200 text-orange-700 bg-orange-50" :
                            "border-purple-200 text-purple-700 bg-purple-50"
                          )}>
                            RAYON {r.rayon}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {(r.distanceMeters / 1000).toFixed(1)} km
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => openEdit(r)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10 transition-colors" onClick={() => handleDelete(r.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredRoutes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="py-20">
                          <div className="flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="p-4 bg-muted/50 rounded-full">
                              <PackageOpen className="h-12 w-12 text-muted-foreground/40" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-bold text-lg">Tidak ada rute ditemukan</h3>
                              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Coba ubah kata kunci pencarian Anda atau tambahkan rute baru jika belum tersedia.
                              </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSearchTerm('')} className="font-semibold">
                              Reset Pencarian
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-primary text-primary-foreground relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="h-24 w-24" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] opacity-70">Status Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md ring-1 ring-white/30">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Aktif Hari Ini</p>
                    <p className="text-2xl font-black tracking-tighter">{totalActiveTrips} Trip</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md ring-1 ring-white/30">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Total Booking</p>
                    <p className="text-2xl font-black tracking-tighter">{totalBookings}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 text-[10px] font-bold opacity-80 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Sistem Operasional Normal
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="pb-2 bg-muted/30">
              <CardTitle className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest">
                <Info className="h-4 w-4 text-primary" />
                Panduan Peta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-[11px] space-y-4 leading-relaxed">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-lg bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <p className="text-muted-foreground font-medium">Garis biru menunjukkan jalur rute utama. Gunakan mode edit untuk memodifikasi jalur.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-lg bg-success/10 border-2 border-success/30 flex items-center justify-center shrink-0">
                  <span className="text-[8px] font-bold text-success">1</span>
                </div>
                <p className="text-muted-foreground font-medium">Waypoints bernomor. Seret (drag) untuk memindah lokasi atau klik untuk hapus.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <span className="text-[10px]">🚐</span>
                </div>
                <p className="text-primary font-bold">Ikon kendaraan real-time muncul saat trip sedang berlangsung di rute tersebut.</p>
              </div>
              <div className="mt-6 p-3 bg-muted/50 rounded-xl border border-dashed border-muted-foreground/20">
                <p className="italic text-center text-muted-foreground font-medium">Tips: Klik area mana saja pada peta untuk menambah titik baru saat mode edit aktif.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes;
