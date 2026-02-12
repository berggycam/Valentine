// Check if deployed version has the latest search functionality
async function checkVersion() {
  console.log('Checking deployed version...\n');
  
  try {
    // Check if the new search placeholder exists
    const response = await fetch('https://valentine-kohl-seven.vercel.app');
    const html = await response.text();
    
    console.log('Checking for new search placeholder...');
    const hasNewPlaceholder = html.includes('Search by email to see your proposals and responses');
    console.log('Has new placeholder:', hasNewPlaceholder);
    
    console.log('\nChecking for Response interface updates...');
    const hasResponseInterface = html.includes('proposalId') && html.includes('fromName');
    console.log('Has Response interface:', hasResponseInterface);
    
    if (!hasNewPlaceholder || !hasResponseInterface) {
      console.log('\n⚠️ The deployed version is not the latest. You may need to:');
      console.log('1. Wait a few more minutes for Vercel to deploy');
      console.log('2. Or run the frontend locally to test');
    } else {
      console.log('\n✅ Latest version is deployed!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkVersion();
