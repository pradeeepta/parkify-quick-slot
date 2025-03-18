
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ParkingSlot, { SlotStatus } from '@/components/ParkingSlot';
import BookingForm, { BookingData } from '@/components/BookingForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Car, Clock, X, CheckCircle } from 'lucide-react';

// Mock data types
interface ParkingSlotData {
  id: string;
  name: string;
  status: SlotStatus;
  startTime?: string;
  endTime?: string;
  bookedBy?: string;
}

interface UserBooking {
  id: string;
  slotId: string;
  slotName: string;
  status: SlotStatus;
  startTime: string;
  endTime: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [slots, setSlots] = useState<ParkingSlotData[]>([]);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlotData | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSlots(mockSlots);
      setUserBookings(mockUserBookings);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Filter slots based on search and status
  const filteredSlots = slots.filter(slot => {
    const matchesSearch = slot.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || slot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Handle booking
  const handleBookSlot = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot) {
      setSelectedSlot(slot);
      setIsBooking(true);
    }
  };
  
  // Complete booking
  const handleCompleteBooking = (data: BookingData) => {
    // In a real app, this would be an API call
    if (!selectedSlot) return;
    
    // Format the time strings
    const formattedStartTime = `${data.startDate.toLocaleDateString()} ${data.startTime}`;
    const formattedEndTime = `${data.endDate.toLocaleDateString()} ${data.endTime}`;
    
    // Update slots
    setSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === data.slotId ? 
        {
          ...slot,
          status: 'occupied',
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          bookedBy: 'currentUser' // In a real app, this would be the actual user ID
        } : slot
      )
    );
    
    // Add to user bookings
    const newBooking: UserBooking = {
      id: `booking-${Date.now()}`,
      slotId: data.slotId,
      slotName: selectedSlot.name,
      status: 'occupied',
      startTime: formattedStartTime,
      endTime: formattedEndTime
    };
    
    setUserBookings(prev => [...prev, newBooking]);
    
    // Reset booking state
    setIsBooking(false);
    setSelectedSlot(null);
    
    // Show success toast
    toast({
      title: "Booking Successful",
      description: `You've booked ${selectedSlot.name} from ${formattedStartTime} to ${formattedEndTime}`,
    });
  };
  
  // Release slot
  const handleReleaseSlot = (slotId: string) => {
    // Update slots
    setSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === slotId ? 
        {
          ...slot,
          status: 'available',
          startTime: undefined,
          endTime: undefined,
          bookedBy: undefined
        } : slot
      )
    );
    
    // Update user bookings
    setUserBookings(prev => prev.filter(booking => booking.slotId !== slotId));
    
    // Show success toast
    toast({
      title: "Slot Released",
      description: "You've successfully released the parking slot.",
    });
  };
  
  const cancelBooking = () => {
    setIsBooking(false);
    setSelectedSlot(null);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-4 md:px-6 pt-28 pb-16 page-animation">
        <h1 className="text-3xl font-bold mb-8">Parking Dashboard</h1>
        
        <Tabs defaultValue="available" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="available">Available Slots</TabsTrigger>
            <TabsTrigger value="mybookings">My Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search slots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <Filter className="text-muted-foreground h-4 w-4" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 animate-pulse h-48 rounded-lg"></div>
                ))}
              </div>
            ) : isBooking ? (
              <BookingForm 
                slotId={selectedSlot?.id || ''} 
                slotName={selectedSlot?.name || ''} 
                onSubmit={handleCompleteBooking} 
                onCancel={cancelBooking}
              />
            ) : (
              <>
                {filteredSlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSlots.map(slot => (
                      <ParkingSlot
                        key={slot.id}
                        id={slot.id}
                        name={slot.name}
                        status={slot.status}
                        startTime={slot.startTime}
                        endTime={slot.endTime}
                        onBook={slot.status === 'available' ? handleBookSlot : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Car className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No slots found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="mybookings">
            {userBookings.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Your Active Bookings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userBookings.map(booking => {
                    const slot = slots.find(s => s.id === booking.slotId);
                    return slot ? (
                      <ParkingSlot
                        key={booking.id}
                        id={slot.id}
                        name={slot.name}
                        status={slot.status}
                        startTime={booking.startTime}
                        endTime={booking.endTime}
                        isUserSlot={true}
                        onRelease={handleReleaseSlot}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No active bookings</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any active parking slot bookings
                </p>
                <Button variant="outline" onClick={() => document.querySelector('button[value="available"]')?.click()}>
                  Find Available Slots
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Mock data
const mockSlots: ParkingSlotData[] = [
  { id: '1', name: 'Slot A1', status: 'available' },
  { id: '2', name: 'Slot A2', status: 'occupied', startTime: '05/20/2023 09:00', endTime: '05/20/2023 11:00' },
  { id: '3', name: 'Slot A3', status: 'available' },
  { id: '4', name: 'Slot B1', status: 'maintenance' },
  { id: '5', name: 'Slot B2', status: 'available' },
  { id: '6', name: 'Slot B3', status: 'occupied', startTime: '05/20/2023 10:00', endTime: '05/20/2023 12:00' },
  { id: '7', name: 'Slot C1', status: 'available' },
  { id: '8', name: 'Slot C2', status: 'overdue', startTime: '05/19/2023 14:00', endTime: '05/19/2023 16:00' },
  { id: '9', name: 'Slot C3', status: 'available' }
];

const mockUserBookings: UserBooking[] = [
  { 
    id: 'booking-1', 
    slotId: '2', 
    slotName: 'Slot A2', 
    status: 'occupied',
    startTime: '05/20/2023 09:00', 
    endTime: '05/20/2023 11:00'
  },
  { 
    id: 'booking-2', 
    slotId: '8', 
    slotName: 'Slot C2', 
    status: 'overdue',
    startTime: '05/19/2023 14:00', 
    endTime: '05/19/2023 16:00'
  }
];

export default Dashboard;
