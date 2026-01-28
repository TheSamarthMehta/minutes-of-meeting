"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Search, Users as UsersIcon } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  facilities?: string;
  createdAt: string;
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/venues');
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Venues</h1>
            <p className="text-gray-400 mt-1">Manage meeting venues and locations</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-orange-500/20">
          <Plus size={18} />
          Add Venue
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search venues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Venues Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filteredVenues.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No venues found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{venue.name}</h3>
              <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <MapPin size={14} />
                {venue.location}
              </p>
              
              {venue.facilities && (
                <p className="text-xs text-gray-500 mb-3">{venue.facilities}</p>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <UsersIcon size={14} className="text-gray-400" />
                  <span className="text-sm text-white font-medium">
                    Capacity: {venue.capacity}
                  </span>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
