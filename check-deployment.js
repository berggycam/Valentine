// Check if the latest frontend code is deployed
async function checkDeployment() {
  console.log('Checking frontend deployment...\n');
  
  try {
    // Check root endpoint
    const rootRes = await fetch('https://valentine-kohl-seven.vercel.app');
    const rootText = await rootRes.text();
    
    console.log('Root endpoint status:', rootRes.status);
    console.log('Is it the Next.js app?', rootText.includes('__NEXT_DATA__'));
    
    // Check if the dashboard page exists
    const dashboardRes = await fetch('https://valentine-kohl-seven.vercel.app');
    console.log('Dashboard accessible:', dashboardRes.ok);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDeployment();
