import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Plus, Trash2, Edit, Download, Upload, Eye, Settings as SettingsIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Holiday, BookingRule, MaintenanceBreak } from '@/types/index';

const Settings: React.FC = () => {
  // Holidays State
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: '1', name: 'Diwali', date: '2025-10-20', type: 'full', description: 'Festival of Lights' },
    { id: '2', name: 'Republic Day', date: '2025-01-26', type: 'full', description: 'National Holiday' },
    { id: '3', name: 'Holi', date: '2025-03-14', type: 'half', description: 'Festival of Colors' },
  ]);

  // Booking Rules State
  const [bookingRules, setBookingRules] = useState<BookingRule[]>([
    { id: '1', name: 'No Saturday Bookings', type: 'weekday', value: '6', enabled: true, description: 'Lab closed on Saturdays' },
    { id: '2', name: 'Lab Hours', type: 'time_range', value: '09:00-18:00', enabled: true, description: 'Bookings only between 9 AM - 6 PM' },
    { id: '3', name: 'Holiday Closure', type: 'holiday', value: 'true', enabled: true, description: 'Closed on public holidays' },
  ]);

  // Maintenance Breaks State
  const [maintenanceBreaks, setMaintenanceBreaks] = useState<MaintenanceBreak[]>([
    { id: '1', name: 'Lunch Break', startTime: '13:00', endTime: '14:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], enabled: true },
    { id: '2', name: 'Morning Maintenance', startTime: '08:00', endTime: '09:00', days: ['monday', 'wednesday'], enabled: true },
  ]);

  // Dialog States
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [breakDialogOpen, setBreakDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  // Form States
  const [holidayForm, setHolidayForm] = useState({ name: '', date: undefined as Date | undefined, type: 'full', description: '' });
  const [ruleForm, setRuleForm] = useState({ name: '', type: 'weekday', value: '', description: '' });
  const [breakForm, setBreakForm] = useState({ name: '', startTime: '', endTime: '', days: [] as string[] });

  // Holiday Functions
  const handleAddHoliday = () => {
    if (!holidayForm.name || !holidayForm.date) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const newHoliday: Holiday = {
      id: Date.now().toString(),
      name: holidayForm.name,
      date: format(holidayForm.date, 'yyyy-MM-dd'),
      type: holidayForm.type as 'full' | 'half',
      description: holidayForm.description,
    };

    setHolidays([...holidays, newHoliday]);
    setHolidayDialogOpen(false);
    setHolidayForm({ name: '', date: undefined, type: 'full', description: '' });
    toast({ title: 'Success', description: 'Holiday added successfully' });
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
    toast({ title: 'Success', description: 'Holiday deleted successfully' });
  };

  // Booking Rule Functions
  const handleAddRule = () => {
    if (!ruleForm.name || !ruleForm.value) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const newRule: BookingRule = {
      id: Date.now().toString(),
      name: ruleForm.name,
      type: ruleForm.type as 'weekday' | 'time_range' | 'holiday',
      value: ruleForm.value,
      enabled: true,
      description: ruleForm.description,
    };

    setBookingRules([...bookingRules, newRule]);
    setRuleDialogOpen(false);
    setRuleForm({ name: '', type: 'weekday', value: '', description: '' });
    toast({ title: 'Success', description: 'Booking rule added successfully' });
  };

  const handleToggleRule = (id: string) => {
    setBookingRules(bookingRules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleDeleteRule = (id: string) => {
    setBookingRules(bookingRules.filter(r => r.id !== id));
    toast({ title: 'Success', description: 'Rule deleted successfully' });
  };

  // Maintenance Break Functions
  const handleAddBreak = () => {
    if (!breakForm.name || !breakForm.startTime || !breakForm.endTime || breakForm.days.length === 0) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const newBreak: MaintenanceBreak = {
      id: Date.now().toString(),
      name: breakForm.name,
      startTime: breakForm.startTime,
      endTime: breakForm.endTime,
      days: breakForm.days,
      enabled: true,
    };

    setMaintenanceBreaks([...maintenanceBreaks, newBreak]);
    setBreakDialogOpen(false);
    setBreakForm({ name: '', startTime: '', endTime: '', days: [] });
    toast({ title: 'Success', description: 'Maintenance break added successfully' });
  };

  const handleToggleBreak = (id: string) => {
    setMaintenanceBreaks(maintenanceBreaks.map(brk =>
      brk.id === id ? { ...brk, enabled: !brk.enabled } : brk
    ));
  };

  const handleDeleteBreak = (id: string) => {
    setMaintenanceBreaks(maintenanceBreaks.filter(b => b.id !== id));
    toast({ title: 'Success', description: 'Break deleted successfully' });
  };

  // Import/Export Functions
  const handleExportHolidays = () => {
    const csv = [
      ['Name', 'Date', 'Type', 'Description'].join(','),
      ...holidays.map(h => [h.name, h.date, h.type, h.description || ''].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'holidays.csv';
    a.click();
    toast({ title: 'Success', description: 'Holidays exported successfully' });
  };

  const handleImportHolidays = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').slice(1); // Skip header
      const importedHolidays = lines
        .filter(line => line.trim())
        .map((line, index) => {
          const [name, date, type, description] = line.split(',');
          return {
            id: `imported-${Date.now()}-${index}`,
            name: name.trim(),
            date: date.trim(),
            type: (type.trim() as 'full' | 'half') || 'full',
            description: description?.trim() || '',
          };
        });

      setHolidays([...holidays, ...importedHolidays]);
      toast({ title: 'Success', description: `${importedHolidays.length} holidays imported` });
    };
    reader.readAsText(file);
  };

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const toggleDay = (day: string) => {
    setBreakForm({
      ...breakForm,
      days: breakForm.days.includes(day)
        ? breakForm.days.filter(d => d !== day)
        : [...breakForm.days, day]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage holidays, booking rules, and maintenance schedules</p>
        </div>
        <Button variant="outline" onClick={() => setPreviewDialogOpen(true)}>
          <Eye className="mr-2 h-4 w-4" />
          Preview Calendar
        </Button>
      </div>

      <Tabs defaultValue="holidays" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="holidays">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Holidays
          </TabsTrigger>
          <TabsTrigger value="rules">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Booking Rules
          </TabsTrigger>
          <TabsTrigger value="breaks">
            <Clock className="mr-2 h-4 w-4" />
            Maintenance Breaks
          </TabsTrigger>
        </TabsList>

        {/* Holidays Tab */}
        <TabsContent value="holidays" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Global Holidays</CardTitle>
                  <CardDescription>Manage institute-wide holidays and closures</CardDescription>
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportHolidays}
                    className="hidden"
                    id="import-holidays"
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('import-holidays')?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportHolidays}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Dialog open={holidayDialogOpen} onOpenChange={setHolidayDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Holiday
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Holiday</DialogTitle>
                        <DialogDescription>Create a new holiday or closure date</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="holiday-name">Holiday Name *</Label>
                          <Input
                            id="holiday-name"
                            placeholder="e.g., Diwali, Institute Day"
                            value={holidayForm.name}
                            onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !holidayForm.date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {holidayForm.date ? format(holidayForm.date, 'PPP') : 'Pick a date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={holidayForm.date} onSelect={(date) => setHolidayForm({ ...holidayForm, date })} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="holiday-type">Type *</Label>
                          <Select value={holidayForm.type} onValueChange={(value) => setHolidayForm({ ...holidayForm, type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full">Full Day</SelectItem>
                              <SelectItem value="half">Half Day</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="holiday-description">Description</Label>
                          <Textarea
                            id="holiday-description"
                            placeholder="Optional description"
                            value={holidayForm.description}
                            onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setHolidayDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddHoliday}>Add Holiday</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holiday Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holidays.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No holidays added yet. Click "Add Holiday" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    holidays.map((holiday) => (
                      <TableRow key={holiday.id}>
                        <TableCell className="font-medium">{holiday.name}</TableCell>
                        <TableCell>{format(new Date(holiday.date), 'PPP')}</TableCell>
                        <TableCell>
                          <Badge variant={holiday.type === 'full' ? 'default' : 'secondary'}>
                            {holiday.type === 'full' ? 'Full Day' : 'Half Day'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{holiday.description || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteHoliday(holiday.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lab-Wide Booking Rules</CardTitle>
                  <CardDescription>Configure restrictions and policies for equipment bookings</CardDescription>
                </div>
                <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Booking Rule</DialogTitle>
                      <DialogDescription>Create a new booking restriction or policy</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="rule-name">Rule Name *</Label>
                        <Input
                          id="rule-name"
                          placeholder="e.g., No Weekend Bookings"
                          value={ruleForm.name}
                          onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rule-type">Rule Type *</Label>
                        <Select value={ruleForm.type} onValueChange={(value) => setRuleForm({ ...ruleForm, type: value, value: '' })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekday">Weekday Restriction</SelectItem>
                            <SelectItem value="time_range">Time Range</SelectItem>
                            <SelectItem value="holiday">Holiday Closure</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rule-value">Value *</Label>
                        {ruleForm.type === 'weekday' && (
                          <Select value={ruleForm.value} onValueChange={(value) => setRuleForm({ ...ruleForm, value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Sunday</SelectItem>
                              <SelectItem value="1">Monday</SelectItem>
                              <SelectItem value="2">Tuesday</SelectItem>
                              <SelectItem value="3">Wednesday</SelectItem>
                              <SelectItem value="4">Thursday</SelectItem>
                              <SelectItem value="5">Friday</SelectItem>
                              <SelectItem value="6">Saturday</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        {ruleForm.type === 'time_range' && (
                          <Input
                            id="rule-value"
                            placeholder="e.g., 09:00-18:00"
                            value={ruleForm.value}
                            onChange={(e) => setRuleForm({ ...ruleForm, value: e.target.value })}
                          />
                        )}
                        {ruleForm.type === 'holiday' && (
                          <Select value={ruleForm.value} onValueChange={(value) => setRuleForm({ ...ruleForm, value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Close on holidays</SelectItem>
                              <SelectItem value="false">Allow on holidays</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rule-description">Description</Label>
                        <Textarea
                          id="rule-description"
                          placeholder="Optional description"
                          value={ruleForm.description}
                          onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setRuleDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddRule}>Add Rule</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingRules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No booking rules configured. Click "Add Rule" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookingRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {rule.type === 'weekday' ? 'Weekday' : rule.type === 'time_range' ? 'Time Range' : 'Holiday'}
                          </Badge>
                        </TableCell>
                        <TableCell>{rule.value}</TableCell>
                        <TableCell className="text-muted-foreground">{rule.description || '-'}</TableCell>
                        <TableCell>
                          <Switch checked={rule.enabled} onCheckedChange={() => handleToggleRule(rule.id)} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Breaks Tab */}
        <TabsContent value="breaks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Maintenance & Break Schedules</CardTitle>
                  <CardDescription>Define recurring time slots when bookings are not allowed</CardDescription>
                </div>
                <Dialog open={breakDialogOpen} onOpenChange={setBreakDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Break
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Maintenance Break</DialogTitle>
                      <DialogDescription>Create a recurring time slot for breaks or maintenance</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="break-name">Break Name *</Label>
                        <Input
                          id="break-name"
                          placeholder="e.g., Lunch Break"
                          value={breakForm.name}
                          onChange={(e) => setBreakForm({ ...breakForm, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="break-start">Start Time *</Label>
                          <Input
                            id="break-start"
                            type="time"
                            value={breakForm.startTime}
                            onChange={(e) => setBreakForm({ ...breakForm, startTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="break-end">End Time *</Label>
                          <Input
                            id="break-end"
                            type="time"
                            value={breakForm.endTime}
                            onChange={(e) => setBreakForm({ ...breakForm, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Recurring Days *</Label>
                        <div className="flex flex-wrap gap-2">
                          {weekdays.map((day) => (
                            <Button
                              key={day}
                              type="button"
                              variant={breakForm.days.includes(day) ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => toggleDay(day)}
                              className="capitalize"
                            >
                              {day.slice(0, 3)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setBreakDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddBreak}>Add Break</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Break Name</TableHead>
                    <TableHead>Time Range</TableHead>
                    <TableHead>Recurring Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceBreaks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No maintenance breaks configured. Click "Add Break" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    maintenanceBreaks.map((brk) => (
                      <TableRow key={brk.id}>
                        <TableCell className="font-medium">{brk.name}</TableCell>
                        <TableCell>{brk.startTime} - {brk.endTime}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {brk.days.map((day) => (
                              <Badge key={day} variant="secondary" className="capitalize text-xs">
                                {day.slice(0, 3)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch checked={brk.enabled} onCheckedChange={() => handleToggleBreak(brk.id)} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteBreak(brk.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Calendar Preview</DialogTitle>
            <DialogDescription>Visual representation of upcoming holidays and closures</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Upcoming Holidays</h3>
                <div className="space-y-2">
                  {holidays
                    .filter(h => new Date(h.date) >= new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 5)
                    .map((holiday) => (
                      <div key={holiday.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{holiday.name}</p>
                          <p className="text-sm text-muted-foreground">{format(new Date(holiday.date), 'PPP')}</p>
                        </div>
                        <Badge variant={holiday.type === 'full' ? 'default' : 'secondary'}>
                          {holiday.type === 'full' ? 'Full' : 'Half'}
                        </Badge>
                      </div>
                    ))}
                  {holidays.filter(h => new Date(h.date) >= new Date()).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No upcoming holidays</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Active Rules & Breaks</h3>
                <div className="space-y-2">
                  {bookingRules.filter(r => r.enabled).map((rule) => (
                    <div key={rule.id} className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-sm">{rule.name}</p>
                      <p className="text-xs text-muted-foreground">{rule.description}</p>
                    </div>
                  ))}
                  {maintenanceBreaks.filter(b => b.enabled).map((brk) => (
                    <div key={brk.id} className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-sm">{brk.name}</p>
                      <p className="text-xs text-muted-foreground">{brk.startTime} - {brk.endTime}</p>
                    </div>
                  ))}
                  {bookingRules.filter(r => r.enabled).length === 0 && maintenanceBreaks.filter(b => b.enabled).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No active rules or breaks</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
