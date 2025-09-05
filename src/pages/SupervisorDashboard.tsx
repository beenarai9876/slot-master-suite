import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { MOCK_STUDENTS, MOCK_BOOKINGS } from '@/data/mockBookings';
import { useAuth } from '@/contexts/AuthContext';

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Filter data for current supervisor
  const myStudents = MOCK_STUDENTS.filter(student => student.supervisorId === user?.id);
  const todayBookings = MOCK_BOOKINGS.filter(booking => 
    booking.date === new Date().toISOString().split('T')[0]
  );
  const pendingBookings = MOCK_BOOKINGS.filter(b => b.status === 'pending');
  
  const stats = [
    {
      title: 'My Students',
      value: myStudents.length.toString(),
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: "Today's Bookings",
      value: todayBookings.length.toString(),
      icon: Calendar,
      color: 'text-success',
      bg: 'bg-success/10'
    },
    {
      title: 'Pending Approvals',
      value: pendingBookings.length.toString(),
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
    {
      title: 'Total Credit Allocated',
      value: '$2,450',
      icon: DollarSign,
      color: 'text-accent',
      bg: 'bg-accent/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here's your supervision overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Student Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_BOOKINGS.slice(0, 5).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{booking.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.equipmentName} • {booking.date}
                    </p>
                  </div>
                  <Badge 
                    variant={booking.status === 'approved' ? 'default' : 
                            booking.status === 'pending' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Equipment Booking
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Students
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Allocate Credits
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Review Pending Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      {pendingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pending Booking Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingBookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{booking.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.equipmentName} • {booking.date} • {booking.startTime}-{booking.endTime}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-success hover:bg-success/90">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupervisorDashboard;