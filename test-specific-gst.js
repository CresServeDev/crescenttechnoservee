// Test specific GST number
const gstService = require('./src/gstService.js').default;

async function testSpecificGST() {
  console.log('Testing specific GST number: 27ABJFA2736R1ZV\n');

  try {
    const result = await gstService.fetchCompanyDetails('27ABJFA2736R1ZV');
    console.log('✅ 27ABJFA2736R1ZV:', result.companyName);
    console.log('   Status:', result.status);
    console.log('   Source:', result.source);
  } catch (error) {
    console.log('❌ 27ABJFA2736R1ZV:', error.message);
  }
}

testSpecificGST();
