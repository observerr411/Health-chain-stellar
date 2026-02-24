"use client";

import React from "react";
import { X, MapPin, Star, Clock, ShieldAlert, MessageSquare, RefreshCw } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";
import { Rider, RiderPerformance } from "@/lib/types/riders";
import { StatusBadge } from "../orders/StatusBadge";

interface RiderDetailDrawerProps {
  rider: Rider | null;
  isOpen: boolean;
  onClose: () => void;
  performanceData?: RiderPerformance[];
}

// Mock performance data for when real data is missing (Requirement: Empty states)
const MOCK_PERFORMANCE: RiderPerformance[] = [
  { date: "Mon", deliveries: 12, avgTime: 22, rating: 4.8 },
  { date: "Tue", deliveries: 15, avgTime: 18, rating: 4.9 },
  { date: "Wed", deliveries: 8, avgTime: 25, rating: 4.5 },
  { date: "Thu", deliveries: 14, avgTime: 20, rating: 4.7 },
  { date: "Fri", deliveries: 19, avgTime: 15, rating: 5.0 },
];

export const RiderDetailDrawer: React.FC<RiderDetailDrawerProps> = ({
  rider,
  isOpen,
  onClose,
  performanceData = MOCK_PERFORMANCE
}) => {
  if (!rider) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 transition-opacity z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{rider.name}</h2>
            <p className="text-sm text-gray-500">{rider.phone}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-gray-500 text-xs mb-1 uppercase font-semibold">Current Status</div>
              <StatusBadge status={rider.status} size="sm" />
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-gray-500 text-xs mb-1 uppercase font-semibold">Average Rating</div>
              <div className="flex items-center gap-1 font-bold">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                {rider.avgRating}
              </div>
            </div>
          </div>

          {/* Performance Charts */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              Delivery Volume (Last 5 Days)
            </h3>
            <div className="h-48 w-full bg-white border border-gray-100 rounded-xl p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="deliveries" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <RefreshCw size={16} className="text-green-500" />
              Rating Trend
            </h3>
            <div className="h-48 w-full bg-white border border-gray-100 rounded-xl p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10b981' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Zone Assignment Control */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-bold text-gray-900 mb-2">Zone Assignment</label>
            <div className="flex gap-2">
              <select className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option>{rider.currentZone}</option>
                <option>Central Business District</option>
                <option>Mainland North</option>
                <option>Island East</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Update
              </button>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="pt-6 border-t border-gray-100">
            <div className="text-sm font-bold text-gray-900 mb-3">Administrative Actions</div>
            <div className="flex flex-col gap-2">
              <button className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <MessageSquare size={16} /> Send Message
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2 bg-red-50 border border-red-100 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100">
                <ShieldAlert size={16} /> Suspend Rider
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};