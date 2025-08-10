#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 FINAL ULTIMATE RESOLVER - PUSHING TO MAXIMUM COMPLETION');
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

// Group files by name
function groupFilesByName(files) {
    const groups = {};
    for (const file of files) {
        const name = path.basename(file);
        if (!groups[name]) groups[name] = [];
        groups[name].push(file);
    }
    return Object.entries(groups).filter(([name, files]) => files.length > 1);
}

// Enhanced file analysis
function analyzeFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) return { score: 0, size: 0, content: '' };
        
        const stat = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        
        let score = 0;
        
        // Size scoring (larger files often more complete)
        if (stat.size > 5000) score += 25;
        else if (stat.size > 2000) score += 15;
        else if (stat.size > 500) score += 10;
        else if (stat.size > 100) score += 5;
        
        // Content quality indicators
        if (content.includes('export default')) score += 15;
        if (content.includes('interface ') || content.includes('type ')) score += 10;
        if (content.includes('useState') || content.includes('useEffect')) score += 10;
        if (content.includes('@/')) score += 5; // Modern import paths
        if (content.includes('className=')) score += 5;
        if (content.includes('Supabase') || content.includes('supabase')) score += 10;
        
        // Architecture scoring
        if (filePath.includes('/ui/')) score += 20; // UI folder preference
        if (filePath.includes('/components/')) score += 15;
        if (filePath.includes('/shared/')) score += 10;
        if (filePath.includes('/core/')) score += 8;
        
        // Penalize scattered files
        if (filePath.split('/').length < 4) score -= 5;
        
        return { score, size: stat.size, content, path: filePath };
    } catch (error) {
        return { score: 0, size: 0, content: '', path: filePath };
    }
}

// Intelligent resolution logic
function resolveGroup(files) {
    const analyses = files.map(analyzeFile);
    analyses.sort((a, b) => b.score - a.score);
    
    const best = analyses[0];
    const others = analyses.slice(1);
    
    // Advanced safety checks
    for (const other of others) {
        // If files are very different in content, preserve both
        if (other.content && best.content) {
            const sizeDiff = Math.abs(best.size - other.size) / Math.max(best.size, other.size);
            const contentSimilarity = calculateSimilarity(best.content, other.content);
            
            if (sizeDiff > 0.7 || contentSimilarity < 0.6) {
                console.log(`   ⚠️  Preserving ${other.path} - significant differences detected`);
                continue;
            }
        }
        
        // Safe to remove
        try {
            console.log(`   🗑️  Removing: ${other.path}`);
            fs.unlinkSync(other.path);
            return true; // Successfully resolved one
        } catch (error) {
            console.log(`   ❌ Error removing ${other.path}: ${error.message}`);
        }
    }
    
    return false;
}

// Simple content similarity check
function calculateSimilarity(content1, content2) {
    if (!content1 || !content2) return 0;
    
    const lines1 = content1.split('\n').filter(line => line.trim());
    const lines2 = content2.split('\n').filter(line => line.trim());
    
    if (lines1.length === 0 || lines2.length === 0) return 0;
    
    let matchingLines = 0;
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (const line1 of lines1) {
        if (lines2.some(line2 => line1.trim() === line2.trim())) {
            matchingLines++;
        }
    }
    
    return matchingLines / maxLines;
}

// Main execution
function main() {
    const files = getAllSourceFiles();
    const duplicateGroups = groupFilesByName(files);
    
    console.log(`📊 Found ${duplicateGroups.length} groups of duplicate files`);
    console.log('');
    
    let resolved = 0;
    let preserved = 0;
    
    // Focus on high-impact resolutions
    const highPriorityPatterns = [
        'auth.ts', 'database.ts', 'cache.ts', 'middleware.ts',
        'components.tsx', 'utils.tsx', 'schema.ts', 'schemas.ts',
        'table.tsx', 'modal.tsx', 'loading.tsx', 'error-boundary.tsx',
        'user.ts', 'order.ts', 'product.ts', 'validation.ts'
    ];
    
    for (const [fileName, filePaths] of duplicateGroups) {
        if (filePaths.length <= 1) continue;
        
        // Prioritize high-impact files
        const isHighPriority = highPriorityPatterns.some(pattern => 
            fileName.toLowerCase().includes(pattern.toLowerCase())
        );
        
        if (!isHighPriority && filePaths.length > 10) {
            console.log(`🔄 Skipping ${fileName} - too many instances (${filePaths.length}), likely architectural`);
            preserved++;
            continue;
        }
        
        console.log(`\n🎯 Processing: ${fileName} (${filePaths.length} files)`);
        
        if (resolveGroup(filePaths)) {
            resolved++;
            console.log(`   ✅ Resolved ${fileName}`);
        } else {
            preserved++;
            console.log(`   🛡️  Preserved ${fileName} - content differences detected`);
        }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('🏆 FINAL ULTIMATE RESOLUTION COMPLETE!');
    console.log(`✅ Files Resolved: ${resolved}`);
    console.log(`🛡️  Files Preserved: ${preserved}`);
    console.log(`📊 Processing Rate: ${Math.round((resolved / (resolved + preserved)) * 100)}%`);
    console.log('');
    
    return { resolved, preserved };
}

// Execute if run directly
if (require.main === module) {
    main();
}

module.exports = { main };
