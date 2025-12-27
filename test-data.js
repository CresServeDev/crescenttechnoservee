const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

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

async function addTestData() {
  try {
    console.log('Adding test orders...');

    // Add multiple test orders
    const orders = [
      {
        userId: 'user-001',
        items: [
          {
            id: '1',
            title: 'Wireless Headphones',
            price: 150,
            qty: 1
          }
        ],
        billingDetails: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890'
        },
        total: 150,
        status: 'pending',
        createdAt: new Date()
      },
      {
        userId: 'user-002',
        items: [
          {
            id: '2',
            title: 'Smart Watch',
            price: 300,
            qty: 1
          },
          {
            id: '3',
            title: 'Phone Case',
            price: 25,
            qty: 2
          }
        ],
        billingDetails: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '0987654321'
        },
        total: 350,
        status: 'shipped',
        createdAt: new Date(Date.now() - 86400000) // Yesterday
      },
      {
        userId: 'user-001',
        items: [
          {
            id: '4',
            title: 'Laptop Stand',
            price: 75,
            qty: 1
          }
        ],
        billingDetails: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890'
        },
        total: 75,
        status: 'delivered',
        createdAt: new Date(Date.now() - 172800000) // 2 days ago
      }
    ];

    for (const order of orders) {
      const docRef = await addDoc(collection(db, 'orders'), order);
      console.log('Order added with ID:', docRef.id);
    }

    console.log('Test data added successfully!');
  } catch (error) {
    console.error('Error adding test data:', error);
  }
}

addTestData();
