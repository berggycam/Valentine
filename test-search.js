// Test search functionality
async function testSearch() {
  console.log('Testing search functionality...\n');
  
  try {
    // Get all proposals
    const proposalsRes = await fetch('https://valentine-kohl-seven.vercel.app/api/proposals');
    const proposalsData = await proposalsRes.json();
    
    // Get all responses
    const responsesRes = await fetch('https://valentine-kohl-seven.vercel.app/api/responses');
    const responsesData = await responsesRes.json();
    
    const proposals = proposalsData.data || [];
    const responses = responsesData.data || [];
    
    console.log(`Total proposals: ${proposals.length}`);
    console.log(`Total responses: ${responses.length}\n`);
    
    // Test search for test@example.com
    const searchEmail = 'test@example.com';
    console.log(`Searching for: ${searchEmail}\n`);
    
    // Filter proposals (same logic as frontend)
    const filteredProposals = proposals.filter(proposal => 
      searchEmail === '' || 
      proposal.fromEmail.toLowerCase().includes(searchEmail.toLowerCase()) ||
      proposal.toEmail.toLowerCase().includes(searchEmail.toLowerCase())
    );
    
    // Filter responses (same logic as frontend)
    const filteredResponses = responses.filter(response => {
      if (searchEmail === '') return true;
      
      const matchesContent = 
        response.message.toLowerCase().includes(searchEmail.toLowerCase()) ||
        response.fromName.toLowerCase().includes(searchEmail.toLowerCase());
      
      const proposal = proposals.find(p => p.id === response.proposalId);
      
      const matchesEmail = proposal && (
        proposal.fromEmail.toLowerCase().includes(searchEmail.toLowerCase()) ||
        proposal.toEmail.toLowerCase().includes(searchEmail.toLowerCase())
      );
      
      return matchesContent || matchesEmail;
    });
    
    console.log(`Found ${filteredProposals.length} proposals:`);
    filteredProposals.forEach(p => {
      console.log(`  - ${p.fromName} -> ${p.toName} (${p.fromEmail})`);
    });
    
    console.log(`\nFound ${filteredResponses.length} responses:`);
    filteredResponses.forEach(r => {
      const proposal = proposals.find(p => p.id === r.proposalId);
      console.log(`  - Response from ${r.fromName} to ${proposal?.toName || 'Unknown'}`);
    });
    
    console.log(`\nTotal results: ${filteredProposals.length + filteredResponses.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSearch();
