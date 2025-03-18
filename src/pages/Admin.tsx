
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  ParkingMeter, 
  Plus, 
  Edit, 
  Trash, 
  Check, 
  X,
  Settings,
  AlertTriangle,
  Users,
  Calendar
} from 'lucide-react';
import { SlotStatus } from '@/components/ParkingSlot';

// Types
interface ParkingSlot {
  id: string;
  name: string;
  status: SlotStatus;
  createdAt: string;
  lastUpdated: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  bookings: number;
  penalties: number;
}

interface Booking {
  id: string;
  slotId: string;
  slotName: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'overdue';
}

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('slots');
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [slotName, setSlotName] = useState('');
  const [slotStatus, setSlotStatus] = useState<SlotStatus>('available');
  
  // Load mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSlots(mockSlots);
      setUsers(mockUsers);
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Handle opening edit dialog
  const handleEditSlot = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setSlotName(slot.name);
    setSlotStatus(slot.status);
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  // Handle opening add dialog
  const handleAddSlot = () => {
    setSelectedSlot(null);
    setSlotName('');
    setSlotStatus('available');
    setIsEditing(false);
    setIsDialogOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedSlot) {
      // Update slot
      setSlots(prevSlots => 
        prevSlots.map(slot => 
          slot.id === selectedSlot.id ? 
          {
            ...slot,
            name: slotName,
            status: slotStatus,
            lastUpdated: new Date().toISOString()
          } : slot
        )
      );
      
      toast({
        title: "Slot Updated",
        description: `${slotName} has been updated successfully.`
      });
    } else {
      // Add new slot
      const newSlot: ParkingSlot = {
        id: `slot-${Date.now()}`,
        name: slotName,
        status: slotStatus,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      setSlots(prevSlots => [...prevSlots, newSlot]);
      
      toast({
        title: "Slot Added",
        description: `${slotName} has been added successfully.`
      });
    }
    
    setIsDialogOpen(false);
  };
  
  // Handle slot deletion
  const handleDeleteSlot = (id: string) => {
    // Delete slot
    setSlots(prevSlots => prevSlots.filter(slot => slot.id !== id));
    
    toast({
      title: "Slot Deleted",
      description: "The parking slot has been removed successfully."
    });
  };
  
  // Handle change slot status
  const handleChangeStatus = (id: string, newStatus: SlotStatus) => {
    // Update slot status
    setSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === id ? 
        {
          ...slot,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        } : slot
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Slot status changed to ${newStatus}.`
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-4 md:px-6 pt-28 pb-16 page-animation">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage parking slots, users, and bookings</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'slots' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('slots')}
              className="flex items-center gap-2"
            >
              <ParkingMeter className="h-4 w-4" />
              Slots
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('users')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Users
            </Button>
            <Button 
              variant={activeTab === 'bookings' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('bookings')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Bookings
            </Button>
          </div>
        </div>
        
        {activeTab === 'slots' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Parking Slots</CardTitle>
                    <CardDescription>Manage all parking slots in the system</CardDescription>
                  </div>
                  
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleAddSlot} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Slot
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Parking Slot' : 'Add New Parking Slot'}</DialogTitle>
                        <DialogDescription>
                          {isEditing ? 'Update the details for this parking slot.' : 'Fill in the details to add a new parking slot.'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Slot Name</Label>
                          <Input
                            id="name"
                            value={slotName}
                            onChange={(e) => setSlotName(e.target.value)}
                            placeholder="e.g. Slot A1"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select value={slotStatus} onValueChange={(value: SlotStatus) => setSlotStatus(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="occupied">Occupied</SelectItem>
                              <SelectItem value="reserved">Reserved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <DialogFooter className="mt-6">
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {isEditing ? 'Update Slot' : 'Add Slot'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-100 rounded-md"></div>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-50 rounded-md"></div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {slots.map((slot) => (
                          <TableRow key={slot.id}>
                            <TableCell className="font-medium">{slot.name}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                ${slot.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                                ${slot.status === 'occupied' ? 'bg-blue-100 text-blue-800' : ''}
                                ${slot.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${slot.status === 'reserved' ? 'bg-purple-100 text-purple-800' : ''}
                                ${slot.status === 'overdue' ? 'bg-red-100 text-red-800' : ''}
                              `}>
                                {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(slot.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(slot.lastUpdated).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditSlot(slot)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteSlot(slot.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                                {slot.status !== 'available' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleChangeStatus(slot.id, 'available')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                {slot.status !== 'maintenance' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleChangeStatus(slot.id, 'maintenance')}
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Current status of the parking system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Available Slots</p>
                      <h3 className="text-3xl font-bold mt-1">{slots.filter(s => s.status === 'available').length}</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Occupied Slots</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {slots.filter(s => s.status === 'occupied' || s.status === 'reserved').length}
                      </h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <ParkingMeter className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Overdue Slots</p>
                      <h3 className="text-3xl font-bold mt-1">{slots.filter(s => s.status === 'overdue').length}</h3>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their privileges</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-100 rounded-md"></div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-50 rounded-md"></div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Penalties</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.bookings}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.penalties > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.penalties}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'bookings' && (
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>View and manage all parking bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-100 rounded-md"></div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-50 rounded-md"></div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Slot</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.slotName}</TableCell>
                          <TableCell>{booking.userName}</TableCell>
                          <TableCell>{booking.startTime}</TableCell>
                          <TableCell>{booking.endTime}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

// Mock data
const mockSlots: ParkingSlot[] = [
  { 
    id: '1', 
    name: 'Slot A1', 
    status: 'available',
    createdAt: '2023-04-15T08:00:00Z',
    lastUpdated: '2023-05-20T14:30:00Z'
  },
  { 
    id: '2', 
    name: 'Slot A2', 
    status: 'occupied',
    createdAt: '2023-04-15T08:00:00Z',
    lastUpdated: '2023-05-20T14:30:00Z'
  },
  { 
    id: '3', 
    name: 'Slot A3', 
    status: 'available',
    createdAt: '2023-04-15T08:00:00Z',
    lastUpdated: '2023-05-20T14:30:00Z'
  },
  { 
    id: '4', 
    name: 'Slot B1', 
    status: 'maintenance',
    createdAt: '2023-04-15T08:00:00Z',
    lastUpdated: '2023-05-20T14:30:00Z'
  },
  { 
    id: '5', 
    name: 'Slot B2', 
    status: 'available',
    createdAt: '2023-04-15T08:00:00Z',
    lastUpdated: '2023-05-20T14:30:00Z'
  },
  { 
    id: '6', 
    name: 'Slot B3', 
    status: 'occupied',
    createdAt: '2023-04-15T08:00:00Z',
    lastUpdated: '2023-05-20T14:30:00Z'
  },
  { 
    id: '7', 
    name: 'Slot C1', 
    status: 'available',
    createdAt: '2023-04-15T08:00:00Z',
    lastUpdated: '2023-05-20T14:30:00Z'
  },
  { 
    id: '8', 
    name: 'Slot C2', 
    status: 'overdue',
    createdAt: '2023-04-15T08:00:00Z',
    lastUpdated: '2023-05-20T14:30:00Z'
  }
];

const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    bookings: 5,
    penalties: 0
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    bookings: 12,
    penalties: 2
  },
  {
    id: 'user-3',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    bookings: 8,
    penalties: 1
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    bookings: 3,
    penalties: 0
  }
];

const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    slotId: '2',
    slotName: 'Slot A2',
    userId: 'user-1',
    userName: 'John Doe',
    startTime: '05/20/2023 09:00',
    endTime: '05/20/2023 11:00',
    status: 'active'
  },
  {
    id: 'booking-2',
    slotId: '6',
    slotName: 'Slot B3',
    userId: 'user-2',
    userName: 'Jane Smith',
    startTime: '05/20/2023 10:00',
    endTime: '05/20/2023 12:00',
    status: 'active'
  },
  {
    id: 'booking-3',
    slotId: '8',
    slotName: 'Slot C2',
    userId: 'user-2',
    userName: 'Jane Smith',
    startTime: '05/19/2023 14:00',
    endTime: '05/19/2023 16:00',
    status: 'overdue'
  },
  {
    id: 'booking-4',
    slotId: '3',
    slotName: 'Slot A3',
    userId: 'user-3',
    userName: 'Robert Johnson',
    startTime: '05/18/2023 13:00',
    endTime: '05/18/2023 15:00',
    status: 'completed'
  }
];

export default Admin;
