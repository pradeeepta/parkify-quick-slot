
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ParkingMeter, Clock, AlertTriangle } from 'lucide-react';

// Define types for parking slot
export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance' | 'overdue';

export interface ParkingSlotProps {
  id: string;
  name: string;
  status: SlotStatus;
  startTime?: string;
  endTime?: string;
  isUserSlot?: boolean;
  onBook?: (id: string) => void;
  onRelease?: (id: string) => void;
}

const statusConfig = {
  available: {
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Available'
  },
  occupied: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'Occupied'
  },
  reserved: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    label: 'Reserved'
  },
  maintenance: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'Maintenance'
  },
  overdue: {
    color: 'bg-red-100 text-red-800 border-red-200',
    label: 'Overdue'
  }
};

const ParkingSlot: React.FC<ParkingSlotProps> = ({
  id,
  name,
  status,
  startTime,
  endTime,
  isUserSlot = false,
  onBook,
  onRelease
}) => {
  const statusInfo = statusConfig[status];
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-scale-in">
      <div className="relative">
        {status === 'overdue' && (
          <div className="absolute -right-3 -top-3 w-24 h-24 rotate-45">
            <div className="absolute inset-0 bg-red-500 flex items-end justify-center pb-1">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ParkingMeter className={`w-5 h-5 ${status === 'available' ? 'text-green-500' : 'text-blue-500'}`} />
              <h3 className="font-medium text-lg">{name}</h3>
            </div>
            <Badge className={`${statusInfo.color} px-2 py-0.5 text-xs font-medium`}>
              {statusInfo.label}
            </Badge>
          </div>
          
          {(status === 'occupied' || status === 'reserved' || status === 'overdue') && (
            <div className="mb-4 space-y-2">
              {startTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Start: {startTime}</span>
                </div>
              )}
              {endTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>End: {endTime}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4">
            {status === 'available' && onBook && (
              <Button 
                onClick={() => onBook(id)} 
                variant="default" 
                className="w-full"
              >
                Book Slot
              </Button>
            )}
            
            {isUserSlot && (status === 'occupied' || status === 'overdue') && onRelease && (
              <Button 
                onClick={() => onRelease(id)} 
                variant={status === 'overdue' ? "destructive" : "outline"}
                className="w-full"
              >
                Release Slot
              </Button>
            )}
            
            {status === 'maintenance' && (
              <div className="text-sm text-center text-muted-foreground">
                This slot is under maintenance
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ParkingSlot;
