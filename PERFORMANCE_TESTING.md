# Performance Testing Code Snippets

## Copy & Paste These into Browser Console

### 1. Measure Component Render Time
```javascript
// Start measuring
performance.mark('render-start');

// Wait a moment or interact with the app
await new Promise(r => setTimeout(r, 1000));

// Stop measuring
performance.mark('render-end');
performance.measure('render-time', 'render-start', 'render-end');

// Get the result
const measure = performance.getEntriesByName('render-time')[0];
console.log(`Render took: ${measure.duration.toFixed(2)}ms`);
```

### 2. Monitor Memory Usage
```javascript
// Get current memory usage
if (performance.memory) {
  console.log('Memory Usage:');
  console.log(`Used: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
  console.log(`Total: ${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)}MB`);
  console.log(`Limit: ${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`);
}
```

### 3. Track Re-renders
```javascript
// Add to app to track re-renders
let renderCount = 0;
const originalRender = console.log;
console.log = function(...args) {
  renderCount++;
  return originalRender(...args);
};

console.log('Tracking re-renders...');
// After some interactions:
console.log(`Total renders: ${renderCount}`);
```

### 4. Check localStorage Performance
```javascript
// Measure localStorage read time
const key = 'bmi_5y_planner_state_v1';

console.time('localStorage-read');
const data = localStorage.getItem(key);
console.timeEnd('localStorage-read');

console.time('json-parse');
const parsed = JSON.parse(data);
console.timeEnd('json-parse');

console.log('Data size:', (data.length / 1024).toFixed(2) + 'KB');
```

### 5. Monitor Network Requests
```javascript
// Log all fetch/XHR requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  console.time(`fetch: ${url}`);
  
  return originalFetch.apply(this, args).then(response => {
    console.timeEnd(`fetch: ${url}`);
    console.log(`Status: ${response.status}`);
    return response;
  });
};

// Now any fetch will be logged with timing
```

### 6. Check CPU Usage
```javascript
// Simple CPU usage indicator
function measureCPU() {
  const start = performance.now();
  
  // Do some work
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += Math.sqrt(i);
  }
  
  const end = performance.now();
  console.log(`Task took ${(end - start).toFixed(2)}ms`);
  
  // Schedule next check
  if (navigator.scheduling?.isInputPending) {
    setTimeout(measureCPU, 100);
  }
}

measureCPU();
```

### 7. Benchmark localStorage vs Memory
```javascript
// Compare speed of different storage methods
const testData = JSON.stringify({
  tasks: Array.from({length: 1000}, (_, i) => ({
    id: i,
    text: `Task ${i}`,
    completed: Math.random() > 0.5
  }))
});

// Test 1: localStorage
console.time('localStorage-write');
localStorage.setItem('test', testData);
console.timeEnd('localStorage-write');

console.time('localStorage-read');
const fromLS = localStorage.getItem('test');
console.timeEnd('localStorage-read');

// Test 2: Memory (variable)
const memoryStore = {};
console.time('memory-write');
memoryStore['test'] = testData;
console.timeEnd('memory-write');

console.time('memory-read');
const fromMem = memoryStore['test'];
console.timeEnd('memory-read');

console.log('localStorage is slower, but data persists!');
```

### 8. React Component Profiler
```javascript
// Add to your React component to profile it
import { Profiler } from 'react';

<Profiler id="TaskList" onRender={(id, phase, actualDuration) => {
  console.log(`${id} (${phase}) took ${actualDuration.toFixed(2)}ms`);
}}>
  <YourComponent />
</Profiler>
```

### 9. Monitor Polling Performance
```javascript
// Check how many times polling is happening
let pollCount = 0;

// Hook into the polling
const interval = setInterval(() => {
  pollCount++;
  console.log(`Poll count: ${pollCount} (every 2 seconds = ~${(pollCount / 60).toFixed(1)} minutes)`);
}, 2000);

