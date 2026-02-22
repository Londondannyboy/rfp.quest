#!/usr/bin/env node
/**
 * Simple JigsawStack Intelligence Test
 * Tests basic document extraction with JigsawStack API
 */

const https = require('https');
const fs = require('fs');

// Test configuration
const JIGSAWSTACK_API_KEY = 'sk_a6afc41105983e67dbeda7c46267e7a74a1602606e2c81fc8ede95b3c1621cc12f16209ec3fea4c5ea46750449b9dd90a59640c0635d2d35b8f3c288925c707d0249lzZ3Aj9Ni4gYw0yuX';
const TEST_COMPANY = 'Rolls-Royce Holdings PLC';
const COMPANY_NUMBER = '07524813';

async function testJigsawStackExtraction() {
  console.log('🧪 Testing JigsawStack Intelligence Extraction');
  console.log(`📊 Company: ${TEST_COMPANY}`);
  console.log(`🔢 Company Number: ${COMPANY_NUMBER}\n`);
  
  try {
    // Step 1: Get Companies House document
    console.log('🔍 Step 1: Fetching Companies House document...');
    const documentUrl = await getCompanyDocument(COMPANY_NUMBER);
    
    if (!documentUrl) {
      throw new Error('No document found');
    }
    
    console.log(`📄 Document URL: ${documentUrl.substring(0, 60)}...`);
    
    // Step 2: Check document size
    console.log('📏 Step 2: Checking document size...');
    const docSize = await checkDocumentSize(documentUrl);
    console.log(`📄 Document size: ${docSize}MB`);
    
    if (docSize > 10) {
      console.log('⚠️  Large document detected - chunking recommended');
    }
    
    // Step 3: Extract intelligence with JigsawStack
    console.log('🚀 Step 3: Extracting intelligence with JigsawStack...');
    const startTime = Date.now();
    
    const intelligence = await callJigsawStack(documentUrl, TEST_COMPANY);
    
    const processingTime = (Date.now() - startTime) / 1000;
    console.log(`⏱️  Processing time: ${processingTime}s`);
    
    // Step 4: Display results
    console.log('\n📈 EXTRACTION RESULTS:');
    displayResults(intelligence);
    
    // Step 5: Test Clay format
    console.log('\n🔗 CLAY EXPORT FORMAT:');
    const clayFormat = formatForClay(intelligence, TEST_COMPANY, COMPANY_NUMBER);
    console.log(JSON.stringify(clayFormat, null, 2));
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

async function getCompanyDocument(companyNumber) {
  return new Promise((resolve, reject) => {
    const url = `https://api.company-information.service.gov.uk/company/${companyNumber}/filing-history?category=accounts&items_per_page=1`;
    
    const options = {
      headers: {
        'Authorization': 'Basic ' + Buffer.from('3a953db3-d41e-47a6-98df-637b591cb63d:').toString('base64')
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const latestFiling = json.items?.[0];
          
          if (!latestFiling?.links?.document_metadata) {
            reject(new Error('No document link found'));
            return;
          }
          
          // Get the document metadata first to get the actual PDF URL
          const metadataUrl = latestFiling.links.document_metadata;
          console.log(`📄 Metadata URL: ${metadataUrl.substring(0, 60)}...`);
          
          // Need to fetch the metadata to get the actual document URL
          const metadataOptions = {
            headers: {
              'Authorization': 'Basic ' + Buffer.from('3a953db3-d41e-47a6-98df-637b591cb63d:').toString('base64')
            }
          };
          
          https.get(metadataUrl, metadataOptions, (metaRes) => {
            let metaData = '';
            metaRes.on('data', (chunk) => { metaData += chunk; });
            metaRes.on('end', () => {
              try {
                const metadata = JSON.parse(metaData);
                const actualDocumentUrl = metadata.links?.document + '/content';
                console.log(`📄 Actual PDF URL: ${actualDocumentUrl.substring(0, 60)}...`);
                resolve(actualDocumentUrl);
              } catch (error) {
                reject(new Error(`Metadata parse error: ${error.message}`));
              }
            });
          }).on('error', (error) => {
            reject(new Error(`Metadata fetch error: ${error.message}`));
          });
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function checkDocumentSize(documentUrl) {
  return new Promise((resolve, reject) => {
    https.request(documentUrl, { method: 'HEAD' }, (res) => {
      const contentLength = res.headers['content-length'];
      if (contentLength) {
        const sizeInMB = (parseInt(contentLength) / 1024 / 1024).toFixed(1);
        resolve(sizeInMB);
      } else {
        resolve('Unknown');
      }
    }).on('error', reject).end();
  });
}

async function fetchPDFWithAuth(documentUrl) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': 'Basic ' + Buffer.from('3a953db3-d41e-47a6-98df-637b591cb63d:').toString('base64')
      }
    };
    
    https.get(documentUrl, options, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    }).on('error', reject);
  });
}

async function callJigsawStack(documentUrl, companyName) {
  const prompts = [
    "annual revenue or turnover in pounds",
    "net profit figure",
    "number of employees",
    "SECR compliance status",
    "carbon emissions total",
    "going concern statement"
  ];
  
  const requestData = JSON.stringify({
    url: documentUrl,
    prompt: prompts
  });
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.jigsawstack.com',
      port: 443,
      path: '/v1/vision/vocr',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': JIGSAWSTACK_API_KEY,
        'Content-Length': Buffer.byteLength(requestData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📡 Response status: ${res.statusCode}`);
        console.log(`📦 Response data length: ${data.length}`);
        console.log(`📄 Raw response: ${data.substring(0, 200)}...`);
        
        if (!data || data.length === 0) {
          reject(new Error('Empty response from JigsawStack API'));
          return;
        }
        
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode !== 200) {
            reject(new Error(`API Error ${res.statusCode}: ${response.message || data}`));
            return;
          }
          
          resolve(response);
        } catch (error) {
          reject(new Error(`Parse error: ${error.message} - Raw data: ${data.substring(0, 500)}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(requestData);
    req.end();
  });
}

