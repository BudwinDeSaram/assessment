const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const SERVICE_URL = process.argv[2] || process.env.SERVICE_URL || 'http://localhost:3000';
const TIMEOUT = parseInt(process.env.TIMEOUT) || 10000;

console.log('Starting smoke tests for Mock Service');
console.log(`Testing URL: ${SERVICE_URL}`);
console.log(`Timeout: ${TIMEOUT}ms`);
console.log('');

// Test counter
let testsRun = 0;
let testsPassed = 0;

// HTTP client helper
function makeRequest(url, timeout = TIMEOUT) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;
        
        const req = client.get(url, { timeout }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: data,
                    headers: res.headers
                });
            });
        });
        
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

// Test function
async function runTest(testName, endpoint, expectedStatus, expectedContent = null) {
    testsRun++;
    process.stdout.write(`Testing ${testName}... `);
    
    try {
        const response = await makeRequest(`${SERVICE_URL}${endpoint}`);
        
        // Check status code
        if (response.statusCode !== expectedStatus) {
            console.log(`FAILED (Expected status ${expectedStatus}, got ${response.statusCode})`);
            return false;
        }
        
        // Check content if provided
        if (expectedContent && !response.body.includes(expectedContent)) {
            console.log(`FAILED (Expected content '${expectedContent}' not found)`);
            console.log(`Response body: ${response.body}`);
            return false;
        }
        
        console.log('PASSED');
        testsPassed++;
        return true;
    } catch (error) {
        console.log(`FAILED (${error.message})`);
        return false;
    }
}

// Main test runner
async function runSmokeTests() {
    console.log('Running smoke tests...');
    console.log('');
    
    try {
        // Test 1: Health check
        await runTest('Health Check', '/health', 200, 'healthy');
        
        // Test 2: Readiness check
        await runTest('Readiness Check', '/ready', 200, 'ready');
        
        // Test 3: Root endpoint
        await runTest('Root Endpoint', '/', 200, 'Mock Service is running');
        
        // Test 4: Users API
        await runTest('Users API', '/api/users', 200, 'John Doe');
        
        // Test 5: Products API
        await runTest('Products API', '/api/products', 200, 'Laptop');
        
        // Results
        console.log('');
        console.log('Test Results:');
        console.log(`Tests run: ${testsRun}`);
        console.log(`Tests passed: ${testsPassed}`);
        console.log(`Tests failed: ${testsRun - testsPassed}`);

        if (testsPassed === testsRun) {
            console.log('All tests passed!');
            process.exit(0);
        } else {
            console.log('Some tests failed!');
            process.exit(1);
        }
    } catch (error) {
        console.error('Test runner error:', error.message);
        process.exit(1);
    }
}

// Run the tests
runSmokeTests();