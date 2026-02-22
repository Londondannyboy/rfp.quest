#!/usr/bin/env node
/**
 * Test JigsawStack SDK Intelligence Extraction
 * Using official SDK instead of raw API calls
 */

const { JigsawStack } = require('jigsawstack');

// Test configuration
const JIGSAWSTACK_API_KEY = 'sk_ae59b7c93dd5a071266ce32722feb5b06cfdf6bb67d32cf25cd1ca2178e1ef4ccf6f5834d28ceb0edfa08412a08edb36e8a15033d33609f8c5f06eb4a4ecc53a024FAvUyt9dkrUomG473n';
const TEST_COMPANY = 'Rolls-Royce Holdings PLC';
const COMPANY_NUMBER = '07524813';

const jigsaw = JigsawStack({ apiKey: JIGSAWSTACK_API_KEY });

async function testJigsawStackSDK() {
  console.log('🧪 Testing JigsawStack SDK Intelligence Extraction');
  console.log(`📊 Company: ${TEST_COMPANY}`);
  console.log(`🔢 Company Number: ${COMPANY_NUMBER}\n`);
  
  try {
    // First test with simple example to verify SDK works
    console.log('🔍 Step 1: Testing SDK with example image...');
    
    const testResponse = await jigsaw.vision.vocr({
      url: "https://jigsawstack.com/preview/vocr-example.jpg",
      prompt: ["total_price", "tax"]
    });
    
    console.log('✅ SDK test successful!');
    console.log('Example response:', JSON.stringify(testResponse, null, 2));
    
    // Now test with Companies House document
    console.log('\n🔍 Step 2: Getting Companies House document...');
    const documentUrl = await getCompanyDocument(COMPANY_NUMBER);
    
    if (!documentUrl) {
      throw new Error('No document found');
    }
    
    console.log(`📄 Document URL: ${documentUrl.substring(0, 60)}...`);
    
    // Test intelligence extraction
    console.log('\n🚀 Step 3: Extracting company intelligence...');
    const startTime = Date.now();
    
    const intelligence = await jigsaw.vision.vocr({
      url: documentUrl,
      prompt: [
        "annual revenue or turnover amount",
        "net profit amount", 
        "number of employees",
        "SECR compliance mentioned",
        "carbon emissions data",
        "going concern statement"
      ]
    });
    
    const processingTime = (Date.now() - startTime) / 1000;
    console.log(`⏱️  Processing time: ${processingTime}s`);
    
    console.log('\n📈 EXTRACTION RESULTS:');
    displayResults(intelligence);
    
    console.log('\n✅ Test completed successfully!');
    return intelligence;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

async function getCompanyDocument(companyNumber) {
  const https = require('https');
  
  return new Promise((resolve, reject) => {
    const url = `https://api.company-information.service.gov.uk/company/${companyNumber}/filing-history?category=accounts&items_per_page=1`;
    
    const options = {
      headers: {
        'Authorization': 'Basic ' + Buffer.from('3a953db3-d41e-47a6-98df-637b591cb63d:').toString('base64')
      }
    };
    
    console.log('🔍 Step 2a: Getting filing history...');
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
          
          console.log('🔍 Step 2b: Getting document metadata...');
          const metadataUrl = latestFiling.links.document_metadata;
          
          https.get(metadataUrl, options, (metaRes) => {
            let metaData = '';
            metaRes.on('data', (chunk) => { metaData += chunk; });
            metaRes.on('end', () => {
              try {
                const metadata = JSON.parse(metaData);
                const documentLinkUrl = metadata.links?.document;
                
                if (!documentLinkUrl) {
                  reject(new Error('No document link in metadata'));
                  return;
                }
                
                console.log('🔍 Step 2c: Triggering AWS presigned URL...');
                console.log(`📄 Document link: ${documentLinkUrl}`);
                
                // Now click the document link to get the 60-second AWS presigned URL
                https.get(documentLinkUrl, options, (docRes) => {
                  // Check if we get a redirect to AWS
                  if (docRes.statusCode >= 300 && docRes.statusCode < 400) {
                    const awsUrl = docRes.headers.location;
                    console.log('✅ Got AWS presigned URL! (60 seconds to use it)');
                    console.log(`📄 AWS URL: ${awsUrl.substring(0, 80)}...`);
                    resolve(awsUrl);
                  } else {
                    // If no redirect, the current URL might be the AWS URL
                    console.log(`📄 Direct response (status ${docRes.statusCode})`);
                    resolve(documentLinkUrl);
                  }
                  
                  // Don't consume the body, we just want the redirect
                  docRes.destroy();
                }).on('error', reject);
                
              } catch (error) {
                reject(new Error(`Metadata parse error: ${error.message}`));
              }
            });
          }).on('error', reject);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

function displayResults(intelligence) {
  console.log('📊 Response structure:', Object.keys(intelligence));
  
  if (intelligence.context) {
    console.log('📄 Extracted context data:');
    console.log(JSON.stringify(intelligence.context, null, 2));
    
    // Analyze what we found
    const prompts = [
      "annual revenue or turnover in pounds",
      "net profit figure", 
      "number of employees",
      "SECR compliance status",
      "carbon emissions total",
      "going concern statement"
    ];
    
    console.log('\n🔍 SPECIFIC DATA EXTRACTION RESULTS:');
    prompts.forEach(prompt => {
      if (intelligence.context[prompt] && intelligence.context[prompt].length > 0) {
        console.log(`✅ ${prompt}: ${intelligence.context[prompt].join(', ')}`);
      } else {
        console.log(`❌ ${prompt}: Not found`);
      }
    });
  }
  
  // Check if we have raw text data
  if (intelligence.sections && intelligence.sections.length > 0) {
    const fullText = intelligence.sections.map(s => s.text).join('\n');
    console.log(`\n📝 Total text extracted: ${fullText.length} characters`);
    console.log('📝 Text preview:');
    console.log(fullText.substring(0, 1000) + '...');
    
    // Look for specific financial indicators in the text
    const text = fullText.toLowerCase();
    console.log('\n💡 TEXT ANALYSIS:');
    console.log(`💰 Contains "revenue" or "turnover": ${text.includes('revenue') || text.includes('turnover')}`);
    console.log(`💰 Contains "profit": ${text.includes('profit')}`);
    console.log(`👥 Contains "employee": ${text.includes('employee')}`);
    console.log(`🌱 Contains "carbon": ${text.includes('carbon')}`);
    console.log(`🌱 Contains "secr": ${text.includes('secr')}`);
    console.log(`⚠️ Contains "going concern": ${text.includes('going concern')}`);
  }
  
  // Look for specific data points
  const content = JSON.stringify(intelligence).toLowerCase();
  
  console.log('\n🔍 INTELLIGENCE ANALYSIS:');
  console.log(`💰 Revenue mentioned: ${content.includes('revenue') || content.includes('turnover') ? '✅' : '❌'}`);
  console.log(`👥 Employee data: ${content.includes('employee') ? '✅' : '❌'}`);
  console.log(`🌱 SECR/Carbon data: ${content.includes('secr') || content.includes('carbon') ? '✅' : '❌'}`);
  console.log(`⚠️  Risk indicators: ${content.includes('going concern') || content.includes('uncertainty') ? '✅' : '❌'}`);
}

// Run the test
if (require.main === module) {
  testJigsawStackSDK();
}