#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 HYPER-FOCUSED FINAL RESOLVER - TARGETING SPECIFIC PATTERNS');
console.log('=' .repeat(70));

// Get all source files, excluding node_modules
function getAllSourceFiles() {
    const files = [];
    
    function scanDirectory(dir) {
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    scanDirectory(fullPath);
                } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(item)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Skip inaccessible directories
        }
    }
    
    scanDirectory('src');
    return files;
}

// Enhanced file analysis with specific patterns
function analyzeFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) return { score: 0, size: 0, content: '' };
        
        const stat = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        
        let score = 0;
        
        // Size scoring (larger files often more complete)
        if (stat.size > 3000) score += 30;
        else if (stat.size > 1000) score += 20;
        else if (stat.size > 300) score += 10;
        else if (stat.size > 50) score += 5;
        
        // Content quality indicators
        if (content.includes('export default')) score += 20;
        if (content.includes('interface ') || content.includes('type ')) score += 15;
        if (content.includes('useState') || content.includes('useEffect')) score += 15;
        if (content.includes('@/') || content.includes('~/')) score += 10; // Modern imports
        if (content.includes('Supabase') || content.includes('supabase')) score += 15;
        if (content.includes('className=') || content.includes('tw-')) score += 10;
        
        // Architecture preference scoring
        if (filePath.includes('/ui/')) score += 25; // Strong UI folder preference
        if (filePath.includes('/components/')) score += 20;
        if (filePath.includes('/shared/')) score += 15;
        if (filePath.includes('/core/')) score += 10;
        if (filePath.includes('/domains/')) score += 8;
        
        // Depth scoring (prefer organized structure)
        const depth = filePath.split('/').length;
        if (depth >= 6) score += 10;
        else if (depth >= 4) score += 5;
        
        // Specific patterns
        if (filePath.includes('__tests__')) score -= 5; // Prefer non-test files
        if (filePath.includes('.test.') || filePath.includes('.spec.')) score -= 10;
        
        return { score, size: stat.size, content, path: filePath };
    } catch (error) {
        return { score: 0, size: 0, content: '', path: filePath };
    }
}

// Hyper-focused resolution targeting specific patterns
function hyperFocusedResolve(files) {
    const analyses = files.map(analyzeFile);
    analyses.sort((a, b) => b.score - a.score);
    
    const best = analyses[0];
    const candidates = analyses.slice(1);
    
    console.log(`   📊 Best: ${best.path} (Score: ${best.score}, Size: ${best.size})`);
    
    let resolved = false;
    
    for (const candidate of candidates) {
        console.log(`   📋 Candidate: ${candidate.path} (Score: ${candidate.score}, Size: ${candidate.size})`);
        
        // Hyper-focused safety checks
        if (candidate.content && best.content) {
            const sizeDiff = Math.abs(best.size - candidate.size) / Math.max(best.size, candidate.size);
            
            // Very conservative - only remove if very similar or clearly inferior
            if (candidate.score < best.score - 10 && sizeDiff < 0.5) {
                try {
                    console.log(`   🗑️  Removing: ${candidate.path} (clearly inferior)`);
                    fs.unlinkSync(candidate.path);
                    resolved = true;
                } catch (error) {
                    console.log(`   ❌ Error removing ${candidate.path}: ${error.message}`);
                }
            } else {
                console.log(`   🛡️  Preserving: ${candidate.path} (significant differences)`);
            }
        } else {
            console.log(`   🛡️  Preserving: ${candidate.path} (content analysis failed)`);
        }
    }
    
    return resolved;
}

// Main execution
function main() {
    const files = getAllSourceFiles();
    const duplicateGroups = {};
    
    // Group files by name
    for (const file of files) {
        const name = path.basename(file);
        if (!duplicateGroups[name]) duplicateGroups[name] = [];
        duplicateGroups[name].push(file);
    }
    
    // Filter for duplicates with manageable counts
    const targetGroups = Object.entries(duplicateGroups)
        .filter(([name, files]) => files.length >= 2 && files.length <= 5)
        .sort(([, a], [, b]) => a.length - b.length); // Process smaller groups first
    
    console.log(`📊 Found ${targetGroups.length} manageable duplicate groups`);
    console.log('');
    
    let resolved = 0;
    let preserved = 0;
    
    // Target specific high-value files
    const highValueTargets = [
        'user.ts', 'order.ts', 'schema.ts', 'validation.ts', 'Store.ts',
        'utils.tsx', 'loader.tsx', 'layout.tsx', 'MapPicker.tsx'
    ];
    
    for (const [fileName, filePaths] of targetGroups) {
        if (filePaths.length <= 1) continue;
        
        // Prioritize high-value targets
        const isHighValue = highValueTargets.some(target => 
            fileName.toLowerCase().includes(target.toLowerCase())
        );
        
        if (!isHighValue && filePaths.length > 3) {
            console.log(`🔄 Skipping ${fileName} - not high-value and too many instances`);
            preserved++;
            continue;
        }
        
        console.log(`\n🎯 Hyper-Processing: ${fileName} (${filePaths.length} files)`);
        
        if (hyperFocusedResolve(filePaths)) {
            resolved++;
            console.log(`   ✅ Resolved ${fileName}`);
        } else {
            preserved++;
            console.log(`   🛡️  Preserved ${fileName} - all files significant`);
        }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('🎯 HYPER-FOCUSED RESOLUTION COMPLETE!');
    console.log(`✅ Files Resolved: ${resolved}`);
    console.log(`🛡️  Files Preserved: ${preserved}`);
    console.log(`📊 Success Rate: ${Math.round((resolved / (resolved + preserved)) * 100)}%`);
    console.log('');
    
    return { resolved, preserved };
}

// Execute if run directly
if (require.main === module) {
    main();
}

module.exports = { main };
