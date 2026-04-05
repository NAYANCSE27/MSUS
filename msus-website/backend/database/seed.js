/**
 * Database Seeder
 * Seeds the database with initial data
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '../.env' });

// Import models
const User = require('../models/User');
const ActivityModule = require('../models/ActivityModule');
const Settings = require('../models/Settings');
const Post = require('../models/Post');
const Event = require('../models/Event');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/msus');

// Seed data
const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await User.deleteMany();
    await ActivityModule.deleteMany();
    await Settings.deleteMany();
    await Post.deleteMany();
    await Event.deleteMany();

    console.log('✓ Cleared existing data');

    // Create Super Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@msus.org.bd',
      phone: '+880 1234-567890',
      password: process.env.ADMIN_PASSWORD || 'Admin123!',
      role: 'superadmin',
      status: 'active',
      bio: 'System administrator for MSUS',
      address: {
        village: 'Mohammadpur',
        postOffice: 'Ulchapara',
        upazila: 'Brahmanbaria Sadar',
        district: 'Brahmanbaria',
        division: 'Chattogram'
      }
    });

    console.log('✓ Created super admin:', admin.email);

    // Create Settings
    const settings = await Settings.create({
      organization: {
        name: {
          en: 'Mohammadpur Samaj Unnayan Sangathan',
          bn: 'মোহাম্মদপুর সমাজ উন্নয়ন সংগঠন'
        },
        shortName: {
          en: 'MSUS',
          bn: 'মোসাস'
        },
        tagline: {
          en: 'Working Together for Social Development',
          bn: 'সমাজের উন্নয়নে আমরা একসাথে'
        },
        description: {
          en: 'A non-profit social development organization dedicated to improving lives in Mohammadpur, Ulchapara, Brahmanbaria.',
          bn: 'ব্রাহ্মণবাড়িয়ার মোহাম্মদপুর, উলচাপাড়ায় জনজীবনের উন্নয়নে নিবেদিত একটি অলাভজনক সামাজিক উন্নয়ন সংগঠন।'
        },
        foundedYear: 2020,
        registrationNumber: 'MSUS-2020-001'
      },
      contact: {
        email: 'info@msus.org.bd',
        phone: '+880 1234-567890',
        mobile: '+880 1700-000000',
        whatsapp: '+880 1700-000000',
        address: {
          en: {
            line1: 'Mohammadpur, Ulchapara',
            line2: 'Brahmanbaria Sadar',
            district: 'Brahmanbaria',
            division: 'Chattogram',
            postcode: '3400',
            country: 'Bangladesh'
          },
          bn: {
            line1: 'মোহাম্মদপুর, উলচাপাড়া',
            line2: 'ব্রাহ্মণবাড়িয়া সদর',
            district: 'ব্রাহ্মণবাড়িয়া',
            division: 'চট্টগ্রাম',
            postcode: '৩৪০০',
            country: 'বাংলাদেশ'
          }
        }
      },
      donation: {
        minimumAmount: 100,
        suggestedAmounts: [500, 1000, 2000, 5000, 10000],
        enableRecurring: true,
        enableAnonymous: true,
        showDonorList: true,
        categories: [
          { key: 'general', name: { en: 'General Donation', bn: 'সাধারণ অনুদান' }, isActive: true },
          { key: 'education', name: { en: 'Education Support', bn: 'শিক্ষা সহায়তা' }, isActive: true },
          { key: 'healthcare', name: { en: 'Healthcare', bn: 'স্বাস্থ্যসেবা' }, isActive: true },
          { key: 'zakat', name: { en: 'Zakat', bn: 'যাকাত' }, isActive: true }
        ]
      }
    });

    console.log('✓ Created settings');

    // Create Activity Modules
    const modules = [
      {
        type: 'education',
        name: { en: 'Education Support', bn: 'শিক্ষা সহায়তা' },
        shortDescription: {
          en: 'Providing educational support to underprivileged students',
          bn: 'সুবিধাবঞ্চিত শিক্ষার্থীদের শিক্ষা সহায়তা প্রদান'
        },
        description: {
          en: 'Our education support program aims to provide quality education to underprivileged children in our community. We offer scholarships, distribute educational materials, and organize tutoring programs.',
          bn: 'আমাদের শিক্ষা সহায়তা কর্মসূচি আমাদের সম্প্রদায়ের সুবিধাবঞ্চিত শিশুদের মানসম্মত শিক্ষা প্রদানে লক্ষ্য রেখেছে। আমরা বৃত্তি প্রদান, শিক্ষা সামগ্রী বিতরণ এবং টিউটরিং কর্মসূচি পরিচালনা করি।'
        },
        stats: {
          beneficiaries: 250,
          completedProjects: 15,
          ongoingProjects: 5,
          volunteers: 45,
          fundsRaised: 1500000
        },
        displayOrder: 1
      },
      {
        type: 'healthcare',
        name: { en: 'Healthcare Support', bn: 'স্বাস্থ্যসেবা' },
        shortDescription: {
          en: 'Medical assistance and health awareness programs',
          bn: 'চিকিৎসা সহায়তা ও স্বাস্থ্য সচেতনতা কর্মসূচি'
        },
        description: {
          en: 'We organize free medical camps, provide health awareness education, and assist needy families with medical expenses.',
          bn: 'আমরা বিনামূল্যে চিকিৎসা শিবির আয়োজন করি, স্বাস্থ্য সচেতনতা শিক্ষা প্রদান করি এবং অসহায় পরিবারদের চিকিৎসা ব্যয়ে সহায়তা করি।'
        },
        stats: {
          beneficiaries: 500,
          completedProjects: 20,
          ongoingProjects: 3,
          volunteers: 30,
          fundsRaised: 2000000
        },
        displayOrder: 2
      },
      {
        type: 'social_awareness',
        name: { en: 'Social Awareness', bn: 'সামাজিক সচেতনতা' },
        shortDescription: {
          en: 'Creating awareness on social issues',
          bn: 'সামাজিক বিষয়ে সচেতনতা সৃষ্টি'
        },
        description: {
          en: 'Our social awareness programs focus on educating the community about important issues like sanitation, hygiene, and social rights.',
          bn: 'আমাদের সামাজিক সচেতনতা কর্মসূচি স্যানিটেশন, স্বাস্থ্যবিধি এবং সামাজিক অধিকারের মতো গুরুত্বপূর্ণ বিষয়ে সম্প্রদায়কে শিক্ষিত করতে কেন্দ্রীভূত।'
        },
        stats: {
          beneficiaries: 1000,
          completedProjects: 25,
          ongoingProjects: 8,
          volunteers: 60,
          fundsRaised: 800000
        },
        displayOrder: 3
      },
      {
        type: 'library',
        name: { en: 'Library System', bn: 'গ্রন্থাগার' },
        shortDescription: {
          en: 'Community library and knowledge center',
          bn: 'সম্প্রদায় গ্রন্থাগার ও জ্ঞান কেন্দ্র'
        },
        description: {
          en: 'Our community library provides free access to books, computers, and educational resources for all community members.',
          bn: 'আমাদের সম্প্রদায় গ্রন্থাগার সকল সদস্যদের জন্য বই, কম্পিউটার এবং শিক্ষা সম্পদে বিনামূল্যে প্রবেশাধিকার প্রদান করে।'
        },
        stats: {
          beneficiaries: 300,
          completedProjects: 3,
          ongoingProjects: 1,
          volunteers: 15,
          fundsRaised: 600000
        },
        displayOrder: 4
      },
      {
        type: 'sports_cultural',
        name: { en: 'Sports & Cultural', bn: 'ক্রীড়া ও সাংস্কৃতিক' },
        shortDescription: {
          en: 'Promoting sports and cultural activities',
          bn: 'ক্রীড়া ও সাংস্কৃতিক কার্যক্রম প্রচার'
        },
        description: {
          en: 'We organize sports competitions and cultural events to promote physical fitness and cultural heritage among youth.',
          bn: 'তরুণদের মধ্যে শারীরিক সুস্থতা ও সাংস্কৃতিক ঐতিহ্য প্রচারের জন্য আমরা ক্রীড়া প্রতিযোগিতা ও সাংস্কৃতিক অনুষ্ঠান আয়োজন করি।'
        },
        stats: {
          beneficiaries: 400,
          completedProjects: 12,
          ongoingProjects: 4,
          volunteers: 35,
          fundsRaised: 500000
        },
        displayOrder: 5
      },
      {
        type: 'antidrug',
        name: { en: 'Anti-Drug Campaign', bn: 'মাদকবিরোধী প্রচারণা' },
        shortDescription: {
          en: 'Fighting drug abuse in our community',
          bn: 'আমাদের সম্প্রদায়ে মাদকের অপব্যবহার বিরোধী'
        },
        description: {
          en: 'Our anti-drug campaign works to prevent drug abuse through education, counseling, and community support programs.',
          bn: 'আমাদের মাদকবিরোধী প্রচারণা শিক্ষা, পরামর্শ এবং সম্প্রদায় সহায়তা কর্মসূচির মাধ্যমে মাদকের অপব্যবহার প্রতিরোধে কাজ করে।'
        },
        stats: {
          beneficiaries: 600,
          completedProjects: 18,
          ongoingProjects: 6,
          volunteers: 40,
          fundsRaised: 400000
        },
        displayOrder: 6
      },
      {
        type: 'infrastructure',
        name: { en: 'Infrastructure Development', bn: 'অবকাঠামো উন্নয়ন' },
        shortDescription: {
          en: 'Building community infrastructure',
          bn: 'সম্প্রদায় অবকাঠামো নির্মাণ'
        },
        description: {
          en: 'We undertake infrastructure projects like road repairs, sanitation facilities, and community centers to improve living conditions.',
          bn: 'জীবনযাত্রার মান উন্নয়নের জন্য আমরা রাস্তা মেরামত, স্যানিটেশন সুবিধা এবং সম্প্রদায় কেন্দ্রের মতো অবকাঠামো প্রকল্প হাতে নিই।'
        },
        stats: {
          beneficiaries: 2000,
          completedProjects: 8,
          ongoingProjects: 2,
          volunteers: 25,
          fundsRaised: 3000000
        },
        displayOrder: 7
      },
      {
        type: 'humanitarian',
        name: { en: 'Humanitarian Aid', bn: 'মানবিক সহায়তা' },
        shortDescription: {
          en: 'Emergency relief and humanitarian support',
          bn: 'জরুরী ত্রাণ ও মানবিক সহায়তা'
        },
        description: {
          en: 'We provide emergency relief during disasters and humanitarian aid to the most vulnerable members of our community.',
          bn: 'আমরা দুর্যোগকালীন জরুরী ত্রাণ প্রদান করি এবং আমাদের সম্প্রদায়ের সবচেয়ে দুর্বল সদস্যদের মানবিক সহায়তা প্রদান করি।'
        },
        stats: {
          beneficiaries: 800,
          completedProjects: 10,
          ongoingProjects: 2,
          volunteers: 50,
          fundsRaised: 2500000
        },
        displayOrder: 8
      }
    ];

    await ActivityModule.insertMany(modules);
    console.log('✓ Created activity modules');

    // Create sample posts
    const posts = [
      {
        title: 'Annual General Meeting 2024',
        slug: 'annual-general-meeting-2024-' + Date.now(),
        excerpt: 'Join us for our Annual General Meeting on January 15, 2024.',
        content: 'We are pleased to announce our Annual General Meeting for 2024. All members are invited to attend.',
        category: 'announcement',
        featuredImage: 'https://via.placeholder.com/800x400?text=AGM+2024',
        status: 'published',
        publishedAt: new Date(),
        author: admin._id,
        isFeatured: true,
        language: 'en'
      },
      {
        title: 'শিক্ষা সহায়তা কর্মসূচি ২০২৪',
        slug: 'shikha-sahayota-karmsuchi-2024-' + Date.now(),
        excerpt: '২০২৪ সালের শিক্ষা সহায়তা কর্মসূচি শুরু হয়েছে।',
        content: '২০২৪ সালের জন্য শিক্ষা সহায়তা কর্মসূচি শুরু হয়েছে। আগ্রহী শিক্ষার্থীরা আবেদন করতে পারেন।',
        category: 'news',
        featuredImage: 'https://via.placeholder.com/800x400?text=Education+2024',
        status: 'published',
        publishedAt: new Date(),
        author: admin._id,
        isFeatured: true,
        language: 'bn'
      }
    ];

    await Post.insertMany(posts);
    console.log('✓ Created sample posts');

    // Create sample events
    const events = [
      {
        title: 'Free Medical Camp',
        description: 'Free medical checkup and consultation for all community members.',
        category: 'healthcare',
        eventType: 'campaign',
        featuredImage: 'https://via.placeholder.com/800x400?text=Medical+Camp',
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-02-15'),
        location: {
          venue: 'Community Center',
          address: 'Mohammadpur, Ulchapara'
        },
        status: 'published',
        createdBy: admin._id
      },
      {
        title: 'Tree Plantation Drive',
        description: 'Join us in planting 1000 trees in our community.',
        category: 'social_awareness',
        eventType: 'campaign',
        featuredImage: 'https://via.placeholder.com/800x400?text=Tree+Plantation',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-01'),
        location: {
          venue: 'School Ground',
          address: 'Mohammadpur High School'
        },
        status: 'published',
        createdBy: admin._id
      }
    ];

    await Event.insertMany(events);
    console.log('✓ Created sample events');

    console.log('\n✅ Database seed completed successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email:', admin.email);
    console.log('Password: (set in .env or default: Admin123!)');

    process.exit();
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

// Run seeder
seedData();
