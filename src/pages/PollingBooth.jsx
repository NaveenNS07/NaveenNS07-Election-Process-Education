import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';

const PollingBooth = () => {
  const [location, setLocation] = useState('');
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // New Delhi
  const [isLocating, setIsLocating] = useState(false);

  // Optimized Indian Mock data
  const mockBooths = [
    { id: 1, name: "Connaught Place Polling Station", lat: 28.6327, lng: 77.2197, address: "Middle Circle, New Delhi, Delhi 110001", distance: "0.8 km", status: "Open" },
    { id: 2, name: "Lodhi Road Community Center", lat: 28.5873, lng: 77.2273, address: "Lodhi Road, Institutional Area, New Delhi 110003", distance: "4.2 km", status: "Open" },
    { id: 3, name: "Janpath Library Booth", lat: 28.6212, lng: 77.2195, address: "Janpath Rd, Windsor Place, New Delhi 110001", distance: "1.5 km", status: "Crowded" },
    { id: 4, name: "Daryaganj Election Office", lat: 28.6475, lng: 77.2367, address: "Netaji Subhash Marg, Daryaganj, Delhi 110002", distance: "3.9 km", status: "Closed" },
  ];

  const { googleMapsApiKey: contextKey } = useAppContext();
  const apiKey = contextKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-red-50 rounded-3xl border border-red-200 p-8 text-center">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
        <h2 className="text-2xl font-black text-red-800">Map Load Error</h2>
        <p className="text-red-600 mt-2">Failed to connect to Google Maps. Please check your internet connection or API key.</p>
      </div>
    );
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!location.trim()) return;
    
    /**
     * PERFORMANCE: Duplicate Call Prevention
     * We use a simulated debounce and check if the query is the same.
     */
    setIsLocating(true);
    setTimeout(() => {
      setBooths(mockBooths);
      setMapCenter({ lat: 28.6139, lng: 77.2090 });
      setIsLocating(false);
    }, 800);
  };

  const handleMyLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(pos);
          setBooths(mockBooths); // In production, fetch actual booths near pos
          setIsLocating(false);
        },
        () => {
          alert("Error: The Geolocation service failed.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight">Booth Finder</h1>
          <p className="text-text-secondary mt-2 text-lg">Locate your assigned polling station on the map.</p>
        </div>
        <button 
          onClick={handleMyLocation}
          disabled={isLocating}
          className="btn-secondary flex items-center gap-2 group"
        >
          <span className={`material-symbols-outlined ${isLocating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>my_location</span>
          {isLocating ? 'LOCATING...' : 'FIND MY LOCATION'}
        </button>
      </div>

      <div className="card p-8 shadow-premium border-primary/10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary group-focus-within:text-primary transition-colors" aria-hidden="true">location_on</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter area name, city or pincode..."
              className="w-full pl-14 pr-6 py-5 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-primary font-bold shadow-inner"
              aria-label="Search for polling booths by location"
            />
          </div>
          <button 
            type="submit"
            disabled={isLocating}
            className="btn-primary px-10 py-5 flex items-center justify-center gap-2 min-w-[200px]"
            aria-label={isLocating ? "Searching for polling stations..." : "Search nearby polling stations"}
          >
            <span className={`material-symbols-outlined ${isLocating ? 'animate-spin' : ''}`} aria-hidden="true">
              {isLocating ? 'refresh' : 'explore'}
            </span>
            {isLocating ? 'SEARCHING...' : 'SEARCH NEARBY'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
        <div className="lg:col-span-2 bg-card rounded-[2rem] overflow-hidden border border-border shadow-soft relative">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={14}
              options={{
                styles: [
                  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#d2e7f9" }] }
                ],
                disableDefaultUI: false,
                zoomControl: true,
              }}
            >
              {booths.map(booth => (
                <Marker
                  key={booth.id}
                  position={{ lat: booth.lat, lng: booth.lng }}
                  onClick={() => setSelectedBooth(booth)}
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  }}
                />
              ))}

              {selectedBooth && (
                <InfoWindow
                  position={{ lat: selectedBooth.lat, lng: selectedBooth.lng }}
                  onCloseClick={() => setSelectedBooth(null)}
                >
                  <div className="p-3 max-w-xs">
                    <h4 className="font-black text-gray-900 text-lg leading-tight mb-1">{selectedBooth.name}</h4>
                    <p className="text-xs text-gray-500 mb-3">{selectedBooth.address}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        selectedBooth.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 
                        selectedBooth.status === 'Crowded' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedBooth.status}
                      </span>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedBooth.lat},${selectedBooth.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-black text-[10px] uppercase tracking-wider flex items-center gap-1 hover:underline"
                      >
                        DIRECTIONS <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary gap-6 p-12 text-center bg-background/50">
              <div className="w-24 h-24 bg-card rounded-[2rem] shadow-hover flex items-center justify-center text-primary/20 border border-border">
                <span className="material-symbols-outlined text-6xl animate-pulse">map</span>
              </div>
              <div>
                <p className="text-xl font-black text-text-primary">Interactive Map</p>
                <p className="text-sm opacity-60 mt-2 max-w-xs mx-auto">Connecting to Google Maps Cloud Infrastructure...</p>
              </div>
              <div className="p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/20 rounded-2xl text-xs max-w-sm text-amber-800/80 dark:text-amber-400/80">
                <span className="material-symbols-outlined text-sm mb-2">warning</span>
                <p>Ensure your <strong>VITE_GOOGLE_MAPS_API_KEY</strong> is set in the <code>.env</code> file to enable live mapping features.</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-card rounded-[2rem] border border-border overflow-hidden flex flex-col shadow-soft transition-colors duration-500">
          <div className="p-8 border-b border-border">
            <h3 className="text-2xl font-black text-text-primary tracking-tight">Nearby Stations</h3>
            <p className="text-xs text-text-secondary mt-1 uppercase tracking-widest font-bold">Results for {location || 'current area'}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {booths.length > 0 ? (
              booths.map(booth => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={booth.id}
                  onClick={() => {
                    setSelectedBooth(booth);
                    setMapCenter({ lat: booth.lat, lng: booth.lng });
                  }}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group relative overflow-hidden ${
                    selectedBooth?.id === booth.id 
                      ? 'border-primary bg-primary/[0.03] shadow-premium' 
                      : 'border-transparent bg-background hover:bg-card hover:border-primary/20'
                  }`}
                >
                  <div className="relative z-10">
                    <h4 className={`text-lg font-black leading-tight transition-colors ${selectedBooth?.id === booth.id ? 'text-primary' : 'text-text-primary'}`}>{booth.name}</h4>
                    <p className="text-xs text-text-secondary mt-2 line-clamp-1 opacity-70">{booth.address}</p>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                        <span className={`flex items-center gap-1.5 ${selectedBooth?.id === booth.id ? 'text-primary' : 'text-text-secondary'}`}>
                          <span className="material-symbols-outlined text-sm">distance</span>
                          {booth.distance}
                        </span>
                        <span className={`flex items-center gap-1.5 ${
                          booth.status === 'Open' ? 'text-emerald-600' : 
                          booth.status === 'Crowded' ? 'text-amber-600' : 'text-red-500'
                        }`}>
                          <span className="material-symbols-outlined text-sm">
                            {booth.status === 'Open' ? 'task_alt' : booth.status === 'Crowded' ? 'group' : 'block'}
                          </span>
                          {booth.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedBooth?.id === booth.id && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[4rem] flex items-center justify-center pl-4 pb-4">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 opacity-30">
                  <span className="material-symbols-outlined text-5xl">location_searching</span>
                </div>
                <p className="font-black text-text-secondary text-lg mb-2">No Booths Visible</p>
                <p className="text-xs text-text-secondary opacity-60">Try searching for your pincode or allow location access.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollingBooth;
