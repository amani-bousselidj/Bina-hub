#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Batch Redundancy Resolution Script
class BatchRedundancyResolver {
  constructor() {
    this.resolved = 0;
    this.skipped = 0;
    this.errors = 0;
    this.logFile = './file-organization/BATCH_RESOLUTION_LOG.md';
    
    // Initialize log
    fs.writeFileSync(this.logFile, `# Batch Redundancy Resolution Log\n\n**Started:** ${new Date().toISOString()}\n\n`);
  }

  log(message) {
    console.log(message);
    fs.appendFileSync(this.logFile, `${message}\n`);
  }

  async resolveUIComponentDuplicates() {
    this.log('\n## 🎯 Resolving UI Component Duplicates\n');
    
    const uiDuplicates = [
      'breadcrumb.tsx',
      'data-table.tsx', 
      'card.tsx',
      'input.tsx',
      'label.tsx',
      'select.tsx',
      'textarea.tsx',
      'tooltip.tsx',
      'popover.tsx',
      'sheet.tsx',
      'separator.tsx',
      'tabs.tsx',
      'switch.tsx',
      'progress.tsx',
      'badge.tsx'
    ];

    for (const component of uiDuplicates) {
      await this.resolveUIComponent(component);
    }
  }

  async resolveUIComponent(componentName) {
    const candidates = [
      `src/core/shared/components/${componentName}`,
      `src/core/shared/components/ui/${componentName}`,
      `src/components/ui/${componentName}`,
      `src/components/${componentName}`
    ].filter(file => fs.existsSync(file));

    if (candidates.length < 2) {
      this.log(`✅ ${componentName} - No redundancy (${candidates.length} file exists)`);
      this.skipped++;
      return;
    }

    try {
      // Prefer UI folder structure
      const preferred = candidates.find(file => file.includes('/ui/')) || candidates[0];
      const toRemove = candidates.filter(file => file !== preferred);

      this.log(`🔄 ${componentName}:`);
      this.log(`   Keep: ${preferred}`);
      
      for (const file of toRemove) {
        try {
          execSync(`Remove-Item "${file}" -Force`, { shell: 'powershell' });
          this.log(`   ❌ Removed: ${file}`);
          this.resolved++;
        } catch (e) {
          this.log(`   ⚠️  Failed to remove: ${file} - ${e.message}`);
          this.errors++;
        }
      }
    } catch (error) {
      this.log(`❌ Error processing ${componentName}: ${error.message}`);
      this.errors++;
    }
  }

  async resolveTypeDuplicates() {
    this.log('\n## 📝 Resolving Type Definition Duplicates\n');
    
    const typeDuplicates = [
      'auth.ts',
      'database.ts', 
      'cache.ts',
      'constants.ts',
      'types.ts',
      'index.ts'
    ];

    for (const typeFile of typeDuplicates) {
      await this.resolveTypeFile(typeFile);
    }
  }

  async resolveTypeFile(fileName) {
    const candidates = [];
    
    // Search for files
    try {
      const searchResult = execSync(`Get-ChildItem -Path "src" -Recurse -Name "${fileName}" | Select-Object -First 10`, 
        { encoding: 'utf8', shell: 'powershell' });
      
      const files = searchResult.trim().split('\n').filter(f => f.trim()).map(f => `src/${f.trim()}`);
      candidates.push(...files.filter(f => fs.existsSync(f)));
    } catch (e) {
      // File doesn't exist or search failed
      return;
    }

    if (candidates.length < 2) {
      this.log(`✅ ${fileName} - No redundancy (${candidates.length} file exists)`);
      this.skipped++;
      return;
    }

    try {
      // Prefer core/shared for shared types, domain-specific for specialized types
      const coreShared = candidates.find(f => f.includes('core/shared'));
      const preferred = coreShared || candidates[0];
      const toRemove = candidates.filter(file => file !== preferred);

      this.log(`🔄 ${fileName}:`);
      this.log(`   Keep: ${preferred}`);
      
      for (const file of toRemove) {
        // Check if it's actually redundant by comparing content
        if (await this.isContentSimilar(preferred, file)) {
          try {
            execSync(`Remove-Item "${file}" -Force`, { shell: 'powershell' });
            this.log(`   ❌ Removed: ${file}`);
            this.resolved++;
          } catch (e) {
            this.log(`   ⚠️  Failed to remove: ${file} - ${e.message}`);
            this.errors++;
          }
        } else {
          this.log(`   ⏭️  Skipped: ${file} (different content)`);
          this.skipped++;
        }
      }
    } catch (error) {
      this.log(`❌ Error processing ${fileName}: ${error.message}`);
      this.errors++;
    }
  }

  async isContentSimilar(file1, file2) {
    try {
      const content1 = fs.readFileSync(file1, 'utf8');
      const content2 = fs.readFileSync(file2, 'utf8');
      
      // Simple similarity check - remove whitespace and imports for comparison
      const normalize = (content) => content
        .replace(/import.*from.*[\'"]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      const similarity = normalize(content1) === normalize(content2);
      return similarity;
    } catch (e) {
      return false;
    }
  }

  async generateFinalReport() {
    const summary = `
## 📊 Batch Resolution Summary

- **Resolved:** ${this.resolved} files
- **Skipped:** ${this.skipped} files  
- **Errors:** ${this.errors} files
- **Total Processed:** ${this.resolved + this.skipped + this.errors} files

**Completion Rate:** ${((this.resolved / (this.resolved + this.skipped + this.errors)) * 100).toFixed(1)}%

---
**Completed:** ${new Date().toISOString()}
`;

    this.log(summary);
    
    // Update main progress tracker
    const newResolvedTotal = 12 + this.resolved; // Previous 12 + new resolutions
    const remaining = 151 - newResolvedTotal;
    
    console.log(`\n🎉 Batch processing complete!`);
    console.log(`Total resolved so far: ${newResolvedTotal}/151 (${((newResolvedTotal/151)*100).toFixed(1)}%)`);
    console.log(`Remaining duplicates: ${remaining}`);
  }

  async run() {
    this.log('🚀 Starting Batch Redundancy Resolution...\n');
    
    await this.resolveUIComponentDuplicates();
    await this.resolveTypeDuplicates();
    await this.generateFinalReport();
  }
}

// Run if called directly
if (require.main === module) {
  const resolver = new BatchRedundancyResolver();
  resolver.run().catch(console.error);
}

module.exports = BatchRedundancyResolver;
