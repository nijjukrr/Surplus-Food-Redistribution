/**
 * Shared Driver Roster Management utilizing drivers directory photos
 */

export const getStoredDrivers = () => {
  const defaultRoster = [
    { 
      id: 'drv-1', 
      name: 'VIJAY', 
      phone: '+91 98765 43210', 
      dob: '1998-05-14', 
      bike: 'TN-37-VJ-1234', 
      aadhar: '1234-5678-9012',
      photo_url: '/drivers/driver1.png'
    },
    { 
      id: 'drv-2', 
      name: 'AJITH', 
      phone: '+91 91234 56789', 
      dob: '1995-11-20', 
      bike: 'TN-38-AJ-5678', 
      aadhar: '9876-5432-1098',
      photo_url: '/drivers/driver2.png'
    },
    { 
      id: 'drv-3', 
      name: 'KUMAR', 
      phone: '+91 99887 76655', 
      dob: '1996-03-18', 
      bike: 'TN-66-KM-9988', 
      aadhar: '4567-8901-2345',
      photo_url: '/drivers/driver3.png'
    }
  ];

  try {
    const saved = localStorage.getItem('foodbridge_registered_drivers');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If old saved data has "Alex Rivera", migrate to default VIJAY, AJITH, KUMAR
        if (parsed.some(d => d.name === 'Alex Rivera' || d.name === 'Rohan Sharma')) {
          localStorage.setItem('foodbridge_registered_drivers', JSON.stringify(defaultRoster));
          return defaultRoster;
        }
        return parsed;
      }
    }
  } catch (e) {}

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
    bike: driverData.vehicle_number || driverData.bike || 'TN-37-EA-1234',
    vehicle_type: driverData.vehicle_type || 'Two-Wheeler (Motorbike)',
    aadhar: driverData.aadhar_number || driverData.aadhar || '1234-5678-9012',
    photo_url: driverData.photo_url || null
  };

  const updated = [newDriver, ...existing];
  localStorage.setItem('foodbridge_registered_drivers', JSON.stringify(updated));
  return newDriver;
};
