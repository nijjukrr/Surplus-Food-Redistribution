/**
 * Shared Driver Roster Management with mandatory Driver Photo
 */

export const getStoredDrivers = () => {
  try {
    const saved = localStorage.getItem('foodbridge_registered_drivers');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure photo_url exists for all stored entries
        return parsed.map(d => ({
          ...d,
          photo_url: d.photo_url || '/driver_photo.png'
        }));
      }
    }
  } catch (e) {}

  // Pre-populated default registered drivers roster with mandatory driver photos
  const defaultRoster = [
    { 
      id: 'drv-1', 
      name: 'Alex Rivera', 
      phone: '+91 98765 43210', 
      dob: '1998-05-14', 
      bike: 'KA-01-EA-1234', 
      aadhar: '1234-5678-9012',
      photo_url: '/driver_photo.png'
    },
    { 
      id: 'drv-2', 
      name: 'Rohan Sharma', 
      phone: '+91 91234 56789', 
      dob: '1995-11-20', 
      bike: 'KA-02-MB-5678', 
      aadhar: '9876-5432-1098',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: 'drv-3', 
      name: 'Vikram Singh', 
      phone: '+91 99887 76655', 
      dob: '1996-03-18', 
      bike: 'KA-05-AB-9988', 
      aadhar: '4567-8901-2345',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    }
  ];

  localStorage.setItem('foodbridge_registered_drivers', JSON.stringify(defaultRoster));
  return defaultRoster;
};

export const registerNewDriver = (driverData) => {
  const existing = getStoredDrivers();
  const newDriver = {
    id: 'drv-' + Date.now(),
    name: driverData.name || 'Volunteer Courier',
    phone: driverData.phone || '+91 98765 43210',
    dob: driverData.dob || '1998-01-01',
    bike: driverData.vehicle_number || driverData.bike || 'KA-01-EA-1234',
    vehicle_type: driverData.vehicle_type || 'Two-Wheeler (Motorbike)',
    aadhar: driverData.aadhar_number || driverData.aadhar || '1234-5678-9012',
    photo_url: driverData.photo_url || '/driver_photo.png'
  };

  const updated = [newDriver, ...existing];
  localStorage.setItem('foodbridge_registered_drivers', JSON.stringify(updated));
  return newDriver;
};
