/**
 * Centralized Presentation Mock Data for PGFinder
 * Purely for frontend display until backend APIs are integrated in future phases.
 */

export const mockLocations = [
  {
    id: 'loc-1',
    name: 'Delhi',
    state: 'Delhi NCR',
    count: '340+ PGs',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    popularAreas: ['Laxmi Nagar', 'DU North Campus', 'Karol Bagh', 'Saket']
  },
  {
    id: 'loc-2',
    name: 'Noida',
    state: 'Uttar Pradesh',
    count: '210+ PGs',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80',
    popularAreas: ['Sector 62', 'Sector 18', 'Knowledge Park', 'Sector 125']
  },
  {
    id: 'loc-3',
    name: 'Greater Noida',
    state: 'Uttar Pradesh',
    count: '180+ PGs',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    popularAreas: ['Knowledge Park I', 'Knowledge Park II', 'Pari Chowk', 'Omega 1']
  },
  {
    id: 'loc-4',
    name: 'Ghaziabad',
    state: 'Uttar Pradesh',
    count: '140+ PGs',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    popularAreas: ['Indirapuram', 'Vaishali', 'Raj Nagar', 'Crossings Republik']
  },
  {
    id: 'loc-5',
    name: 'Gurugram',
    state: 'Haryana',
    count: '290+ PGs',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    popularAreas: ['Cyber City', 'DLF Phase 3', 'Sector 44', 'Golf Course Road']
  },
  {
    id: 'loc-6',
    name: 'Bangalore',
    state: 'Karnataka',
    count: '420+ PGs',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
    popularAreas: ['Koramangala', 'HSR Layout', 'Electronic City', 'Indiranagar']
  },
  {
    id: 'loc-7',
    name: 'Pune',
    state: 'Maharashtra',
    count: '260+ PGs',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
    popularAreas: ['Viman Nagar', 'Hinjawadi', 'Kothrud', 'Baner']
  },
  {
    id: 'loc-8',
    name: 'Hyderabad',
    state: 'Telangana',
    count: '310+ PGs',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    popularAreas: ['Gachibowli', 'HITECH City', 'Madhapur', 'Kondapur']
  }
];

