import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { 
  Search, 
  Wrench, 
  MapPin, 
  Clock, 
  DollarSign,
  Calendar as CalendarIcon,
  Star,
  BookOpen,
  Filter,
  Eye,
  Heart,
  CheckCircle
} from 'lucide-react';
import { MOCK_EQUIPMENT } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const EquipmentCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Maintenance'>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const locations = [...new Set(MOCK_EQUIPMENT.map(e => e.place))];
  
  const filteredEquipment = MOCK_EQUIPMENT.filter(equipment => {
    const matchesSearch = searchTerm === '' || 
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || equipment.status === filterStatus;
    const matchesLocation = filterLocation === 'all' || equipment.place === filterLocation;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Mock available slots
  const availableSlots = [
    { id: 'morning-1', name: 'Early Morning (8-10 AM)', available: true, cost: 50 },
    { id: 'morning-2', name: 'Morning (10-12 PM)', available: false, cost: 50 },
    { id: 'afternoon-1', name: 'Afternoon (12-2 PM)', available: true, cost: 60 },
    { id: 'afternoon-2', name: 'Afternoon (2-4 PM)', available: true, cost: 60 },
    { id: 'evening-1', name: 'Evening (4-6 PM)', available: false, cost: 70 },
    { id: 'evening-2', name: 'Evening (6-8 PM)', available: true, cost: 70 },
  ];

  const handleViewDetails = (equipment: any) => {
    setSelectedEquipment(equipment);
    setIsDetailModalOpen(true);
  };

  const handleRequestBooking = (equipment: any) => {
    setSelectedEquipment(equipment);
    setSelectedDate(new Date());
    setSelectedSlot('');
    setIsBookingModalOpen(true);
  };

  const handleBookingRequest = () => {
    if (!selectedDate || !selectedSlot) {
      toast({
        title: "Validation Error",
        description: "Please select date and time slot",
        variant: "destructive"
      });
      return;
    }

    const slot = availableSlots.find(s => s.id === selectedSlot);
    
    toast({
      title: "Booking Request Sent",
      description: `Request for ${selectedEquipment?.name} on ${selectedDate.toDateString()} has been sent to your supervisor for approval`,
    });

    setIsBookingModalOpen(false);
  };

  const toggleFavorite = (equipmentId: string) => {
    setFavorites(prev => 
      prev.includes(equipmentId) 
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: 'bg-success/10 text-success border-success/20',
      Maintenance: 'bg-warning/10 text-warning border-warning/20',
      Retired: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border`}>
        {status}
      </Badge>
    );
  };

  const getSlotStatus = (available: boolean) => {
    return available 
      ? { color: 'bg-success/10 text-success border-success/20', text: 'Available' }
      : { color: 'bg-destructive/10 text-destructive border-destructive/20', text: 'Booked' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Search className="h-8 w-8 text-primary" />
          Equipment Catalog
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse available equipment and request bookings
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Available</SelectItem>
                <SelectItem value="Maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterLocation}
              onValueChange={setFilterLocation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((equipment) => (
          <Card key={equipment.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {equipment.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(equipment.status)}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-warning" />
                      4.8
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(equipment.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      favorites.includes(equipment.id) 
                        ? 'fill-destructive text-destructive' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {equipment.place}
                </div>
                
                {equipment.labHours && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {equipment.labHours}
                  </div>
                )}

                {equipment.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {equipment.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">From </span>
                  <span className="font-semibold text-success">$50/slot</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(equipment)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  
                  {equipment.status === 'Active' && (
                    <Button
                      size="sm"
                      onClick={() => handleRequestBooking(equipment)}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Book
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No equipment found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Equipment Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedEquipment?.name}</span>
              {selectedEquipment && getStatusBadge(selectedEquipment.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedEquipment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Equipment Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedEquipment.place}</span>
                      </div>
                      {selectedEquipment.labHours && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedEquipment.labHours}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedEquipment.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedEquipment.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Booking Information</h3>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Base Rate: </span>
                        <span className="font-semibold text-success">$50/hour</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Max Duration: </span>
                        <span>3 hours per booking</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Advance Booking: </span>
                        <span>Required 24 hours</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Usage Guidelines</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Safety training required before first use</li>
                      <li>• Supervisor approval needed for booking</li>
                      <li>• Clean equipment after use</li>
                      <li>• Report any issues immediately</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Close
                </Button>
                {selectedEquipment.status === 'Active' && (
                  <Button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleRequestBooking(selectedEquipment);
                    }}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Request Booking
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Request Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Booking</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium">{selectedEquipment?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedEquipment?.place}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border pointer-events-auto"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Available Time Slots</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableSlots.map(slot => {
                    const status = getSlotStatus(slot.available);
                    return (
                      <div
                        key={slot.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedSlot === slot.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-muted-foreground/50'
                        } ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => slot.available && setSelectedSlot(slot.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{slot.name}</span>
                          <Badge className={`${status.color} border text-xs`}>
                            {status.text}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${slot.cost}
                          </span>
                          {selectedSlot === slot.id && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsBookingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBookingRequest}
                className="bg-gradient-primary hover:opacity-90"
                disabled={!selectedDate || !selectedSlot}
              >
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentCatalog;