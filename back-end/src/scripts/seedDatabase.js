import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import Truck from '../models/truck.model.js';
import Trailer from '../models/trailer.model.js';
import Tire from '../models/tire.model.js';
import Trip from '../models/trip.model.js';
import FuelLog from '../models/fuelLog.model.js';
import MaintenanceLog from '../models/maintenanceLog.model.js';
import MaintenanceRules from '../models/maintenanceRules.model.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Connect to database
await connectDB();

// Clear existing data
async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  await User.deleteMany({});
  await Truck.deleteMany({});
  await Trailer.deleteMany({});
  await Tire.deleteMany({});
  await Trip.deleteMany({});
  await FuelLog.deleteMany({});
  await MaintenanceLog.deleteMany({});
  await MaintenanceRules.deleteMany({});
  console.log('✅ Database cleared\n');
}

// Seed Users
async function seedUsers() {
  console.log('👥 Seeding users...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    // Admin users
    {
      fullname: 'Admin Principal',
      role: 'admin',
      email: 'admin@ictruckflow.com',
      passwordHash,
      isActive: true
    },

    // Driver users
    {
      fullname: 'Mohammed Alami',
      role: 'driver',
      email: 'mohammed.alami@ictruckflow.com',
      passwordHash,
      licenseNumber: 'DL-MA-001234',
      cin: 'AB123456',
      phone: '+212612345678',
      isActive: true
    },
    {
      fullname: 'Fatima Zahra',
      role: 'driver',
      email: 'fatima.zahra@ictruckflow.com',
      passwordHash,
      licenseNumber: 'DL-MA-005678',
      cin: 'CD789012',
      phone: '+212623456789',
      isActive: true
    },
    {
      fullname: 'Youssef Benali',
      role: 'driver',
      email: 'youssef.benali@ictruckflow.com',
      passwordHash,
      licenseNumber: 'DL-MA-009012',
      cin: 'EF345678',
      phone: '+212634567890',
      isActive: true
    },
    {
      fullname: 'Amina Idrissi',
      role: 'driver',
      email: 'amina.idrissi@ictruckflow.com',
      passwordHash,
      licenseNumber: 'DL-MA-003456',
      cin: 'GH901234',
      phone: '+212645678901',
      isActive: true
    },
    {
      fullname: 'Hassan Tazi',
      role: 'driver',
      email: 'hassan.tazi@ictruckflow.com',
      passwordHash,
      licenseNumber: 'DL-MA-007890',
      cin: 'IJ567890',
      phone: '+212656789012',
      isActive: true
    },
    {
      fullname: 'Laila Benjelloun',
      role: 'driver',
      email: 'laila.benjelloun@ictruckflow.com',
      passwordHash,
      licenseNumber: 'DL-MA-001122',
      cin: 'KL123456',
      phone: '+212667890123',
      isActive: false // Inactive driver
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users\n`);
  return createdUsers;
}

// Seed Trucks
async function seedTrucks() {
  console.log('🚛 Seeding trucks...');

  const trucks = [
    {
      registrationNumber: 'ABC-1234-MA',
      brand: 'Volvo',
      model: 'FH16',
      currentKm: 125000,
      fuelCapacity: 500,
      status: 'available',
      lastOilChangeKm: 120000,
      lastGeneralCheckDate: new Date('2024-11-15')
    },
    {
      registrationNumber: 'DEF-5678-MA',
      brand: 'Mercedes-Benz',
      model: 'Actros',
      currentKm: 89000,
      fuelCapacity: 450,
      status: 'available',
      lastOilChangeKm: 85000,
      lastGeneralCheckDate: new Date('2024-11-20')
    },
    {
      registrationNumber: 'GHI-9012-MA',
      brand: 'Scania',
      model: 'R450',
      currentKm: 156000,
      fuelCapacity: 550,
      status: 'on_trip',
      lastOilChangeKm: 150000,
      lastGeneralCheckDate: new Date('2024-10-10')
    },
    {
      registrationNumber: 'JKL-3456-MA',
      brand: 'MAN',
      model: 'TGX',
      currentKm: 203000,
      fuelCapacity: 480,
      status: 'available',
      lastOilChangeKm: 195000,
      lastGeneralCheckDate: new Date('2024-11-01')
    },
    {
      registrationNumber: 'MNO-7890-MA',
      brand: 'DAF',
      model: 'XF',
      currentKm: 67000,
      fuelCapacity: 500,
      status: 'maintenance',
      lastOilChangeKm: 60000,
      lastGeneralCheckDate: new Date('2024-11-25')
    },
    {
      registrationNumber: 'PQR-1122-MA',
      brand: 'Iveco',
      model: 'Stralis',
      currentKm: 178000,
      fuelCapacity: 470,
      status: 'available',
      lastOilChangeKm: 170000,
      lastGeneralCheckDate: new Date('2024-10-20')
    }
  ];

  const createdTrucks = await Truck.insertMany(trucks);
  console.log(`✅ Created ${createdTrucks.length} trucks\n`);
  return createdTrucks;
}

// Seed Trailers
async function seedTrailers() {
  console.log('🚚 Seeding trailers...');

  const trailers = [
    {
      serialNumber: 'TRL-001-MA',
      type: 'Flatbed',
      maxLoadKg: 25000,
      status: 'available',
      lastCheckDate: new Date('2024-11-10')
    },
    {
      serialNumber: 'TRL-002-MA',
      type: 'Refrigerated',
      maxLoadKg: 22000,
      status: 'on_trip',
      lastCheckDate: new Date('2024-11-15')
    },
    {
      serialNumber: 'TRL-003-MA',
      type: 'Container',
      maxLoadKg: 30000,
      status: 'available',
      lastCheckDate: new Date('2024-11-05')
    },
    {
      serialNumber: 'TRL-004-MA',
      type: 'Tanker',
      maxLoadKg: 28000,
      status: 'available',
      lastCheckDate: new Date('2024-11-20')
    },
    {
      serialNumber: 'TRL-005-MA',
      type: 'Flatbed',
      maxLoadKg: 26000,
      status: 'maintenance',
      lastCheckDate: new Date('2024-10-30')
    },
    {
      serialNumber: 'TRL-006-MA',
      type: 'Container',
      maxLoadKg: 29000,
      status: 'available',
      lastCheckDate: new Date('2024-11-12')
    }
  ];

  const createdTrailers = await Trailer.insertMany(trailers);
  console.log(`✅ Created ${createdTrailers.length} trailers\n`);
  return createdTrailers;
}

// Seed Tires
async function seedTires(trucks) {
  console.log('🛞 Seeding tires...');

  const tires = [];
  const positions = ['front-left', 'front-right', 'rear-left-outer', 'rear-left-inner', 'rear-right-outer', 'rear-right-inner'];

  // Create 6 tires for each truck
  trucks.forEach((truck, truckIndex) => {
    positions.forEach((position, posIndex) => {
      const installKm = truck.currentKm - (Math.random() * 50000 + 10000);
      const kmDriven = truck.currentKm - installKm;

      let condition = 'good';
      if (kmDriven > 80000) condition = 'critical';
      else if (kmDriven > 50000) condition = 'worn';

      tires.push({
        position,
        installKm: Math.round(installKm),
        currentKm: truck.currentKm,
        condition,
        truck: truck._id
      });
    });
  });

  const createdTires = await Tire.insertMany(tires);

  // Update trucks with tire references
  for (const truck of trucks) {
    const truckTires = createdTires.filter(tire => tire.truck.toString() === truck._id.toString());
    truck.tires = truckTires.map(tire => tire._id);
    await truck.save();
  }

  console.log(`✅ Created ${createdTires.length} tires\n`);
  return createdTires;
}

// Seed Maintenance Rules
async function seedMaintenanceRules() {
  console.log('⚙️  Seeding maintenance rules...');

  const rules = [
    {
      type: 'oil',
      everyKm: 10000,
      everyMonths: 6
    },
    {
      type: 'tires',
      everyKm: 50000,
      everyMonths: null
    },
    {
      type: 'engine',
      everyKm: 30000,
      everyMonths: 12
    },
    {
      type: 'general',
      everyKm: null,
      everyMonths: 3
    }
  ];

  const createdRules = await MaintenanceRules.insertMany(rules);
  console.log(`✅ Created ${createdRules.length} maintenance rules\n`);
  return createdRules;
}

// Seed Trips
async function seedTrips(drivers, trucks, trailers) {
  console.log('🗺️  Seeding trips...');

  const locations = [
    { start: 'Casablanca', end: 'Marrakech' },
    { start: 'Rabat', end: 'Tangier' },
    { start: 'Fes', end: 'Agadir' },
    { start: 'Casablanca', end: 'Oujda' },
    { start: 'Marrakech', end: 'Essaouira' },
    { start: 'Tangier', end: 'Casablanca' },
    { start: 'Agadir', end: 'Rabat' },
    { start: 'Meknes', end: 'Fes' }
  ];

  const trips = [];
  const now = new Date();

  // Finished trips (past)
  for (let i = 0; i < 8; i++) {
    const driver = drivers[i % drivers.length];
    const truck = trucks[i % trucks.length];
    const trailer = trailers[i % trailers.length];
    const location = locations[i % locations.length];

    const plannedDate = new Date(now);
    plannedDate.setDate(now.getDate() - (30 - i * 3));

    const startKm = truck.currentKm - (500 + Math.random() * 300);
    const distance = 200 + Math.random() * 400;
    const endKm = startKm + distance;
    const fuelUsed = distance * (0.25 + Math.random() * 0.1); // 25-35L per 100km

    trips.push({
      driver: driver._id,
      truck: truck._id,
      trailer: trailer._id,
      startLocation: location.start,
      endLocation: location.end,
      plannedDate,
      status: 'finished',
      startKm: Math.round(startKm),
      endKm: Math.round(endKm),
      totalDistance: Math.round(distance),
      fuelUsed: Math.round(fuelUsed),
      notes: `Trip completed successfully. Weather was good. No incidents.`
    });
  }

  // In progress trips (current)
  for (let i = 0; i < 2; i++) {
    const driver = drivers[i % drivers.length];
    const truck = trucks.find(t => t.status === 'on_trip') || trucks[i];
    const trailer = trailers.find(t => t.status === 'on_trip') || trailers[i];
    const location = locations[(i + 3) % locations.length];

    const plannedDate = new Date(now);
    plannedDate.setHours(now.getHours() - 4);

    const startKm = truck.currentKm - (100 + Math.random() * 50);

    trips.push({
      driver: driver._id,
      truck: truck._id,
      trailer: trailer._id,
      startLocation: location.start,
      endLocation: location.end,
      plannedDate,
      status: 'in_progress',
      startKm: Math.round(startKm),
      notes: 'Trip in progress. All systems normal.'
    });
  }

  // To-do trips (future)
  for (let i = 0; i < 5; i++) {
    const driver = drivers[i % drivers.length];
    const truck = trucks.filter(t => t.status === 'available')[i % trucks.filter(t => t.status === 'available').length];
    const trailer = trailers.filter(t => t.status === 'available')[i % trailers.filter(t => t.status === 'available').length];
    const location = locations[(i + 5) % locations.length];

    const plannedDate = new Date(now);
    plannedDate.setDate(now.getDate() + (i + 1));
    plannedDate.setHours(8, 0, 0, 0);

    trips.push({
      driver: driver._id,
      truck: truck._id,
      trailer: trailer._id,
      startLocation: location.start,
      endLocation: location.end,
      plannedDate,
      status: 'to_do'
    });
  }

  const createdTrips = await Trip.insertMany(trips);
  console.log(`✅ Created ${createdTrips.length} trips (8 finished, 2 in progress, 5 to-do)\n`);
  return createdTrips;
}

// Seed Fuel Logs
async function seedFuelLogs(trips) {
  console.log('⛽ Seeding fuel logs...');

  const stations = [
    'Total Station Casablanca',
    'Shell Station Rabat',
    'Afriquia Station Marrakech',
    'Total Station Tangier',
    'Shell Station Agadir',
    'Winxo Station Fes'
  ];

  const fuelLogs = [];

  // Add fuel logs for finished and in-progress trips
  const relevantTrips = trips.filter(t => t.status === 'finished' || t.status === 'in_progress');

  relevantTrips.forEach((trip, index) => {
    // 1-3 fuel logs per trip
    const numLogs = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numLogs; i++) {
      const liters = 80 + Math.random() * 120; // 80-200 liters
      const pricePerLiter = 11.5 + Math.random() * 2; // 11.5-13.5 MAD
      const totalCost = liters * pricePerLiter;

      const timestamp = new Date(trip.plannedDate);
      timestamp.setHours(timestamp.getHours() + (i * 3) + 2);

      fuelLogs.push({
        trip: trip._id,
        liters: Math.round(liters * 10) / 10,
        pricePerLiter: Math.round(pricePerLiter * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        stationName: stations[Math.floor(Math.random() * stations.length)],
        timestamp
      });
    }
  });

  const createdFuelLogs = await FuelLog.insertMany(fuelLogs);

  // Update trips with fuel log references
  for (const trip of relevantTrips) {
    const tripFuelLogs = createdFuelLogs.filter(log => log.trip.toString() === trip._id.toString());
    trip.fuelLogs = tripFuelLogs.map(log => log._id);
    await trip.save();
  }

  console.log(`✅ Created ${createdFuelLogs.length} fuel logs\n`);
  return createdFuelLogs;
}

// Seed Maintenance Logs
async function seedMaintenanceLogs(trucks, trips) {
  console.log('🔧 Seeding maintenance logs...');

  const maintenanceLogs = [];
  const types = ['oil', 'tires', 'engine', 'general'];
  const descriptions = {
    oil: [
      'Oil change and filter replacement',
      'Engine oil change with synthetic oil',
      'Oil and filter change - routine maintenance'
    ],
    tires: [
      'Tire rotation and pressure check',
      'Front tire replacement',
      'Tire alignment and balancing'
    ],
    engine: [
      'Engine diagnostic and tune-up',
      'Spark plugs replacement',
      'Engine belt replacement'
    ],
    general: [
      'General inspection and safety check',
      'Brake system inspection',
      'Complete vehicle inspection'
    ]
  };

  // Add maintenance logs for each truck
  trucks.forEach((truck, index) => {
    // 2-5 maintenance logs per truck
    const numLogs = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < numLogs; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const description = descriptions[type][Math.floor(Math.random() * descriptions[type].length)];

      const cost = type === 'oil' ? (400 + Math.random() * 200) :
        type === 'tires' ? (800 + Math.random() * 400) :
          type === 'engine' ? (1000 + Math.random() * 1500) :
            (300 + Math.random() * 200);

      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 60));

      // Some logs linked to trips
      const linkedTrip = Math.random() > 0.5 ? trips[Math.floor(Math.random() * trips.length)]._id : null;

      maintenanceLogs.push({
        truck: truck._id,
        trip: linkedTrip,
        type,
        description,
        cost: Math.round(cost * 100) / 100,
        date
      });
    }
  });

  const createdMaintenanceLogs = await MaintenanceLog.insertMany(maintenanceLogs);

  // Update trips with maintenance log references
  for (const trip of trips) {
    const tripMaintenanceLogs = createdMaintenanceLogs.filter(
      log => log.trip && log.trip.toString() === trip._id.toString()
    );
    if (tripMaintenanceLogs.length > 0) {
      trip.maintenanceLogs = tripMaintenanceLogs.map(log => log._id);
      await trip.save();
    }
  }

  console.log(`✅ Created ${createdMaintenanceLogs.length} maintenance logs\n`);
  return createdMaintenanceLogs;
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    await clearDatabase();

    // Seed in order (respecting dependencies)
    const users = await seedUsers();
    const drivers = users.filter(u => u.role === 'driver');

    const trucks = await seedTrucks();
    const trailers = await seedTrailers();
    const tires = await seedTires(trucks);
    const rules = await seedMaintenanceRules();

    const trips = await seedTrips(drivers, trucks, trailers);
    const fuelLogs = await seedFuelLogs(trips);
    const maintenanceLogs = await seedMaintenanceLogs(trucks, trips);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length} (${users.filter(u => u.role === 'admin').length} admins, ${drivers.length} drivers)`);
    console.log(`   - Trucks: ${trucks.length}`);
    console.log(`   - Trailers: ${trailers.length}`);
    console.log(`   - Tires: ${tires.length}`);
    console.log(`   - Trips: ${trips.length} (8 finished, 2 in progress, 5 to-do)`);
    console.log(`   - Fuel Logs: ${fuelLogs.length}`);
    console.log(`   - Maintenance Logs: ${maintenanceLogs.length}`);
    console.log(`   - Maintenance Rules: ${rules.length}\n`);

    console.log('🔑 Login Credentials:');
    console.log('   Admin: admin@ictruckflow.com / password123');
    console.log('   Driver: mohammed.alami@ictruckflow.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