export const mockPGs = [
  {
    id: 'pg-001',
    name: 'Sunrise Premium Living',
    tagline: 'Luxury co-living spaces for students and professionals',
    location: 'Sector 62, Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    zipCode: '201309',
    pgType: 'Co-living', // Boys / Girls / Co-living
    rent: 8500,
    deposit: 8500,
    roomType: 'Double Sharing',
    availableRooms: 4,
    rating: 4.8,
    reviewsCount: 34,
    isVerified: true,
    isAvailable: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
    ],
    facilities: ['Wi-Fi', 'Food', 'AC', 'Power Backup', 'CCTV', 'Housekeeping', 'Laundry', 'Parking'],
    foodType: 'Veg & Non-Veg (3 meals/day)',
    rules: [
      'Notice period: 30 days',
      'Visitor allowed till 8 PM',
      'No smoking inside rooms',
      'Quiet hours after 10 PM'
    ],
    description: 'Sunrise Premium Living offers fully furnished modern AC rooms with high-speed Wi-Fi, daily housekeeping, 3-time hygienic meals, and 24/7 security near major IT parks and colleges.',
    roomOptions: [
      { type: 'Single Room', rent: 14000, deposit: 14000, available: 1 },
      { type: 'Double Sharing', rent: 8500, deposit: 8500, available: 3 },
      { type: 'Triple Sharing', rent: 6500, deposit: 6500, available: 2 }
    ],
    owner: {
      name: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      email: 'rajesh.sharma@example.com',
      joinedDate: 'Jan 2024',
      responseTime: 'Within 1 hour'
    }
  },
  {
    id: 'pg-002',
    name: 'Starlight Girls Executive PG',
    tagline: 'Safe, hygienic and peaceful PG for women',
    location: 'Koramangala 5th Block, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560095',
    pgType: 'Girls',
    rent: 11000,
    deposit: 11000,
    roomType: 'Single',
    availableRooms: 2,
    rating: 4.9,
    reviewsCount: 52,
    isVerified: true,
    isAvailable: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    ],
    facilities: ['Wi-Fi', 'Food', 'AC', 'CCTV', 'Power Backup', 'Laundry', 'Geyser', 'Security Guard'],
    foodType: 'Pure Veg Meals',
    rules: [
      'Female visitors only',
      'Gate closes at 10:30 PM',
      'Biometric access required'
    ],
    description: 'Prime Koramangala location with 3-tier security, biometric entry, fresh home-style meals, study tables, attached washrooms, and high-speed fibre internet.',
    roomOptions: [
      { type: 'Single Room', rent: 11000, deposit: 11000, available: 2 },
      { type: 'Double Sharing', rent: 7500, deposit: 7500, available: 4 }
    ],
    owner: {
      name: 'Sunita Reddy',
      phone: '+91 98765 11223',
      email: 'sunita.reddy@example.com',
      joinedDate: 'Mar 2023',
      responseTime: 'Within 30 mins'
    }
  },
  {
    id: 'pg-003',
    name: 'Metro Residency Boys PG',
    tagline: 'Affordable stay near Cyber City',
    location: 'DLF Phase 3, Gurugram',
    city: 'Gurugram',
    state: 'Haryana',
    zipCode: '122002',
    pgType: 'Boys',
    rent: 7500,
    deposit: 7500,
    roomType: 'Triple Sharing',
    availableRooms: 5,
    rating: 4.6,
    reviewsCount: 19,
    isVerified: true,
    isAvailable: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
    ],
    facilities: ['Wi-Fi', 'AC', 'Power Backup', 'Parking', 'CCTV', 'Housekeeping'],
    foodType: 'North Indian Food (Breakfast & Dinner)',
    rules: [
      'ID proof mandatory',
      'Rent due by 5th of every month'
    ],
    description: 'Walking distance to Phase 3 Rapid Metro. Ideal for corporate employees working in Cyber City and Udyog Vihar.',
    roomOptions: [
      { type: 'Double Sharing', rent: 9500, deposit: 9500, available: 2 },
      { type: 'Triple Sharing', rent: 7500, deposit: 7500, available: 3 }
    ],
    owner: {
      name: 'Amit Verma',
      phone: '+91 99887 76655',
      email: 'amit.verma@example.com',
      joinedDate: 'Nov 2023',
      responseTime: 'Within 2 hours'
    }
  },
  {
    id: 'pg-004',
    name: 'Greenwood Heights Co-living',
    tagline: 'Modern co-living space with gym and gaming lounge',
    location: 'Hinjawadi Phase 1, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411057',
    pgType: 'Co-living',
    rent: 9000,
    deposit: 9000,
    roomType: 'Double Sharing',
    availableRooms: 6,
    rating: 4.7,
    reviewsCount: 41,
    isVerified: true,
    isAvailable: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    ],
    facilities: ['Wi-Fi', 'Food', 'AC', 'Power Backup', 'Gym', 'Laundry', 'CCTV', 'Gaming Zone'],
    foodType: 'Buffet (3 meals + Evening Tea)',
    rules: [
      'Zero disturbance policy',
      'Curfew: None'
    ],
    description: 'Located in the heart of Hinjawadi IT Park. Premium amenities including mini gym, PS5 lounge, high speed Wi-Fi, and terrace cafeteria.',
    roomOptions: [
      { type: 'Single Room', rent: 15000, deposit: 15000, available: 2 },
      { type: 'Double Sharing', rent: 9000, deposit: 9000, available: 4 }
    ],
    owner: {
      name: 'Vikas Kulkarni',
      phone: '+91 97654 32109',
      email: 'vikas.k@example.com',
      joinedDate: 'Feb 2024',
      responseTime: 'Within 15 mins'
    }
  },
  {
    id: 'pg-005',
    name: 'DU North Campus Student Haven',
    tagline: 'Student-friendly PG with study desks & library access',
    location: 'Kamla Nagar, Delhi',
    city: 'Delhi',
    state: 'Delhi NCR',
    zipCode: '110007',
    pgType: 'Girls',
    rent: 9500,
    deposit: 9500,
    roomType: 'Double Sharing',
    availableRooms: 3,
    rating: 4.8,
    reviewsCount: 67,
    isVerified: true,
    isAvailable: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    facilities: ['Wi-Fi', 'Food', 'AC', 'Library', 'Laundry', 'CCTV', 'Power Backup'],
    foodType: 'Home-cooked Veg Meals',
    rules: [
      'Students only',
      'Parent authorization required at check-in'
    ],
    description: '5 minutes walk from Hansraj, Hindu and Ramjas colleges. Silent study room, high speed fibre, power backup, and wholesome home-cooked meals.',
    roomOptions: [
      { type: 'Single Room', rent: 13500, deposit: 13500, available: 1 },
      { type: 'Double Sharing', rent: 9500, deposit: 9500, available: 2 }
    ],
    owner: {
      name: 'Mrs. Neeta Kapoor',
      phone: '+91 98112 23344',
      email: 'neeta.kapoor@example.com',
      joinedDate: 'Aug 2022',
      responseTime: 'Within 1 hour'
    }
  },
  {
    id: 'pg-006',
    name: 'Cyber City Tech Stay',
    tagline: 'High-speed Wi-Fi & quiet work desks for developers',
    location: 'Gachibowli, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500032',
    pgType: 'Boys',
    rent: 8000,
    deposit: 8000,
    roomType: 'Triple Sharing',
    availableRooms: 8,
    rating: 4.5,
    reviewsCount: 22,
    isVerified: true,
    isAvailable: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: ['Wi-Fi', 'Food', 'AC', 'Power Backup', 'CCTV', 'Parking', 'Laundry'],
    foodType: 'South & North Indian Meals',
    rules: ['No alcohol', 'Rent on 1st of month'],
    description: 'Located right behind DLF Cyber City Gachibowli. Perfect accommodation for IT trainees and techies with 300 Mbps Wi-Fi.',
    roomOptions: [
      { type: 'Double Sharing', rent: 10000, deposit: 10000, available: 3 },
      { type: 'Triple Sharing', rent: 8000, deposit: 8000, available: 5 }
    ],
    owner: {
      name: 'Srinivas Rao',
      phone: '+91 94400 55667',
      email: 'srinivas.rao@example.com',
      joinedDate: 'Dec 2023',
      responseTime: 'Within 45 mins'
    }
  }
];

