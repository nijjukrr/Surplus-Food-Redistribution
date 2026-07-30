/**
 * Shared Driver Roster Management with localStorage persistence
 */

export const getStoredDrivers = () => {
  try {
    const saved = localStorage.getItem('foodbridge_registered_drivers');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  // Pre-populated default registered drivers roster
  const defaultRoster = [
    { id: 'drv-1', name: 'Alex Rivera', phone: '+91 98765 43210', dob: '1998-05-14', bike: 'KA-01-EA-1234', aadhar: '1234-5678-9012' },
    { id: 'drv-2', name: 'Rohan Sharma', phone: '+91 91234 56789', dob: '1995-11-20', bike: 'KA-02-MB-5678', aadhar: '9876-5432-1098' },
    { id: 'drv-3', name: 'Vikram Singh', phone: '+91 99887 76655', dob: '1996-03-18', bike: 'KA-05-AB-9988', aadhar: '4567-8901-2345' }
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
    aadhar: driverData.aadhar_number || driverData.aadhar || '1234-5678-9012'
  };

  const updated = [newDriver, ...existing];
  localStorage.setItem('foodbridge_registered_drivers', JSON.stringify(updated));
  return newDriver;
};