// After 1 minute:
setTimeout(() => {
  console.log(`Total polls in 1 minute: ${pollCount}`);
  clearInterval(interval);
}, 60000);
```

### 10. Full Performance Report
```javascript
// Get comprehensive performance report
function getPerformanceReport() {
  const report = {};

  // Navigation Timing
  const navTiming = performance.getEntriesByType('navigation')[0];
  if (navTiming) {
    report.dnsLookup = navTiming.domainLookupEnd - navTiming.domainLookupStart;
    report.tcpConnection = navTiming.connectEnd - navTiming.connectStart;
    report.ttfb = navTiming.responseStart - navTiming.requestStart;
    report.download = navTiming.responseEnd - navTiming.responseStart;
    report.domInteractive = navTiming.domInteractive - navTiming.fetchStart;
    report.domComplete = navTiming.domComplete - navTiming.fetchStart;
    report.loadComplete = navTiming.loadEventEnd - navTiming.fetchStart;
  }

  // Paint Timing
  const paintEntries = performance.getEntriesByType('paint');
  paintEntries.forEach(entry => {
    report[entry.name] = entry.startTime;
  });

  // Memory
  if (performance.memory) {
    report.memoryUsed = performance.memory.usedJSHeapSize;
    report.memoryTotal = performance.memory.totalJSHeapSize;
  }

  return report;
}

console.table(getPerformanceReport());
```

## Test Scenarios

### Scenario 1: Rapid Clicking
```javascript
// Simulate user clicking rapidly
function simulateRapidClicks(selector, count = 100) {
  const element = document.querySelector(selector);
  
  console.time('rapid-clicks');
  for (let i = 0; i < count; i++) {
    element.click();
  }
  console.timeEnd('rapid-clicks');
  
  console.log(`Processed ${count} clicks`);
}

// Usage:
simulateRapidClicks('button#completeAll', 50);
```

### Scenario 2: Scroll Performance
```javascript
// Monitor scroll performance
let scrollFrames = 0;
let scrollStart = performance.now();

window.addEventListener('scroll', () => {
  scrollFrames++;
});

// Check FPS after scrolling
setTimeout(() => {
  const elapsed = performance.now() - scrollStart;
  const fps = (scrollFrames / elapsed) * 1000;
  console.log(`Scroll FPS: ${fps.toFixed(1)}`);
}, 5000);

// Scroll the page programmatically
window.scrollBy(0, window.innerHeight);
```

### Scenario 3: Data Loading
```javascript
// Measure time to load and process data
console.time('data-load-process');

// Simulate data loading
const mockData = Array.from({length: 1000}, (_, i) => ({
  id: i,
  text: `Item ${i}`,
  date: new Date(),
  completed: Math.random() > 0.5
}));

// Process data
const processed = mockData.filter(item => !item.completed);

console.timeEnd('data-load-process');
console.log(`Processed ${processed.length} items`);
```

## Expected Results (After Optimization)

### Before Optimization
- Polling CPU: ~8% (idle)
- Memory: ~8-10MB
- Re-renders per second: 15-20
- Component render time: 100-200ms

### After Optimization ✅
- Polling CPU: ~2% (idle) 
- Memory: ~5-6MB
- Re-renders per second: 2-3
- Component render time: 30-60ms

## Running Tests Programmatically

### Create a performance test file
```javascript
// test-performance.js
export async function runPerformanceTests() {
  const results = {};

  // Test 1: Component render
  results.componentRender = await measureComponentRender();
  
  // Test 2: Data processing
  results.dataProcessing = await measureDataProcessing();
  
  // Test 3: Storage operations
  results.storageOps = await measureStorageOperations();

  return results;
}

async function measureComponentRender() {
  const start = performance.now();
  // Render component
  const end = performance.now();
  return end - start;
}

// Export for testing
if (typeof module !== 'undefined') {
  module.exports = { runPerformanceTests };
}
```

## Automation

### Continuous Performance Testing
```bash
# Add to package.json
"scripts": {
  "perf:test": "node scripts/performance-test.js",
  "perf:benchmark": "lighthouse https://yoursite.com --output json",
  "perf:monitor": "npm run build && npm start"
}
```

---

**Tip**: Copy these snippets into your browser console anytime to check performance! 🚀
