import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign, 
  Users, 
  Wrench,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { MOCK_EQUIPMENT } from '@/data/mockData';
import { MOCK_STUDENTS, MOCK_BOOKINGS } from '@/data/mockBookings';
import { toast } from '@/hooks/use-toast';

const EquipmentBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Mock available slots for selected date and equipment
  const availableSlots = [
    { id: 'morning-1', name: 'Early Morning (8-10 AM)', available: true, cost: 50, booked: false },
    { id: 'morning-2', name: 'Morning (10-12 PM)', available: false, cost: 50, booked: true },
    { id: 'afternoon-1', name: 'Afternoon (12-2 PM)', available: true, cost: 60, booked: false },
    { id: 'afternoon-2', name: 'Afternoon (2-4 PM)', available: true, cost: 60, booked: false },
    { id: 'evening-1', name: 'Evening (4-6 PM)', available: false, cost: 70, booked: true },
    { id: 'evening-2', name: 'Evening (6-8 PM)', available: true, cost: 70, booked: false },
    { id: 'night-1', name: 'Night (8-10 PM)', available: true, cost: 80, booked: false },
  ];

  // Mock equipment availability calendar data
  const getEquipmentAvailability = (date: Date) => {
    const dateStr = date.toDateString();
    // Simulate different availability patterns
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'unavailable'; // Weekends unavailable
    }
    
    // Check if there are any bookings for this date
    const hasBookings = MOCK_BOOKINGS.some(booking => 
      booking.date === date.toISOString().split('T')[0]
    );
    
    if (hasBookings) {
      return 'partial'; // Some slots booked
    }
    
    return 'available'; // Fully available
  };

  // Custom day renderer for calendar
  const DayContent = ({ date, ...props }: any) => {
    if (!selectedEquipment) return <div {...props}>{date.getDate()}</div>;
    
    const availability = getEquipmentAvailability(date);
    const isSelected = selectedDate?.toDateString() === date.toDateString();
    
    let bgColor = '';
    switch (availability) {
      case 'available':
        bgColor = isSelected ? 'bg-success text-success-foreground' : 'hover:bg-success/20 text-success';
        break;
      case 'partial':
        bgColor = isSelected ? 'bg-warning text-warning-foreground' : 'hover:bg-warning/20 text-warning';
        break;
      case 'unavailable':
        bgColor = 'bg-destructive/10 text-destructive cursor-not-allowed opacity-50';
        break;
    }
    
    return (
      <div 
        {...props}
        className={`relative w-full h-full flex items-center justify-center rounded-md transition-colors ${bgColor}`}
      >
        {date.getDate()}
        {availability !== 'unavailable' && (
          <div className={`absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${
            availability === 'available' ? 'bg-success' : 
            availability === 'partial' ? 'bg-warning' : 'bg-destructive'
          }`} />
        )}
      </div>
    );
  };

  const handleBooking = () => {
    if (!selectedEquipment || !selectedSlot || !selectedStudent || !selectedDate) {
      toast({
        title: "Validation Error",
        description: "Please select equipment, slot, and student",
        variant: "destructive"
      });
      return;
    }

    const equipment = MOCK_EQUIPMENT.find(e => e.id === selectedEquipment);
    const student = MOCK_STUDENTS.find(s => s.id === selectedStudent);
    const slot = availableSlots.find(s => s.id === selectedSlot);

    toast({
      title: "Booking Confirmed",
      description: `${equipment?.name} booked for ${student?.name} on ${selectedDate.toDateString()}`,
    });

    setIsBookingModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedEquipment('');
    setSelectedSlot('');
    setSelectedStudent('');
  };

  const getSlotStatus = (available: boolean, booked: boolean = false) => {
    if (booked) return { color: 'bg-destructive/10 text-destructive border-destructive/20', text: 'Booked', icon: XCircle };
    if (available) return { color: 'bg-success/10 text-success border-success/20', text: 'Available', icon: CheckCircle };
    return { color: 'bg-muted/10 text-muted-foreground border-muted/20', text: 'Unavailable', icon: AlertCircle };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <CalendarIcon className="h-8 w-8 text-primary" />
          Equipment Booking
        </h1>
        <p className="text-muted-foreground mt-1">
          Schedule equipment bookings for your students
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar & Equipment Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Date & Equipment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div className="space-y-4">
                <h3 className="font-medium">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    return date < new Date() || (selectedEquipment && isWeekend);
                  }}
                  components={{
                    DayContent: selectedEquipment ? DayContent : undefined
                  }}
                  className="rounded-md border pointer-events-auto"
                />
              </div>

              {/* Equipment Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Select Equipment</h3>
                  <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_EQUIPMENT.filter(e => e.status === 'Active').map(equipment => (
                        <SelectItem key={equipment.id} value={equipment.id}>
                          {equipment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Select Student</h3>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose student" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_STUDENTS.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - {student.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDate && selectedEquipment && (
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">Selected Equipment</p>
                      <p className="text-lg">{MOCK_EQUIPMENT.find(e => e.id === selectedEquipment)?.name}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">Selected Date</p>
                      <p className="text-lg">{selectedDate.toDateString()}</p>
                    </div>
                    {/* Calendar Legend */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Availability Legend:</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-success rounded-full"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-warning rounded-full"></div>
                          <span>Partial</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-destructive rounded-full"></div>
                          <span>Unavailable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Available Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedEquipment || !selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select equipment and date to view available slots</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableSlots.map(slot => {
                  const status = getSlotStatus(slot.available, slot.booked);
                  const StatusIcon = status.icon;
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
                        <Badge className={`${status.color} border text-xs flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
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

                {selectedSlot && (
                  <Button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full mt-4 bg-gradient-primary hover:opacity-90"
                  >
                    Confirm Booking
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="space-y-4">
                {MOCK_BOOKINGS.filter(b => b.status === 'pending').map(booking => (
                  <Card key={booking.id} className="border-l-4 border-l-warning">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.equipmentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.studentName} • {booking.date} • {booking.startTime}-{booking.endTime}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-success hover:bg-success/90">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approved">
              <div className="space-y-4">
                {MOCK_BOOKINGS.filter(b => b.status === 'approved').map(booking => (
                  <Card key={booking.id} className="border-l-4 border-l-success">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.equipmentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.studentName} • {booking.date} • {booking.startTime}-{booking.endTime}
                          </p>
                        </div>
                        <Badge className="bg-success/10 text-success border-success/20">
                          Approved
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4">
                {MOCK_BOOKINGS.filter(b => b.status === 'completed').map(booking => (
                  <Card key={booking.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.equipmentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.studentName} • {booking.date} • {booking.startTime}-{booking.endTime}
                          </p>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Completed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Booking Confirmation Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Equipment:</span>
                <span className="font-medium">
                  {MOCK_EQUIPMENT.find(e => e.id === selectedEquipment)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student:</span>
                <span className="font-medium">
                  {MOCK_STUDENTS.find(s => s.id === selectedStudent)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{selectedDate?.toDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Slot:</span>
                <span className="font-medium">
                  {availableSlots.find(s => s.id === selectedSlot)?.name}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-muted-foreground">Cost:</span>
                <span className="font-bold text-lg">
                  ${availableSlots.find(s => s.id === selectedSlot)?.cost}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsBookingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleBooking} className="bg-gradient-primary hover:opacity-90">
                Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentBooking;