"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useRiders } from "@/lib/hooks/useRiders";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Search, MapPin, Star, MoreHorizontal } from "lucide-react";
import { RiderDetailDrawer } from "@/components/riders/RiderDetailDrawer";
import { Rider } from "@/lib/types/riders";

const MOCK_RIDERS: Rider[] = [
  { id: "RID-001", name: "John Doe", phone: "+234 801 234 5678", status: "available", currentZone: "Lagos Island", todayDeliveries: 8, avgRating: 4.8, lastActive: new Date() },
  { id: "RID-002", name: "Sarah Smith", phone: "+234 802 987 6543", status: "on_delivery", currentZone: "Ikeja", todayDeliveries: 5, avgRating: 4.9, lastActive: new Date() },
  { id: "RID-003", name: "Mike Johnson", phone: "+234 803 111 2222", status: "offline", currentZone: "Lekki", todayDeliveries: 0, avgRating: 4.5, lastActive: new Date() }
];

export default function RiderManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: apiRiders, isLoading } = useRiders();
  
  // Initial search from URL - only runs once
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Prevents infinite loops by tracking if the change is internal
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      // Use window.history to prevent Next.js from re-triggering a full page render
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [searchTerm, pathname]);

  const riders = apiRiders || MOCK_RIDERS;
  const filteredRiders = riders.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.phone.includes(searchTerm)
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">Rider Management</h1>
          <p className="text-gray-500">Monitor performance and manage logistics zones</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search riders..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading && !apiRiders ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rider Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Today</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredRiders.map(rider => (
                <tr 
                  key={rider.id} 
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  onClick={() => { setSelectedRider(rider); setIsDrawerOpen(true); }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{rider.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{rider.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={rider.status as any} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      {rider.currentZone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-center font-medium">
                    {rider.todayDeliveries}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      {rider.avgRating}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 group-hover:text-blue-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RiderDetailDrawer 
        rider={selectedRider}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}