#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

// Ultra Final Push - Target Specific Patterns
class UltraFinalPush {
  constructor() {
    this.resolved = 0;
    this.logFile = './file-organization/ULTRA_FINAL_LOG.md';
    
    fs.writeFileSync(this.logFile, `# Ultra Final Push Log\n\n**Started:** ${new Date().toISOString()}\n\n`);
  }

  log(message) {
    console.log(message);
    fs.appendFileSync(this.logFile, `${message}\n`);
  }

  async resolvePatternMatches() {
    this.log('## 🎯 Resolving Specific File Patterns\n');
    
    // Target specific file patterns that are likely file vs folder duplicates
    const patterns = [
      { name: 'customer-group-list-table.tsx', prefer: 'folder' },
      { name: 'order-summary.tsx', prefer: 'largest' },
      { name: 'pricing-form.tsx', prefer: 'folder' },
      { name: 'product-form.tsx', prefer: 'folder' },
      { name: 'reservation-form.tsx', prefer: 'folder' },
      { name: 'return-form.tsx', prefer: 'folder' },
      { name: 'sales-channel-form.tsx', prefer: 'folder' },
      { name: 'shipping-form.tsx', prefer: 'folder' },
      { name: 'tax-form.tsx', prefer: 'folder' },
      { name: 'user-form.tsx', prefer: 'folder' },
      { name: 'workflow-form.tsx', prefer: 'folder' },
      { name: 'list-summary.tsx', prefer: 'largest' },
      { name: 'invite-user-form.tsx', prefer: 'folder' }
    ];

    for (const pattern of patterns) {
      await this.resolvePattern(pattern);
    }
  }

  async resolvePattern(pattern) {
    try {
      const searchResult = execSync(`Get-ChildItem -Path "src" -Recurse -Name "${pattern.name}" | Select-Object -First 5`, 
        { encoding: 'utf8', shell: 'powershell' });
      
      const files = searchResult.trim().split('\n').filter(f => f.trim()).map(f => `src/${f.trim()}`);
      const existing = files.filter(f => fs.existsSync(f));

      if (existing.length < 2) {
        return; // No duplicates
      }

      this.log(`🔍 ${pattern.name} (${existing.length} files):`);
      
      let toKeep;
      if (pattern.prefer === 'folder') {
        // Prefer files in organized folder structures
        toKeep = existing.find(f => {
          const parts = f.split('/');
          const folderName = parts[parts.length - 2];
          const fileBaseName = pattern.name.replace('.tsx', '').replace('.ts', '');
          return folderName.includes(fileBaseName) || f.includes(`/${fileBaseName}/`);
        }) || existing[0];
      } else if (pattern.prefer === 'largest') {
        // Prefer largest file
        const sizes = existing.map(f => ({ file: f, size: fs.readFileSync(f, 'utf8').length }));
        sizes.sort((a, b) => b.size - a.size);
        toKeep = sizes[0].file;
      }

      const toRemove = existing.filter(f => f !== toKeep);
      
      this.log(`   🎯 Keeping: ${toKeep}`);
      
      for (const file of toRemove) {
        try {
          execSync(`Remove-Item "${file}" -Force`, { shell: 'powershell' });
          this.log(`   ❌ Removed: ${file}`);
          this.resolved++;
        } catch (e) {
          this.log(`   ⚠️  Failed to remove: ${file}`);
        }
      }

    } catch (error) {
      if (!error.message.includes('No matching files were found')) {
        this.log(`❌ Error processing ${pattern.name}: ${error.message}`);
      }
    }
  }

  async resolveComponentFolderDuplicates() {
    this.log('\n## 🎯 Resolving Component Folder vs File Patterns\n');
    
    try {
      // Find all component files that might have folder equivalents
      const componentFiles = execSync(`Get-ChildItem -Path "src\\core\\shared\\components" -Name "*.tsx" | Where-Object { $_ -notlike "*\\*" }`, 
        { encoding: 'utf8', shell: 'powershell' });
      
      const files = componentFiles.trim().split('\n').filter(f => f.trim());
      
      for (const fileName of files.slice(0, 10)) { // Process first 10
        await this.checkForFolderEquivalent(fileName.trim());
      }
    } catch (error) {
      this.log(`Error finding component files: ${error.message}`);
    }
  }

  async checkForFolderEquivalent(fileName) {
    try {
      const baseName = fileName.replace('.tsx', '');
      const folderPath = `src/core/shared/components/${baseName}/${fileName}`;
      const filePath = `src/core/shared/components/${fileName}`;
      
      if (fs.existsSync(folderPath) && fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const folderContent = fs.readFileSync(folderPath, 'utf8');
        
        this.log(`🔍 ${fileName} - Found file vs folder duplicate:`);
        this.log(`   File: ${fileContent.length} chars`);
        this.log(`   Folder: ${folderContent.length} chars`);
        
        // Prefer folder structure for better organization
        try {
          execSync(`Remove-Item "${filePath}" -Force`, { shell: 'powershell' });
          this.log(`   ❌ Removed file version: ${filePath}`);
          this.resolved++;
        } catch (e) {
          this.log(`   ⚠️  Failed to remove: ${filePath}`);
        }
      }
    } catch (error) {
      // Ignore errors for non-existent files
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
    this.log('🚀 Starting Ultra Final Push - Maximum Resolution!\n');
    
    await this.resolvePatternMatches();
    await this.resolveComponentFolderDuplicates();
    
    const finalCount = await this.getFinalStats();
    
    this.log(`\n## 📊 Ultra Final Summary`);
    this.log(`- **Resolved:** ${this.resolved} files`);
    this.log(`- **Final Duplicate Count:** ${finalCount} files`);
    this.log(`**Completion:** ${new Date().toISOString()}`);
    
    console.log(`\n🏆 ULTRA FINAL PUSH COMPLETE!`);
    console.log(`Additional files resolved: ${this.resolved}`);
    console.log(`Final remaining duplicates: ${finalCount}`);
    
    return { resolved: this.resolved, remaining: finalCount };
  }
}

// Run if called directly
if (require.main === module) {
  const resolver = new UltraFinalPush();
  resolver.run().catch(console.error);
}

module.exports = UltraFinalPush;
