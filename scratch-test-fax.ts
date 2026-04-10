import { FaxClient } from './lib/fax-client';

async function testFaxStatus() {
  const client = new FaxClient();
  console.log('--- Testing FaxClient (Mock Mode) ---');
  
  const receiptId = 'MOCK_12345';
  
  try {
    console.log('1. Testing getFaxResult...');
    const result = await client.getFaxResult(receiptId);
    console.log('Result:', result);
    
    console.log('\n2. Testing getPreviewURL...');
    const url = await client.getPreviewURL(receiptId);
    console.log('Preview URL:', url);
    
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testFaxStatus();
