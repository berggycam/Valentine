// Test deployed frontend API
async function testDeployedAPI() {
  console.log('Testing deployed frontend API...\n');
  
  try {
    // Test proposals API through deployed frontend
    console.log('1. Testing deployed /api/proposals');
    const proposalsRes = await fetch('https://valentine-kohl-seven.vercel.app/api/proposals');
    const proposalsData = await proposalsRes.json();
    console.log('Status:', proposalsRes.status);
    console.log('Success:', proposalsData.success);
    console.log('Proposals count:', proposalsData.data?.length || 0);
    
    // Test responses API through deployed frontend
    console.log('\n2. Testing deployed /api/responses');
    const responsesRes = await fetch('https://valentine-kohl-seven.vercel.app/api/responses');
    const responsesData = await responsesRes.json();
    console.log('Status:', responsesRes.status);
    console.log('Success:', responsesData.success);
    console.log('Responses count:', responsesData.data?.length || 0);
    
    // Show sample data
    if (proposalsData.data && proposalsData.data.length > 0) {
      console.log('\nSample proposal from frontend API:');
      console.log(JSON.stringify(proposalsData.data[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDeployedAPI();
