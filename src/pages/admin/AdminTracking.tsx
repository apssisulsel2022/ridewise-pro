import { useState, useMemo } from 'react';
import { useShuttle } from '@/contexts/ShuttleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Eye, EyeOff, Activity, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import StaticMap from '@/components/StaticMap';
import GPSMap from '@/components/GPSMap';
import MapLegend from '@/components/MapLegend';
import { toast } from 'sonner';

const AdminTracking = () => {
  const { schedules, routes, drivers, routePoints, driverLocations } = useShuttle();
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLegend, setShowLegend] = useState(true);
  const [enableGPS, setEnableGPS] = useState(false);

  // Get active schedules from context
  const activeSchedules = useMemo(() =>
    schedules.filter(s => s.driverId && (s.status === 'departed' || s.status === 'boarding')),
    [schedules]
  );

  const filteredSchedules = useMemo(() => {
    if (!searchQuery) return activeSchedules;
    return activeSchedules.filter(s => {
      const driver = drivers.find(d => d.id === s.driverId);
      const route = routes.find(r => r.id === s.routeId);
      return driver?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             route?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             s.id.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [activeSchedules, drivers, routes, searchQuery]);

  const centerOnDriver = (driverId: string) => {
    setSelectedDriver(driverId);
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      toast.info(`Focusing on ${driver.name}`);
    }
  };

  const handleDriverClick = (driverId: string) => {
    setSelectedDriver(driverId);
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      toast.info(`Selected driver: ${driver.name}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground">Fleet Map</h2>
          <p className="text-muted-foreground font-medium text-sm">
            {enableGPS
              ? 'Pantau lokasi armada secara real-time dengan GPS.'
              : 'Lihat lokasi armada dan rute secara statis.'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn(
            "rounded-full px-3 py-1 font-black uppercase tracking-widest text-[10px]",
            enableGPS
              ? "bg-green-500/10 text-green-600 border-green-200"
              : "bg-blue-500/10 text-blue-600 border-blue-200"
          )}>
            {enableGPS ? '🛰️ GPS ACTIVE' : '✓ STATIC MAP'}
          </Badge>

          <Button
            variant={enableGPS ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEnableGPS(!enableGPS)}
            className="rounded-xl font-black uppercase tracking-widest text-[10px]"
          >
            <Activity className="h-3.5 w-3.5 mr-2" />
            {enableGPS ? 'Disable GPS' : 'Enable GPS'}
          </Button>

          <Button
            variant={showLegend ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
            className="rounded-xl font-black uppercase tracking-widest text-[10px]"
          >
            {showLegend ? <Eye className="h-3.5 w-3.5 mr-2" /> : <EyeOff className="h-3.5 w-3.5 mr-2" />}
            Legend
          </Button>

          <Badge variant="outline" className="rounded-full bg-blue-500/10 text-blue-600 border-blue-200 px-3 py-1 font-black uppercase tracking-widest text-[10px]">
            📍 {activeSchedules.length}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <Card className="xl:col-span-3 border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-0 relative h-[650px]">
            {enableGPS ? (
              <GPSMap
                center={[3.5952, 98.6722]}
                zoom={13}
                className="w-full h-full"
                drivers={drivers}
                routes={routes}
                routePoints={routePoints}
                activeSchedules={activeSchedules}
                driverLocations={driverLocations}
                onDriverClick={handleDriverClick}
                enableGPS={true}
                updateInterval={5000}
              />
            ) : (
              <StaticMap
                center={[3.5952, 98.6722]}
                zoom={13}
                className="w-full h-full"
                drivers={drivers}
                routes={routes}
                routePoints={routePoints}
                activeSchedules={activeSchedules}
                onDriverClick={handleDriverClick}
              />
            )}

            {/* Search Overlay */}
            <div className="absolute top-6 left-6 z-[400] w-72">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Cari Driver / Rute..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 bg-white/90 backdrop-blur-md border-none shadow-xl rounded-2xl font-bold focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* Map Legend */}
            {showLegend && <MapLegend variant="compact" position="bottom-right" />}
          </CardContent>
        </Card>

        {/* Fleet List Sidebar */}
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-4">
            <div className="space-y-4">
              <section className="space-y-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground/80 px-2 flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5" /> Fleet List
                </h3>
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredSchedules.length === 0 ? (
                <div className="p-8 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-border/40">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest">No Active Units</p>
                </div>
              ) : (
                filteredSchedules.map(s => {
                  const driver = drivers.find(d => d.id === s.driverId);
                  const route = routes.find(r => r.id === s.routeId);
                  const isSelected = selectedDriver === s.driverId;

                  return (
                    <Card
                      key={s.id}
                      className={cn(
                        "group relative overflow-hidden border-border/40 transition-all active:scale-[0.98] cursor-pointer rounded-[1.5rem] hover:shadow-lg",
                        isSelected ? "ring-2 ring-primary ring-offset-2 bg-primary/5 border-primary/20" : "bg-card hover:border-primary/30"
                      )}
                      onClick={() => centerOnDriver(s.driverId!)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all",
                              isSelected ? "bg-primary text-white" : "bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                              {driver?.name.charAt(0)}
                            </div>
                            <div>
                              <p className={cn("font-black text-sm transition-colors", isSelected ? "text-primary" : "text-foreground")}>
                                {driver?.name}
                              </p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter leading-none">
                                {route?.name}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={cn(
                            "rounded-full text-[9px] font-black uppercase px-2 py-0 border-none",
                            s.status === 'departed' ? "bg-indigo-500/10 text-indigo-600" : "bg-amber-500/10 text-amber-600"
                          )}>
                            {s.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </section>
        </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTracking;