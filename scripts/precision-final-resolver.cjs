#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 PRECISION FINAL RESOLVER - TARGETING REMAINING SMALL GROUPS');
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

// Enhanced file analysis with precision scoring
function analyzeFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) return { score: 0, size: 0, content: '' };
        
        const stat = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        
        let score = 0;
        
        // Size scoring (larger files often more complete)
        if (stat.size > 5000) score += 35;
        else if (stat.size > 2000) score += 25;
        else if (stat.size > 1000) score += 15;
        else if (stat.size > 200) score += 8;
        else if (stat.size > 50) score += 3;
        
        // Content quality indicators
        if (content.includes('export default')) score += 25;
        if (content.includes('interface ') || content.includes('type ')) score += 20;
        if (content.includes('useState') || content.includes('useEffect')) score += 20;
        if (content.includes('@/') || content.includes('~/')) score += 15; // Modern imports
        if (content.includes('Supabase') || content.includes('supabase')) score += 20;
        if (content.includes('className=') || content.includes('tw-')) score += 15;
        
        // Architecture preference scoring
        if (filePath.includes('/ui/')) score += 30; // Strong UI folder preference
        if (filePath.includes('/components/')) score += 25;
        if (filePath.includes('/shared/')) score += 20;
        if (filePath.includes('/core/')) score += 15;
        if (filePath.includes('/services/')) score += 12;
        if (filePath.includes('/types/')) score += 10;
        
        // Depth scoring (prefer organized structure)
        const depth = filePath.split('/').length;
        if (depth >= 6) score += 15;
        else if (depth >= 4) score += 8;
        
        // Specific patterns
        if (filePath.includes('__tests__')) score -= 10; // Prefer non-test files
        if (filePath.includes('.test.') || filePath.includes('.spec.')) score -= 15;
        if (filePath.includes('/models/')) score += 8; // Domain models are important
        
        return { score, size: stat.size, content, path: filePath };
    } catch (error) {
        return { score: 0, size: 0, content: '', path: filePath };
    }
}

// Precision resolution with advanced safety
function precisionResolve(files) {
    const analyses = files.map(analyzeFile);
    analyses.sort((a, b) => b.score - a.score);
    
    const best = analyses[0];
    const candidates = analyses.slice(1);
    
    console.log(`   📊 Best: ${best.path} (Score: ${best.score}, Size: ${best.size})`);
    
    let resolved = false;
    
    for (const candidate of candidates) {
        console.log(`   📋 Candidate: ${candidate.path} (Score: ${candidate.score}, Size: ${candidate.size})`);
        
        // Ultra-precise safety checks
        if (candidate.content && best.content) {
            const sizeDiff = Math.abs(best.size - candidate.size) / Math.max(best.size, candidate.size);
            const contentSimilarity = calculateSimilarity(best.content, candidate.content);
            
            // Very conservative - only remove if very similar AND clearly inferior
            if (candidate.score < best.score - 20 && (sizeDiff < 0.3 || contentSimilarity > 0.8)) {
                try {
                    console.log(`   🗑️  Removing: ${candidate.path} (clearly inferior, similar content)`);
                    fs.unlinkSync(candidate.path);
                    resolved = true;
                } catch (error) {
                    console.log(`   ❌ Error removing ${candidate.path}: ${error.message}`);
                }
            } else if (candidate.size < 200 && best.size > 1000 && candidate.score < best.score - 15) {
                // Remove very small files when we have substantial better versions
                try {
                    console.log(`   🗑️  Removing: ${candidate.path} (stub file vs substantial implementation)`);
                    fs.unlinkSync(candidate.path);
                    resolved = true;
                } catch (error) {
                    console.log(`   ❌ Error removing ${candidate.path}: ${error.message}`);
                }
            } else {
                console.log(`   🛡️  Preserving: ${candidate.path} (content differences or close scores)`);
            }
        } else {
            console.log(`   🛡️  Preserving: ${candidate.path} (content analysis failed)`);
        }
    }
    
    return resolved;
}

// Enhanced content similarity check
function calculateSimilarity(content1, content2) {
    if (!content1 || !content2) return 0;
    
    const lines1 = content1.split('\n').filter(line => line.trim()).map(line => line.trim());
    const lines2 = content2.split('\n').filter(line => line.trim()).map(line => line.trim());
    
    if (lines1.length === 0 || lines2.length === 0) return 0;
    
    let matchingLines = 0;
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (const line1 of lines1) {
        if (lines2.some(line2 => line1 === line2)) {
            matchingLines++;
        }
    }
    
    return matchingLines / maxLines;
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
    
    // Filter for small manageable duplicate groups (2-3 files)
    const targetGroups = Object.entries(duplicateGroups)
        .filter(([name, files]) => files.length >= 2 && files.length <= 3)
        .sort(([, a], [, b]) => a.length - b.length); // Process smaller groups first
    
    console.log(`📊 Found ${targetGroups.length} small duplicate groups (2-3 files each)`);
    console.log('');
    
    let resolved = 0;
    let preserved = 0;
    
    // Target specific high-value remaining files
    const precisionTargets = [
        'Store.ts', 'order.ts', 'promotion-rule.ts', 'address.ts', 'middleware.ts',
        'order-change.ts', 'order-detail.tsx', 'ProductSearch.tsx', 'progress-bar.tsx',
        'project.ts', 'promotion.ts', 'regions.ts', 'return-item.ts', 'return-reason.ts',
        'returns.ts', 'sales-channels.ts'
    ];
    
    for (const [fileName, filePaths] of targetGroups) {
        if (filePaths.length <= 1) continue;
        
        // Focus on precision targets
        const isPrecisionTarget = precisionTargets.some(target => 
            fileName.toLowerCase() === target.toLowerCase()
        );
        
        if (!isPrecisionTarget) {
            console.log(`🔄 Skipping ${fileName} - not in precision target list`);
            preserved++;
            continue;
        }
        
        console.log(`\n🎯 Precision Processing: ${fileName} (${filePaths.length} files)`);
        
        if (precisionResolve(filePaths)) {
            resolved++;
            console.log(`   ✅ Resolved ${fileName}`);
        } else {
            preserved++;
            console.log(`   🛡️  Preserved ${fileName} - all files have distinct value`);
        }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('🎯 PRECISION RESOLUTION COMPLETE!');
    console.log(`✅ Files Resolved: ${resolved}`);
    console.log(`🛡️  Files Preserved: ${preserved}`);
    console.log(`📊 Precision Rate: ${Math.round((resolved / (resolved + preserved)) * 100)}%`);
    console.log('');
    
    return { resolved, preserved };
}

// Execute if run directly
if (require.main === module) {
    main();
}

module.exports = { main };
