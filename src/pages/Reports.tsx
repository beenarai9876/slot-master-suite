import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  FileBarChart, 
  Download, 
  Search, 
  Calendar,
  DollarSign,
  TrendingUp,
  Filter
} from 'lucide-react';
import { MOCK_BOOKINGS } from '@/data/mockBookings';
import { toast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [bookingFilters, setBookingFilters] = useState({
    equipment: 'all',
    department: 'all',
    supervisor: 'all',
    dateStart: '',
    dateEnd: ''
  });
  
  const [financialFilters, setFinancialFilters] = useState({
    supervisor: 'all',
    equipment: 'all',
    department: 'all',
    type: 'all'
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleExportReport = (reportType: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${reportType} report. Download will begin shortly.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      approved: 'bg-success/10 text-success border-success/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20',
      completed: 'bg-primary/10 text-primary border-primary/20'
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const mockFinancialData = [
    { id: '1', type: 'Purchase', supervisor: 'Dr. Sarah Wilson', equipment: 'Microscope Pro X1', department: 'Computer Science', amount: 250, date: '2024-01-15' },
    { id: '2', type: 'Credit Allotment', supervisor: 'Prof. Michael Chen', equipment: 'N/A', department: 'Engineering', amount: 1000, date: '2024-01-14' },
    { id: '3', type: 'Refund', supervisor: 'Dr. Emily Rodriguez', equipment: 'PCR Machine P200', department: 'Biology', amount: -75, date: '2024-01-13' },
  ];

  const filteredBookings = MOCK_BOOKINGS.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <FileBarChart className="h-8 w-8 text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate and analyze booking and financial reports
        </p>
      </div>

      <Tabs defaultValue="booking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="booking">Booking Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>

        {/* Booking Reports */}
        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Booking Reports</span>
                <Button onClick={() => handleExportReport('Booking')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipment</Label>
                  <Select
                    value={bookingFilters.equipment}
                    onValueChange={(value) => 
                      setBookingFilters(prev => ({ ...prev, equipment: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Equipment</SelectItem>
                      <SelectItem value="microscope">Microscope Pro X1</SelectItem>
                      <SelectItem value="printer">3D Printer Delta</SelectItem>
                      <SelectItem value="oscilloscope">Oscilloscope OS500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={bookingFilters.department}
                    onValueChange={(value) => 
                      setBookingFilters(prev => ({ ...prev, department: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="eng">Engineering</SelectItem>
                      <SelectItem value="bio">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Select
                    value={bookingFilters.supervisor}
                    onValueChange={(value) => 
                      setBookingFilters(prev => ({ ...prev, supervisor: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Supervisors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Supervisors</SelectItem>
                      <SelectItem value="wilson">Dr. Sarah Wilson</SelectItem>
                      <SelectItem value="chen">Prof. Michael Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateStart">Start Date</Label>
                  <Input
                    id="dateStart"
                    type="date"
                    value={bookingFilters.dateStart}
                    onChange={(e) => 
                      setBookingFilters(prev => ({ ...prev, dateStart: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateEnd">End Date</Label>
                  <Input
                    id="dateEnd"
                    type="date"
                    value={bookingFilters.dateEnd}
                    onChange={(e) => 
                      setBookingFilters(prev => ({ ...prev, dateEnd: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header">
                      <TableHead>Equipment</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id} className="table-row">
                        <TableCell>
                          <div className="font-medium">{booking.equipmentName}</div>
                          <div className="text-sm text-muted-foreground">{booking.slotName}</div>
                        </TableCell>
                        <TableCell>{booking.studentName}</TableCell>
                        <TableCell>{booking.supervisorName}</TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="font-medium">${booking.cost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Reports */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Financial Reports</span>
                <Button onClick={() => handleExportReport('Financial')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="searchFinancial">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="searchFinancial"
                      placeholder="Search transactions..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Supervisor</Label>
                  <Select
                    value={financialFilters.supervisor}
                    onValueChange={(value) => 
                      setFinancialFilters(prev => ({ ...prev, supervisor: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Supervisors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Supervisors</SelectItem>
                      <SelectItem value="wilson">Dr. Sarah Wilson</SelectItem>
                      <SelectItem value="chen">Prof. Michael Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Equipment</Label>
                  <Select
                    value={financialFilters.equipment}
                    onValueChange={(value) => 
                      setFinancialFilters(prev => ({ ...prev, equipment: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Equipment</SelectItem>
                      <SelectItem value="microscope">Microscope Pro X1</SelectItem>
                      <SelectItem value="printer">3D Printer Delta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={financialFilters.department}
                    onValueChange={(value) => 
                      setFinancialFilters(prev => ({ ...prev, department: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="eng">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <Select
                    value={financialFilters.type}
                    onValueChange={(value) => 
                      setFinancialFilters(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="refund">Refund</SelectItem>
                      <SelectItem value="credit">Credit Allotment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header">
                      <TableHead>Type</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFinancialData.map((transaction) => (
                      <TableRow key={transaction.id} className="table-row">
                        <TableCell>
                          <Badge variant={transaction.type === 'Refund' ? 'destructive' : 'secondary'}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.supervisor}</TableCell>
                        <TableCell>{transaction.equipment}</TableCell>
                        <TableCell>{transaction.department}</TableCell>
                        <TableCell className={`font-medium ${transaction.amount < 0 ? 'text-destructive' : 'text-success'}`}>
                          ${Math.abs(transaction.amount)}
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">$12,450</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Equipment</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Utilization Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <FileBarChart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default Reports;
