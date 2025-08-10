#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

// Final Push - File vs Folder Structure Resolution
class FinalPushResolver {
  constructor() {
    this.resolved = 0;
    this.logFile = './file-organization/FINAL_PUSH_LOG.md';
    
    fs.writeFileSync(this.logFile, `# Final Push Resolution Log\n\n**Started:** ${new Date().toISOString()}\n\n`);
  }

  log(message) {
    console.log(message);
    fs.appendFileSync(this.logFile, `${message}\n`);
  }

  async resolveFileVsFolderStructures() {
    this.log('## 🎯 Resolving File vs Folder Structure Duplicates\n');
    
    // Common patterns where we have both file.tsx and folder/file.tsx
    const fileVsFolderCandidates = [
      'data-table-skeleton.tsx',
      'edit-api-key-form.tsx',
      'edit-sales-channels-form.tsx',
      'invite-user-form.tsx',
      'list-summary.tsx',
      'order-summary.tsx',
      'pricing-form.tsx',
      'product-form.tsx',
      'reservation-form.tsx',
      'return-form.tsx',
      'sales-channel-form.tsx',
      'search-form.tsx',
      'settings-form.tsx',
      'shipping-form.tsx',
      'store-form.tsx',
      'tax-form.tsx',
      'user-form.tsx',
      'workflow-form.tsx'
    ];

    for (const fileName of fileVsFolderCandidates) {
      await this.resolveFileVsFolder(fileName);
    }
  }

  async resolveFileVsFolder(fileName) {
    try {
      const searchResult = execSync(`Get-ChildItem -Path "src" -Recurse -Name "${fileName}" | Select-Object -First 5`, 
        { encoding: 'utf8', shell: 'powershell' });
      
      const files = searchResult.trim().split('\n').filter(f => f.trim()).map(f => `src/${f.trim()}`);
      const existing = files.filter(f => fs.existsSync(f));

      if (existing.length < 2) {
        return; // No duplicates
      }

      this.log(`🔍 ${fileName} (${existing.length} files):`);
      
      // Prefer folder structure over file structure
      const folderVersion = existing.find(f => {
        const parts = f.split('/');
        const folderName = parts[parts.length - 2]; // Second to last part
        const fileBaseName = fileName.replace('.tsx', '').replace('.ts', '');
        return folderName === fileBaseName || folderName.includes(fileBaseName);
      });

      if (folderVersion) {
        const toRemove = existing.filter(f => f !== folderVersion);
        this.log(`   🎯 Keeping folder structure: ${folderVersion}`);
        
        for (const file of toRemove) {
          try {
            execSync(`Remove-Item "${file}" -Force`, { shell: 'powershell' });
            this.log(`   ❌ Removed: ${file}`);
            this.resolved++;
          } catch (e) {
            this.log(`   ⚠️  Failed to remove: ${file}`);
          }
        }
      } else {
        // Keep the most complete one
        const analyses = existing.map(file => {
          const content = fs.readFileSync(file, 'utf8');
          return { file, size: content.length };
        });
        
        analyses.sort((a, b) => b.size - a.size);
        const toKeep = analyses[0];
        const toRemove = analyses.slice(1);
        
        this.log(`   🎯 Keeping largest: ${toKeep.file} (${toKeep.size} chars)`);
        
        for (const analysis of toRemove) {
          try {
            execSync(`Remove-Item "${analysis.file}" -Force`, { shell: 'powershell' });
            this.log(`   ❌ Removed: ${analysis.file}`);
            this.resolved++;
          } catch (e) {
            this.log(`   ⚠️  Failed to remove: ${analysis.file}`);
          }
        }
      }

    } catch (error) {
      if (!error.message.includes('No matching files were found')) {
        this.log(`❌ Error processing ${fileName}: ${error.message}`);
      }
    }
  }

  async getFinalStats() {
    try {
      const result = execSync(`Get-ChildItem -Path "src" -Recurse | Where-Object { -not $_.PSIsContainer } | Group-Object Name | Where-Object { $_.Count -gt 1 } | Measure-Object`, 
        { encoding: 'utf8', shell: 'powershell' });
      
      const match = result.match(/Count\s+:\s+(\d+)/);
      return match ? parseInt(match[1]) : 0;
    } catch (e) {
      return 0;
    }
  }

  async run() {
    this.log('🚀 Starting Final Push Resolution...\n');
    
    await this.resolveFileVsFolderStructures();
    
    const remainingDuplicates = await this.getFinalStats();
    
    this.log(`\n## 📊 Final Push Summary`);
    this.log(`- **Resolved:** ${this.resolved} files`);
    this.log(`- **Remaining Duplicates:** ${remainingDuplicates} files`);
    this.log(`**Completion:** ${new Date().toISOString()}`);
    
    console.log(`\n✅ Final push complete!`);
    console.log(`Resolved: ${this.resolved} files`);
    console.log(`Remaining duplicates: ${remainingDuplicates}`);
    
    return { resolved: this.resolved, remaining: remainingDuplicates };
  }
}

// Run if called directly
if (require.main === module) {
  const resolver = new FinalPushResolver();
  resolver.run().catch(console.error);
}

module.exports = FinalPushResolver;
