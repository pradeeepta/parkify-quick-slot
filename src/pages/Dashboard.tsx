
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Car, 
  Package, 
  ParkingMeter, 
  AlertTriangle, 
  X 
} from 'lucide-react';
import ParkingSlot, { SlotStatus } from '@/components/ParkingSlot';
import BookingForm from '@/components/BookingForm';

// Types
interface Booking {
  id: string;
  slotId: string;
  slotName: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'overdue';
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'slots' | 'bookings'>('slots');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Mock data
  const [parkingSlots, setParkingSlots] = useState<Array<{
    id: string;
    name: string;
    status: SlotStatus;
  }>>([]);
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Simulated auth check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);
  
  // Load mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setParkingSlots([
        { id: '1', name: 'A1', status: 'available' },
        { id: '2', name: 'A2', status: 'occupied' },
        { id: '3', name: 'A3', status: 'available' },
        { id: '4', name: 'B1', status: 'maintenance' },
        { id: '5', name: 'B2', status: 'available' },
        { id: '6', name: 'B3', status: 'occupied' },
        { id: '7', name: 'C1', status: 'available' },
        { id: '8', name: 'C2', status: 'reserved' },
        { id: '9', name: 'C3', status: 'available' },
        { id: '10', name: 'D1', status: 'overdue' },
        { id: '11', name: 'D2', status: 'available' },
        { id: '12', name: 'D3', status: 'occupied' },
      ]);
      
      setBookings([
        {
          id: 'booking-1',
          slotId: '2',
          slotName: 'A2',
          startTime: '09:00 AM',
          endTime: '11:00 AM',
          status: 'active'
        },
        {
          id: 'booking-2',
          slotId: '10',
          slotName: 'D1',
          startTime: '02:00 PM',
          endTime: '04:00 PM',
          status: 'overdue'
        }
      ]);
      
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Handle slot click
  const handleSlotClick = (slotId: string) => {
    // Find the clicked slot
    const slot = parkingSlots.find(slot => slot.id === slotId);
    
    if (slot?.status === 'available') {
      setSelectedSlot(slotId);
      setIsBookingModalOpen(true);
    } else if (slot?.status === 'occupied' || slot?.status === 'overdue') {
      // Check if the current user has booked this slot
      const booking = bookings.find(b => b.slotId === slotId);
      if (booking) {
        handleReleaseSlot(slotId, booking.id);
      } else {
        toast({
          title: "Slot Occupied",
          description: "This slot is currently occupied by another user.",
        });
      }
    } else if (slot?.status === 'maintenance') {
      toast({
        title: "Slot in Maintenance",
        description: "This slot is currently under maintenance.",
        variant: "destructive",
      });
    }
  };
  
  // Handle booking
  const handleBookSlot = (slotId: string, startTime: string, endTime: string) => {
    // Find the slot
    const slot = parkingSlots.find(slot => slot.id === slotId);
    
    if (slot) {
      // Update slot status
      setParkingSlots(prevSlots => 
        prevSlots.map(s => 
          s.id === slotId ? { ...s, status: 'occupied' as SlotStatus } : s
        )
      );
      
      // Create a new booking
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        slotId,
        slotName: slot.name,
        startTime,
        endTime,
        status: 'active'
      };
      
      setBookings(prevBookings => [...prevBookings, newBooking]);
      
      toast({
        title: "Booking Successful",
        description: `You have booked slot ${slot.name} from ${startTime} to ${endTime}.`,
      });
      
      setIsBookingModalOpen(false);
    }
  };
  
  // Handle releasing a slot
  const handleReleaseSlot = (slotId: string, bookingId: string) => {
    // Update slot status
    setParkingSlots(prevSlots => 
      prevSlots.map(s => 
        s.id === slotId ? { ...s, status: 'available' as SlotStatus } : s
      )
    );
    
    // Update booking status
    setBookings(prevBookings => 
      prevBookings.map(b => 
        b.id === bookingId ? { ...b, status: 'completed' as const } : b
      )
    );
    
    toast({
      title: "Slot Released",
      description: "You have successfully released the parking slot.",
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-4 pt-28 pb-16 page-animation">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Book and manage your parking slots
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'slots' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('slots')}
                className="flex items-center gap-2"
              >
                <ParkingMeter className="h-4 w-4" />
                Parking Slots
              </Button>
              <Button 
                variant={activeTab === 'bookings' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('bookings')}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                My Bookings
              </Button>
            </div>
          </div>
          
          {/* Parking Slots Tab */}
          {activeTab === 'slots' && (
            <Card>
              <CardHeader>
                <CardTitle>Available Parking Slots</CardTitle>
                <CardDescription>Select an available slot to book</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  // Loading Skeleton
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {parkingSlots.map((slot) => (
                      <ParkingSlot
                        key={slot.id}
                        name={slot.name}
                        status={slot.status}
                        onClick={() => handleSlotClick(slot.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
                <p className="flex items-center gap-2 mb-2">
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                  Available: {parkingSlots.filter(s => s.status === 'available').length}
                </p>
                <p className="flex items-center gap-2 mb-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                  Occupied: {parkingSlots.filter(s => s.status === 'occupied').length}
                </p>
                <p className="flex items-center gap-2 mb-2">
                  <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                  Maintenance: {parkingSlots.filter(s => s.status === 'maintenance').length}
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  Overdue: {parkingSlots.filter(s => s.status === 'overdue').length}
                </p>
              </CardFooter>
            </Card>
          )}
          
          {/* My Bookings Tab */}
          {activeTab === 'bookings' && (
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>Manage your active and past bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  // Loading Skeleton
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          booking.status === 'overdue' ? 'border-red-300 bg-red-50' : 
                          booking.status === 'active' ? 'border-blue-300 bg-blue-50' : 
                          'border-green-300 bg-green-50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="font-medium">
                            Slot {booking.slotName}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {booking.startTime} - {booking.endTime}
                          </div>
                          <div className="text-xs">
                            <span className={`px-2 py-0.5 rounded-full font-medium ${
                              booking.status === 'overdue' ? 'bg-red-200 text-red-800' : 
                              booking.status === 'active' ? 'bg-blue-200 text-blue-800' : 
                              'bg-green-200 text-green-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        {(booking.status === 'active' || booking.status === 'overdue') && (
                          <Button 
                            onClick={() => handleReleaseSlot(booking.slotId, booking.id)}
                            variant={booking.status === 'overdue' ? 'destructive' : 'outline'}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Release Slot
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium">No bookings yet</h3>
                    <p className="max-w-sm mx-auto mt-1">
                      You haven't made any bookings. Go to the Parking Slots tab to book a slot.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      {/* Booking Form Modal */}
      <BookingForm 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={(startTime, endTime) => {
          if (selectedSlot) {
            handleBookSlot(selectedSlot, startTime, endTime);
          }
        }}
      />
    </div>
  );
};

export default Dashboard;