function buildExtractionPrompt(companyName) {
  return `
Extract comprehensive business intelligence for ${companyName} from this annual report/accounts document.

Please extract the following key data points:

**FINANCIAL DATA:**
- Annual turnover/revenue (exact figure and currency)
- Gross profit and net profit
- Total assets and current assets
- Current ratio (current assets / current liabilities)
- Cash and cash equivalents
- Number of employees
- Revenue growth year-on-year percentage
- Profit margin percentage

**BUSINESS INTELLIGENCE:**
- Primary business areas and activities
- Geographic presence and markets served
- Major business segments and revenue breakdown
- Key strategic priorities mentioned
- R&D spending if mentioned
- Major risks identified
- Competitive advantages highlighted

**SUSTAINABILITY & ESG:**
- SECR (Streamlined Energy and Carbon Reporting) compliance (yes/no)
- Carbon emissions data (Scope 1, 2, 3 if available)
- Energy consumption figures
- Renewable energy usage percentage
- Environmental certifications (ISO 14001, etc.)
- Diversity and inclusion data
- Community investment figures

**GOVERNANCE & RISK:**
- Going concern statement (any material uncertainties?)
- Audit opinion (clean, qualified, etc.)
- Key person dependencies mentioned
- Major customer concentration risks
- Regulatory compliance issues
- Board composition and independence

**OPERATIONAL CAPABILITIES:**
- Manufacturing locations/facilities
- Quality certifications (ISO 9001, etc.)
- Security clearances or accreditations
- Supply chain information
- Technology and digital capabilities mentioned

For each data point found, please include:
1. The exact figure or statement
2. The page number where found (if available)
3. Brief context

Return the data in a structured format that can be easily parsed.
Focus on quantified metrics and specific facts rather than general statements.
`;
}

function displayResults(intelligence) {
  const data = intelligence.data || intelligence;
  
  console.log('Raw Response Type:', typeof data);
  console.log('Response Keys:', Object.keys(data || {}));
  
  if (typeof data === 'string') {
    console.log('\n📄 EXTRACTED TEXT (first 1000 chars):');
    console.log(data.substring(0, 1000) + (data.length > 1000 ? '...' : ''));
  } else if (data && typeof data === 'object') {
    console.log('\n📊 STRUCTURED DATA:');
    
    // Look for common financial indicators
    const content = JSON.stringify(data).toLowerCase();
    
    // Check for revenue/turnover
    if (content.includes('turnover') || content.includes('revenue')) {
      console.log('💰 Financial data found: ✅');
    }
    
    // Check for employee count
    if (content.includes('employee') || content.includes('staff')) {
      console.log('👥 Employee data found: ✅');
    }
    
    // Check for sustainability data
    if (content.includes('secr') || content.includes('carbon') || content.includes('emission')) {
      console.log('🌱 Sustainability data found: ✅');
    }
    
    // Check for risk data
    if (content.includes('going concern') || content.includes('uncertainty')) {
      console.log('⚠️ Risk data found: ✅');
    }
    
    console.log('\n📋 Full Response:');
    console.log(JSON.stringify(data, null, 2).substring(0, 2000) + '...');
  }
}

function formatForClay(intelligence, companyName, companyNumber) {
  // Extract basic info that Clay would want
  const data = intelligence.data || intelligence;
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  
  return {
    company_name: companyName,
    company_number: companyNumber,
    extraction_date: new Date().toISOString(),
    has_financial_data: content.toLowerCase().includes('turnover') || content.toLowerCase().includes('revenue'),
    has_sustainability_data: content.toLowerCase().includes('secr') || content.toLowerCase().includes('carbon'),
    has_risk_data: content.toLowerCase().includes('going concern') || content.toLowerCase().includes('uncertainty'),
    extraction_success: !!data,
    raw_data_preview: (typeof data === 'string' ? data : JSON.stringify(data)).substring(0, 500),
    recommended_for_bid: true, // Would calculate based on extracted data
    jigsawstack_response_type: typeof data,
  };
}

// Run the test
if (require.main === module) {
  testJigsawStackExtraction();
}