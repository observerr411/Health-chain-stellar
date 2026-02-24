// StatusBadge - Displays order/rider status with color coding and icons
import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  UserX, 
  Moon, 
  AlertTriangle 
} from 'lucide-react';

// Unified types for both Orders and Riders
type AllStatuses = 
  | 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' // Orders
  | 'available' | 'on_delivery' | 'offline' | 'suspended';           // Riders

interface StatusBadgeProps {
  status: AllStatuses;
  size?: 'sm' | 'md' | 'lg';
  isStale?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  isStale = false 
}) => {
  
  // 1. Color Mapping
  const colorClasses: Record<AllStatuses, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-300',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
    in_transit: 'bg-purple-100 text-purple-700 border-purple-300',
    delivered: 'bg-green-100 text-green-700 border-green-300',
    cancelled: 'bg-red-100 text-red-700 border-red-300',
    // Rider Specific
    available: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    on_delivery: 'bg-blue-100 text-blue-700 border-blue-300',
    offline: 'bg-gray-100 text-gray-700 border-gray-300',
    suspended: 'bg-red-100 text-red-700 border-red-300',
  };

  // 2. Icon Mapping
  const iconMap: Record<AllStatuses, React.ElementType> = {
    pending: Clock,
    confirmed: CheckCircle,
    in_transit: Truck,
    delivered: CheckCircle2,
    cancelled: XCircle,
    // Rider Specific
    available: UserCheck,
    on_delivery: Truck,
    offline: Moon,
    suspended: AlertTriangle,
  };

  const StatusIcon = iconMap[status] || AlertTriangle;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const statusText = status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-opacity ${
        colorClasses[status]
      } ${sizeClasses[size]} ${isStale ? 'opacity-50' : 'opacity-100'}`}
    >
      <StatusIcon size={iconSizes[size]} />
      <span>{statusText}</span>
    </span>
  );
};