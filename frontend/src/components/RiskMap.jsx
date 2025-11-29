import { useEffect, useState } from 'react';
import { riskMapAPI } from '../services/api';

const RiskMap = () => {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Check if Leaflet is loaded
    if (typeof window.L === 'undefined') {
      setError('Leaflet library not loaded. Please check your internet connection.');
      setLoading(false);
      return;
    }

    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const response = await riskMapAPI.getMockData();
      console.log('Risk map data:', response.data);
      
      if (response.data && response.data.success) {
        setMapData(response.data.data);
        setError(null);
      } else {
        setError(response.data?.message || 'Failed to load map data');
      }
    } catch (err) {
      console.error('Error fetching map data:', err);
      setError(err.response?.data?.message || 'Failed to load map data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapData || !mapData.userLocation || typeof window.L === 'undefined') return;

    // Initialize map
    const mapInstance = window.L.map('risk-map').setView(
      [mapData.userLocation.lat, mapData.userLocation.lng],
      13
    );

    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstance);

    // Add user location marker
    const userIcon = window.L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: #3B82F6; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const userMarker = window.L.marker(
      [mapData.userLocation.lat, mapData.userLocation.lng],
      { icon: userIcon }
    ).addTo(mapInstance);

    userMarker.bindPopup(`
      <div style="font-family: Arial, sans-serif;">
        <strong>আপনার অবস্থান</strong><br/>
        ${mapData.userLocation.name}
      </div>
    `);

    // Add neighbor farm markers
    const newMarkers = [];
    mapData.neighborFarms.forEach((farm) => {
      const color = 
        farm.riskLevel === 'low' ? '#10B981' :
        farm.riskLevel === 'medium' ? '#F59E0B' : '#EF4444';

      const farmIcon = window.L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = window.L.marker([farm.lat, farm.lng], { icon: farmIcon }).addTo(mapInstance);

      const riskText = 
        farm.riskLevel === 'low' ? 'কম ঝুঁকি' :
        farm.riskLevel === 'medium' ? 'মাঝারি ঝুঁকি' : 'উচ্চ ঝুঁকি';

      marker.bindPopup(`
        <div style="font-family: Arial, sans-serif;">
          <strong>প্রতিবেশী খামার</strong><br/>
          <span style="color: ${color}; font-weight: bold;">${riskText}</span><br/>
          <small>দূরত্ব: ${farm.distance}</small>
        </div>
      `);

      newMarkers.push(marker);
    });

    setMap(mapInstance);
    setMarkers(newMarkers);

    // Cleanup
    return () => {
      mapInstance.remove();
    };
  }, [mapData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">মানচিত্র লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchMapData}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-green-600 text-white">
        <h2 className="text-xl font-bold">স্থানীয় ঝুঁকি মানচিত্র</h2>
        <p className="text-sm mt-1">আপনার এলাকার খামারগুলির ঝুঁকি স্তর</p>
      </div>
      
      <div className="p-4">
        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
            <span>কম ঝুঁকি</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
            <span>মাঝারি ঝুঁকি</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
            <span>উচ্চ ঝুঁকি</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow"></div>
            <span>আপনার অবস্থান</span>
          </div>
        </div>
        
        <div id="risk-map" className="h-96 rounded-lg border border-gray-200"></div>
      </div>
    </div>
  );
};

export default RiskMap;
