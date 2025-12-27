// Simple test script for GST service
const gstService = require('./src/gstService.js').default;

async function testGST() {
  console.log('Testing GST Service...\n');

  const testGSTs = [
    '27AAACA1234A1Z1', // Mahindra & Mahindra
    '24AAMFJ3536G1ZE', // jay engineering
    '29AACCB2230H1ZL', // Infosys
    '07AAABC1234A1Z1', // Hindustan Unilever
    'INVALIDGST123',   // Invalid format
    '99ZZZZZ9999Z9Z9'  // Unknown valid format
  ];

  for (const gst of testGSTs) {
    try {
      const result = await gstService.fetchCompanyDetails(gst);
      console.log(`✅ ${gst}: ${result.companyName}`);
    } catch (error) {
      console.log(`❌ ${gst}: ${error.message}`);
    }
    // Wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testGST().catch(console.error);
