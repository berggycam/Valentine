// Test frontend API routes
async function testAPI() {
  console.log('Testing frontend API routes...\n');
  
  try {
    // Test proposals API
    console.log('1. Testing /api/proposals');
    const proposalsRes = await fetch('http://localhost:3000/api/proposals');
    const proposalsData = await proposalsRes.json();
    console.log('Status:', proposalsRes.status);
    console.log('Data:', proposalsData);
    console.log('Proposals count:', proposalsData.data?.length || 0);
    
    // Test responses API
    console.log('\n2. Testing /api/responses');
    const responsesRes = await fetch('http://localhost:3000/api/responses');
    const responsesData = await responsesRes.json();
    console.log('Status:', responsesRes.status);
    console.log('Data:', responsesData);
    console.log('Responses count:', responsesData.data?.length || 0);
    
    // Show sample data
    if (proposalsData.data && proposalsData.data.length > 0) {
      console.log('\nSample proposal:');
      console.log(JSON.stringify(proposalsData.data[0], null, 2));
    }
    
    if (responsesData.data && responsesData.data.length > 0) {
      console.log('\nSample response:');
      console.log(JSON.stringify(responsesData.data[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
