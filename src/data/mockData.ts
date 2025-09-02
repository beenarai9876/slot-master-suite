import { Equipment } from '@/types/equipment';

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: '1',
    name: 'Microscope Pro X1',
    status: 'Active',
    place: 'Lab A - Room 101',
    description: 'High-resolution digital microscope for advanced research',
    labHours: '8 AM - 6 PM'
  },
  {
    id: '2',
    name: 'Centrifuge Model C200',
    status: 'Maintenance',
    place: 'Lab B - Room 205',
    description: 'High-speed centrifuge for sample preparation',
    labHours: '24/7'
  },
  {
    id: '3',
    name: '3D Printer Delta',
    status: 'Active',
    place: 'Engineering Lab',
    description: 'Professional grade 3D printer for prototyping',
    labHours: '9 AM - 9 PM'
  },
  {
    id: '4',
    name: 'Oscilloscope OS500',
    status: 'Active',
    place: 'Electronics Lab',
    description: 'Digital storage oscilloscope for circuit analysis',
    labHours: '8 AM - 8 PM'
  },
  {
    id: '5',
    name: 'Spectrometer SP100',
    status: 'Retired',
    place: 'Chemistry Lab',
    description: 'UV-Vis spectrometer for chemical analysis',
    labHours: 'N/A'
  },
  {
    id: '6',
    name: 'Laser Cutter LC300',
    status: 'Active',
    place: 'Maker Space',
    description: 'Precision laser cutting machine',
    labHours: '10 AM - 6 PM'
  },
  {
    id: '7',
    name: 'PCR Machine P200',
    status: 'Maintenance',
    place: 'Biology Lab',
    description: 'Thermal cycler for DNA amplification',
    labHours: '8 AM - 10 PM'
  },
  {
    id: '8',
    name: 'CNC Mill M400',
    status: 'Active',
    place: 'Machine Shop',
    description: 'Computer-controlled milling machine',
    labHours: '8 AM - 5 PM'
  }
];

export const MOCK_SUPERVISORS = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@university.edu',
    phone: '+1-555-0101',
    amount: 5000,
    department: 'Computer Science',
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    phone: '+1-555-0102',
    amount: 7500,
    department: 'Engineering',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    phone: '+1-555-0103',
    amount: 3200,
    department: 'Biology',
  },
  {
    id: '4',
    name: 'Prof. David Kim',
    email: 'david.kim@university.edu',
    phone: '+1-555-0104',
    amount: 8900,
    department: 'Chemistry',
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    email: 'lisa.thompson@university.edu',
    phone: '+1-555-0105',
    amount: 4600,
    department: 'Physics',
  }
];