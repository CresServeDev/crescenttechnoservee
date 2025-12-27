const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyAbqw4GojHf6_LhSpAUbRynjU38TwRKwkY',
  authDomain: 'crescent-support.firebaseapp.com',
  projectId: 'crescent-support',
  storageBucket: 'crescent-support.firebasestorage.app',
  messagingSenderId: '730070407628',
  appId: '1:730070407628:web:395a6229851179c9e2e569',
  measurementId: 'G-HXXR5G7HWS'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTestServiceSubscriptions() {
  try {
    console.log('Adding test service subscriptions with dates...');

    // Calculate dates
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    const subscriptions = [
      {
        planId: 'basic',
        planName: 'Basic Package',
        planPrice: 5000,
        billingDetails: {
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice@example.com',
          phone: '1111111111',
          company: 'Tech Corp',
          street1: '123 Main St',
          town: 'Mumbai',
          district: 'Maharashtra',
          zip: '400001',
          country: 'India'
        },
        status: 'active',
        createdAt: serverTimestamp(),
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        userId: null
      },
      {
        planId: 'classic',
        planName: 'Classic Package',
        planPrice: 10000,
        billingDetails: {
          firstName: 'Bob',
          lastName: 'Wilson',
          email: 'bob@example.com',
          phone: '2222222222',
          company: 'Wilson Enterprises',
          street1: '456 Business Ave',
          town: 'Delhi',
          district: 'Delhi',
          zip: '110001',
          country: 'India'
        },
        status: 'active',
        createdAt: serverTimestamp(),
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        userId: null
      },
      {
        planId: 'enterprise',
        planName: 'Enterprise Package',
        planPrice: 20000,
        billingDetails: {
          firstName: 'Carol',
          lastName: 'Davis',
          email: 'carol@example.com',
          phone: '3333333333',
          company: 'Davis Solutions',
          street1: '789 Corporate Blvd',
          town: 'Bangalore',
          district: 'Karnataka',
          zip: '560001',
          country: 'India'
        },
        status: 'active',
        createdAt: serverTimestamp(),
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        userId: null
      }
    ];

    for (const subscription of subscriptions) {
      const docRef = await addDoc(collection(db, 'serviceSubscriptions'), subscription);
      console.log('Service subscription added with ID:', docRef.id);
    }

    console.log('Test service subscriptions added successfully!');
  } catch (error) {
    console.error('Error adding test service subscriptions:', error);
  }
}

addTestServiceSubscriptions();
