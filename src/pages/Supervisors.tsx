import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Users, 
  MoreHorizontal,
  UserCheck,
  Trash2,
  DollarSign
} from 'lucide-react';
import { MOCK_SUPERVISORS } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Supervisors: React.FC = () => {
  const [supervisors, setSupervisors] = useState(MOCK_SUPERVISORS);
  const [filters, setFilters] = useState({
    name: '',
    department: 'all'
  });

  const departments = [...new Set(supervisors.map(s => s.department))];
  
  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesName = supervisor.name.toLowerCase().includes(filters.name.toLowerCase()) ||
                       supervisor.email.toLowerCase().includes(filters.name.toLowerCase());
    const matchesDepartment = filters.department === 'all' || supervisor.department === filters.department;
    return matchesName && matchesDepartment;
  });

  const handleManage = (id: string, name: string) => {
    toast({
      title: "Manage Supervisor",
      description: `Opening management panel for ${name}`,
    });
    // Would navigate to supervisor management page
  };

  const handleRemove = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setSupervisors(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Supervisor Removed",
        description: `${name} has been removed from the system`,
        variant: "destructive",
      });
    }
  };

  const handleAllocateCredits = (id: string, name: string) => {
    toast({
      title: "Allocate Credits",
      description: `Opening credit allocation for ${name}`,
    });
    // Would open credit allocation modal
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Supervisor Management
        </h1>
        <p className="text-muted-foreground mt-1">Manage supervisor accounts and credit allocations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supervisors</CardTitle>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={filters.name}
                  onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select
              value={filters.department}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, department: value }))
              }
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupervisors.map((supervisor) => (
                  <TableRow key={supervisor.id} className="table-row">
                    <TableCell>
                      <div className="font-medium">{supervisor.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{supervisor.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{supervisor.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className="bg-success/10 text-success font-medium"
                      >
                        ${supervisor.amount.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{supervisor.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <div className="p-1 space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleManage(supervisor.id, supervisor.name)}
                              className="w-full justify-start"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Manage Students
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAllocateCredits(supervisor.id, supervisor.name)}
                              className="w-full justify-start"
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Allocate Credits
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(supervisor.id, supervisor.name)}
                              className="w-full justify-start text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredSupervisors.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No supervisors found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Supervisors;