export const mockSeekerStats = {
  savedPGsCount: 4,
  activeEnquiriesCount: 2,
  recentlyViewedCount: 8,
  savedPGs: [mockPGs[0], mockPGs[1], mockPGs[4]],
  enquiries: [
    {
      id: 'enq-101',
      pgName: 'Sunrise Premium Living',
      pgId: 'pg-001',
      date: '2026-08-08',
      status: 'Pending',
      ownerName: 'Rajesh Sharma',
      message: 'Interested in Double Sharing room. Is food included?'
    },
    {
      id: 'enq-102',
      pgName: 'Starlight Girls Executive PG',
      pgId: 'pg-002',
      date: '2026-08-05',
      status: 'Replied',
      ownerName: 'Sunita Reddy',
      message: 'Hi, can I visit tomorrow at 4 PM for a room tour?'
    }
  ]
};

export const mockOwnerStats = {
  totalPGs: 3,
  approvedPGs: 2,
  pendingPGs: 1,
  totalEnquiries: 14,
  pgListings: [
    {
      id: 'pg-001',
      name: 'Sunrise Premium Living',
      location: 'Sector 62, Noida',
      status: 'Approved',
      occupancy: '85%',
      monthlyRevenue: '₹68,000'
    },
    {
      id: 'pg-003',
      name: 'Metro Residency Boys PG',
      location: 'DLF Phase 3, Gurugram',
      status: 'Approved',
      occupancy: '70%',
      monthlyRevenue: '₹45,000'
    },
    {
      id: 'pg-007',
      name: 'Gaur City Executive Boys Stay',
      location: 'Greater Noida West',
      status: 'Pending Approval',
      occupancy: '0%',
      monthlyRevenue: '₹0'
    }
  ],
  recentEnquiries: [
    {
      id: 'enq-201',
      seekerName: 'Rahul Verma',
      phone: '+91 98712 34567',
      pgName: 'Sunrise Premium Living',
      date: 'Today, 11:30 AM',
      status: 'New',
      roomType: 'Double Sharing'
    },
    {
      id: 'enq-202',
      seekerName: 'Priya Sharma',
      phone: '+91 97112 88990',
      pgName: 'Sunrise Premium Living',
      date: 'Yesterday, 3:15 PM',
      status: 'Contacted',
      roomType: 'Single Room'
    }
  ]
};

export const mockAdminStats = {
  totalUsers: 1420,
  totalPGs: 380,
  pendingApprovals: 12,
  approvedPGs: 368,
  totalEnquiries: 4890,
  reportsCount: 3,
  usersSummary: [
    { id: 'usr-1', name: 'Aarav Patel', role: 'Seeker', email: 'aarav@example.com', dateJoined: '2026-08-01', status: 'Active' },
    { id: 'usr-2', name: 'Rajesh Sharma', role: 'Owner', email: 'rajesh@example.com', dateJoined: '2024-01-15', status: 'Active' },
    { id: 'usr-3', name: 'Sunita Reddy', role: 'Owner', email: 'sunita@example.com', dateJoined: '2023-03-20', status: 'Active' },
    { id: 'usr-4', name: 'Megha Gupta', role: 'Seeker', email: 'megha@example.com', dateJoined: '2026-08-07', status: 'Active' }
  ],
  pendingApprovalsList: [
    { id: 'pg-007', name: 'Gaur City Executive Stay', ownerName: 'Deepak Kumar', location: 'Greater Noida West', dateSubmitted: '2026-08-09' },
    { id: 'pg-008', name: 'Whitefield Tech Haven', ownerName: 'Anil Kumar', location: 'Bangalore', dateSubmitted: '2026-08-08' }
  ]
};
