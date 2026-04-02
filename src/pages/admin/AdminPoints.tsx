import { useState } from 'react';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Eye, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { RoutePoint } from '@/types/shuttle';
import { PointEditDialog } from '@/components/admin/PointEditDialog';
import { PointDetailDialog } from '@/components/admin/PointDetailDialog';
import { Textarea } from '@/components/ui/textarea';

const AdminPoints = () => {
  const context = useShuttle();
  
  if (!context) return null;
  
  const { routePoints = [], setRoutePoints, routes = [] } = context;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    routeId: '', 
    code: '', 
    name: '', 
    order: 1, 
    address: '', 
    lat: -6.2088, 
    lng: 106.8456, 
    notes: '' 
  });
  const [filterRoute, setFilterRoute] = useState('all');
  
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = filterRoute === 'all' ? routePoints : (routePoints || []).filter(p => p.routeId === filterRoute);

  const handleSave = async () => {
    if (!form.routeId || !form.name || !form.code) {
      toast.error('Mohon lengkapi data wajib (Rute, Nama, Kode)');
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newPoint: RoutePoint = { 
        id: `rp${Date.now()}`, 
        ...form 
      };
      
      setRoutePoints(prev => [...prev, newPoint]);
      toast.success('Titik jemput berhasil ditambahkan');
      setOpen(false);
      setForm({ 
        routeId: '', 
        code: '', 
        name: '', 
        order: routePoints.length + 1, 
        address: '', 
        lat: -6.2088, 
        lng: 106.8456, 
        notes: '' 
      });
    } catch (error) {
      toast.error('Gagal menambahkan titik jemput');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => { 
    if (window.confirm('Apakah Anda yakin ingin menghapus titik jemput ini?')) {
      setRoutePoints(prev => prev.filter(p => p.id !== id)); 
      toast.success('Titik jemput berhasil dihapus'); 
    }
  };

  const openEdit = (point: RoutePoint) => {
    setSelectedPoint(point);
    setEditOpen(true);
  };

  const openDetail = (point: RoutePoint) => {
    setSelectedPoint(point);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Titik Penjemputan</h1>
          <p className="text-muted-foreground">Kelola lokasi penjemputan penumpang untuk setiap rute.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-1" />Tambah Titik</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Titik Jemput</DialogTitle>
              <DialogDescription>
                Daftarkan titik koordinat penjemputan baru untuk rute tertentu.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Rute</Label>
                <Select value={form.routeId} onValueChange={v => setForm({...form, routeId: v})}>
                  <SelectTrigger><SelectValue placeholder="Pilih rute" /></SelectTrigger>
                  <SelectContent>{routes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kode Titik</Label>
                  <Input placeholder="J1" value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Urutan</Label>
                  <Input type="number" value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Nama Lokasi</Label>
                <Input placeholder="Contoh: Halte Terminal" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>Alamat Lengkap</Label>
                <Textarea placeholder="Alamat jalan, nomor, dsb..." value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input type="number" step="any" value={form.lat} onChange={e => setForm({...form, lat: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input type="number" step="any" value={form.lng} onChange={e => setForm({...form, lng: Number(e.target.value)})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Catatan Tambahan</Label>
                <Input placeholder="Catatan untuk driver/penumpang" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>

              <Button className="w-full" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Titik Jemput
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={filterRoute} onValueChange={setFilterRoute}>
          <SelectTrigger className="w-full sm:w-64"><SelectValue placeholder="Filter rute" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Rute</SelectItem>
            {routes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[80px]">Kode</TableHead>
                <TableHead>Nama Lokasi</TableHead>
                <TableHead>Rute</TableHead>
                <TableHead className="text-center">Urutan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Tidak ada titik penjemputan ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                [...filtered].sort((a,b) => a.order - b.order).map(p => (
                  <TableRow key={p.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono font-bold">
                      <Badge variant="outline" className="rounded-md px-1.5 py-0.5">{p.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {routes.find(r => r.id === p.routeId)?.name || 'N/A'}
                    </TableCell>
                    <TableCell className="text-center font-medium">{p.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDetail(p)} title="Lihat Detail">
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)} title="Edit Informasi">
                          <Edit className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} title="Hapus">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PointEditDialog 
        point={selectedPoint} 
        open={editOpen} 
        onOpenChange={setEditOpen} 
      />
      
      <PointDetailDialog 
        point={selectedPoint} 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
      />
    </div>
  );
};

export default AdminPoints;
