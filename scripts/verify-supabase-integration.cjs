// scripts/verify-supabase-integration.js
const fs = require('fs');
const path = require('path');

// Patterns that might indicate hardcoded data
const hardcodedDataPatterns = [
  /const\s+\w+\s*=\s*\[\s*{[^}]*}\s*,\s*{[^}]*}/,  // Array of objects
  /const\s+\w+\s*=\s*{[^{}]*name[^{}]*:[^{}]*,[^{}]*}/,  // Object with name property
  /const\s+\w+\s*=\s*\[\s*['"][^'"]*['"]\s*,\s*['"][^'"]*['"]/  // Array of strings
];

// Acceptable patterns (imports, types, configs)
const acceptablePatterns = [
  /import/,
  /interface/,
  /type\s+\w+/,
  /export\s+const/,
  /theme:/,
  /className:/,
  /style:/,
  /config:/,
  /default\w*Data/,  // Default fallback data
  /fallback/i,
];

function scanDirectory(dir) {
  const results = {
    potentialHardcoded: [],
    supabaseIntegrated: [],
    total: 0
  };
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      const subResults = scanDirectory(fullPath);
      results.potentialHardcoded.push(...subResults.potentialHardcoded);
      results.supabaseIntegrated.push(...subResults.supabaseIntegrated);
      results.total += subResults.total;
    } else if (
      file.name.endsWith('.tsx') || 
      file.name.endsWith('.ts')
    ) {
      results.total++;
      
      // Read file content
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if file uses Supabase
      if (content.includes('supabase') || content.includes('createClientComponentClient')) {
        results.supabaseIntegrated.push(fullPath);
      }
      
      // Check for hardcoded patterns
      for (const pattern of hardcodedDataPatterns) {
        if (pattern.test(content)) {
          // Check if it's an acceptable pattern
          let isAcceptable = false;
          for (const acceptablePattern of acceptablePatterns) {
            if (acceptablePattern.test(content)) {
              isAcceptable = true;
              break;
            }
          }
          
          // If not acceptable and doesn't use supabase, flag it
          if (!isAcceptable && !content.includes('supabase')) {
            results.potentialHardcoded.push({
              file: fullPath,
              pattern: pattern.toString()
            });
            break;
          }
        }
      }
    }
  }
  
  return results;
}

console.log('🔍 Scanning for Supabase integration and hardcoded data...\n');

const results = scanDirectory('src');

console.log(`📊 SCAN RESULTS:`);
console.log(`Total files scanned: ${results.total}`);
console.log(`Files with Supabase integration: ${results.supabaseIntegrated.length}`);
console.log(`Files with potential hardcoded data: ${results.potentialHardcoded.length}`);
console.log(`Supabase integration rate: ${((results.supabaseIntegrated.length / results.total) * 100).toFixed(1)}%\n`);

console.log(`✅ FILES WITH SUPABASE INTEGRATION (${results.supabaseIntegrated.length}):`);
results.supabaseIntegrated.slice(0, 10).forEach(file => {
  console.log(`  ${file.replace('src\\', '').replace('src/', '')}`);
});
if (results.supabaseIntegrated.length > 10) {
  console.log(`  ... and ${results.supabaseIntegrated.length - 10} more files`);
}

console.log(`\n⚠️  POTENTIAL HARDCODED DATA (${results.potentialHardcoded.length}):`);
results.potentialHardcoded.slice(0, 10).forEach(item => {
  console.log(`  ${item.file.replace('src\\', '').replace('src/', '')}`);
});
if (results.potentialHardcoded.length > 10) {
  console.log(`  ... and ${results.potentialHardcoded.length - 10} more files`);
}

console.log(`\n🎯 RECOMMENDATIONS:`);
if (results.potentialHardcoded.length > 0) {
  console.log(`- Convert ${results.potentialHardcoded.length} files to use Supabase integration`);
  console.log(`- Add fallback strategies for data loading`);
  console.log(`- Implement proper error handling for database operations`);
} else {
  console.log(`- ✅ All critical hardcoded data has been converted!`);
}

console.log(`\n📈 PROGRESS:`);
const conversionRate = ((results.supabaseIntegrated.length / (results.supabaseIntegrated.length + results.potentialHardcoded.length)) * 100);
console.log(`Data integration completion: ${conversionRate.toFixed(1)}%`);
