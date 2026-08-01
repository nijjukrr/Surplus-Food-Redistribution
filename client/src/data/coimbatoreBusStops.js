/**
 * Major Coimbatore Bus Stops & Landmarks Directory
 * Maps donor addresses and localities across Coimbatore to nearest bus stop pickup points.
 */

export const COIMBATORE_BUS_STOPS = [
  {
    id: 'bs-gandhipuram-1',
    name: 'Gandhipuram Central Bus Stand',
    locality: 'Gandhipuram / Cross Cut Road / Town Hall',
    keywords: ['gandhipuram', 'cross cut', '100 feet road', 'town hall', 'sathyamangalam road'],
    lat: 11.0183,
    lng: 76.9654,
    landmark: 'Opposite Central Bus Stand Entrance, Gandhipuram'
  },
  {
    id: 'bs-rspuram-2',
    name: 'RS Puram Head Post Office Bus Stop',
    locality: 'RS Puram / DB Road / TV Swamy Road',
    keywords: ['rs puram', 'r.s. puram', 'db road', 'tv swamy', 'cowley brown'],
    lat: 11.0090,
    lng: 76.9530,
    landmark: 'Near RS Puram Head Post Office & Annapoorna Junction'
  },
  {
    id: 'bs-singanallur-3',
    name: 'Singanallur Bus Stand',
    locality: 'Singanallur / Trichy Road / Ramanathapuram',
    keywords: ['singanallur', 'trichy road', 'ramanathapuram', 'ondipudur', 'siha'],
    lat: 10.9995,
    lng: 77.0125,
    landmark: 'Singanallur Bus Depot Main Gate, Trichy Road'
  },
  {
    id: 'bs-ukkadam-4',
    name: 'Ukkadam Bus Stand',
    locality: 'Ukkadam / Palakkad Road / Town Hall / Valankulam',
    keywords: ['ukkadam', 'palakkad road', 'sungam', 'valankulam', 'selvapuram'],
    lat: 10.9920,
    lng: 76.9610,
    landmark: 'Ukkadam Main Bus Terminal, Palakkad Road'
  },
  {
    id: 'bs-peelamedu-5',
    name: 'Peelamedu / PSG Tech Bus Stop',
    locality: 'Peelamedu / Avinashi Road / PSG / Tidel Park',
    keywords: ['peelamedu', 'psg', 'tidel', 'hope college', 'hopes', 'fun mall'],
    lat: 11.0284,
    lng: 76.9515,
    landmark: 'PSG College of Technology Main Gate, Avinashi Road'
  },
  {
    id: 'bs-saravanampatti-6',
    name: 'Saravanampatti Junction Bus Stop',
    locality: 'Saravanampatti / Sathy Road / CHIL SEZ IT Park',
    keywords: ['saravanampatti', 'saravanampati', 'sathy road', 'kgeisl', 'chil sez', 'viswasapuram'],
    lat: 11.0797,
    lng: 76.9902,
    landmark: 'Saravanampatti Four Roads Signal, Sathy Main Road'
  },
  {
    id: 'bs-saibaba-7',
    name: 'Saibaba Colony Bus Stop',
    locality: 'Saibaba Colony / Mettupalayam Road / NSR Road',
    keywords: ['saibaba colony', 'nsr road', 'mettupalayam road', 'kavundampalayam'],
    lat: 11.0315,
    lng: 76.9422,
    landmark: 'Saibaba Kovil Bus Stop, NSR Road Corner'
  },
  {
    id: 'bs-kovaipudur-8',
    name: 'Kovaipudur Main Bus Stop',
    locality: 'Kovaipudur / Kuniamuthur / VLB',
    keywords: ['kovaipudur', 'kuniamuthur', 'vlb', 'bk pudur'],
    lat: 10.9412,
    lng: 76.9405,
    landmark: 'Kovaipudur Central Bus Terminus'
  },
  {
    id: 'bs-podanur-9',
    name: 'Podanur Junction Bus Stop',
    locality: 'Podanur / Nanjundapuram / Chettipalayam Road',
    keywords: ['podanur', 'nanjundapuram', 'chettipalayam'],
    lat: 10.9630,
    lng: 76.9720,
    landmark: 'Podanur Railway Station Signal Bus Stop'
  },
  {
    id: 'bs-thudiyalur-10',
    name: 'Thudiyalur Bus Stand',
    locality: 'Thudiyalur / Mettupalayam Road / Perianaickenpalayam',
    keywords: ['thudiyalur', 'perianaickenpalayam', 'nggo colony', 'koundampalayam'],
    lat: 11.0820,
    lng: 76.9410,
    landmark: 'Thudiyalur Junction Bus Shelter, Mettupalayam Road'
  },
  {
    id: 'bs-sulur-11',
    name: 'Sulur Bus Stand',
    locality: 'Sulur / Air Force Station / Trichy Highway',
    keywords: ['sulur', 'air force', 'ravathur'],
    lat: 11.0250,
    lng: 77.1260,
    landmark: 'Sulur Main Bus Stand Depot'
  },
  {
    id: 'bs-vadavalli-12',
    name: 'Vadavalli Bus Stand',
    locality: 'Vadavalli / Marudhamalai Road / Lawley Road',
    keywords: ['vadavalli', 'marudhamalai', 'lawley road', 'agri university', 'tnau'],
    lat: 11.0150,
    lng: 76.9030,
    landmark: 'Vadavalli Bus Terminus, Marudhamalai Road'
  }
];

/**
 * Utility to find the nearest Coimbatore Bus Stop given an address or locality string
 */
export const findNearestBusStop = (addressOrArea = '') => {
  const text = (addressOrArea || '').toLowerCase();

  // Try keyword matching
  for (const bs of COIMBATORE_BUS_STOPS) {
    if (bs.keywords.some(kw => text.includes(kw))) {
      return bs;
    }
  }

  // Fallback to Gandhipuram Central Bus Stand as default central Coimbatore hub
  return COIMBATORE_BUS_STOPS[0];
};
