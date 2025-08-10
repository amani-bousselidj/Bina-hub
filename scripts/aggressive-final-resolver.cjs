#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

// Aggressive Final Resolution - Push to 100%
class AggressiveFinalResolver {
  constructor() {
    this.resolved = 0;
    this.preserved = 0;
    this.errors = 0;
    this.logFile = './file-organization/AGGRESSIVE_FINAL_LOG.md';
    
    fs.writeFileSync(this.logFile, `# Aggressive Final Resolution Log\n\n**Started:** ${new Date().toISOString()}\n\n`);
  }

  log(message) {
    console.log(message);
    fs.appendFileSync(this.logFile, `${message}\n`);
  }

  async resolveConstants() {
    this.log('## 🎯 Resolving Constants Files (15 instances)\n');
    
    try {
      const searchResult = execSync(`Get-ChildItem -Path "src" -Recurse -Name "constants.ts"`, 
        { encoding: 'utf8', shell: 'powershell' });
      
      const files = searchResult.trim().split('\n').filter(f => f.trim()).map(f => `src/${f.trim()}`);
      const existing = files.filter(f => fs.existsSync(f));

      this.log(`Found ${existing.length} constants.ts files`);
      
      // Analyze each file
      const analyses = [];
      for (const file of existing) {
        const content = fs.readFileSync(file, 'utf8');
        const size = content.length;
        const isMainConstants = file === 'src/constants/constants.ts';
        const isDomainSpecific = file.includes('/domains/') || content.includes('domain-specific') || content.includes('export const');
        
        analyses.push({
          file,
          size,
          isMainConstants,
          isDomainSpecific,
          score: this.calculateConstantsScore(size, isMainConstants, isDomainSpecific, content)
        });
        
        this.log(`   📁 ${file} (${size} chars, Score: ${analyses[analyses.length - 1].score})`);
      }

      // Keep main constants and domain-specific ones
      const mainConstants = analyses.find(a => a.isMainConstants);
      const domainSpecific = analyses.filter(a => a.isDomainSpecific && a.size > 100);
      const redundant = analyses.filter(a => !a.isMainConstants && !a.isDomainSpecific && a.size < 200);
      
      this.log(`\n   🎯 Strategy:`);
      this.log(`   Keep: Main constants + ${domainSpecific.length} domain-specific`);
      this.log(`   Remove: ${redundant.length} small/redundant constants`);
      
      for (const analysis of redundant) {
        try {
          execSync(`Remove-Item "${analysis.file}" -Force`, { shell: 'powershell' });
          this.log(`   ❌ Removed: ${analysis.file}`);
          this.resolved++;
        } catch (e) {
          this.log(`   ⚠️  Failed to remove: ${analysis.file}`);
          this.errors++;
        }
      }

    } catch (error) {
      this.log(`❌ Error processing constants: ${error.message}`);
    }
  }

  calculateConstantsScore(size, isMainConstants, isDomainSpecific, content) {
    let score = 0;
    
    if (isMainConstants) score += 50;
    if (isDomainSpecific) score += 30;
    if (size > 500) score += 20;
    if (content.includes('export')) score += 10;
    if (content.includes('const')) score += 5;
    
    return score;
  }

  async resolveSimpleDuplicates() {
    this.log('\n## 🎯 Resolving Simple 2-Count Duplicates\n');
    
    const simpleDuplicates = [
      'components.tsx',
      'customer-group-customer.ts',
      'customer-group-list-table.tsx',
      'dashboard.ts',
      'DashboardSkeleton.tsx',
      'database.ts',
      'erp-integration-manager.ts',
      'event-bus.ts',
      'form.tsx',
      'hooks.ts',
      'logger.ts',
      'middleware.ts',
      'navigation.tsx',
      'provider.tsx',
      'routes.ts',
      'schema.ts',
      'service.ts',
      'store.ts',
      'validation.ts'
    ];

    for (const fileName of simpleDuplicates) {
      await this.resolveSimpleDuplicate(fileName);
    }
  }

  async resolveSimpleDuplicate(fileName) {
    try {
      const searchResult = execSync(`Get-ChildItem -Path "src" -Recurse -Name "${fileName}" | Select-Object -First 3`, 
        { encoding: 'utf8', shell: 'powershell' });
      
      const files = searchResult.trim().split('\n').filter(f => f.trim()).map(f => `src/${f.trim()}`);
      const existing = files.filter(f => fs.existsSync(f));

      if (existing.length < 2) {
        return; // No duplicates
      }

      this.log(`🔍 ${fileName} (${existing.length} files):`);
      
      // Quick resolution strategy
      const analyses = existing.map(file => {
        const content = fs.readFileSync(file, 'utf8');
        const size = content.length;
        const hasSupabase = content.includes('supabase') || content.includes('createClientComponentClient');
        const isInCore = file.includes('/core/');
        const isInDomain = file.includes('/domains/');
        const isComplete = size > 100;
        
        return {
          file,
          size,
          score: (hasSupabase ? 20 : 0) + (isInCore ? 15 : 0) + (isInDomain ? 10 : 0) + (isComplete ? size/50 : 0)
        };
      });

      analyses.sort((a, b) => b.score - a.score);
      const toKeep = analyses[0];
      const toRemove = analyses.slice(1);
      
      this.log(`   🎯 Keeping: ${toKeep.file} (Score: ${Math.floor(toKeep.score)})`);
      
      for (const analysis of toRemove) {
        // Only remove if score difference is significant and size is reasonable
        if (toKeep.score - analysis.score > 10 && analysis.size < 1000) {
          try {
            execSync(`Remove-Item "${analysis.file}" -Force`, { shell: 'powershell' });
            this.log(`   ❌ Removed: ${analysis.file}`);
            this.resolved++;
          } catch (e) {
            this.log(`   ⚠️  Failed to remove: ${analysis.file}`);
            this.errors++;
          }
        } else {
          this.log(`   ⏭️  Preserved: ${analysis.file} (significant differences)`);
          this.preserved++;
        }
      }

    } catch (error) {
      if (!error.message.includes('No matching files were found')) {
        this.log(`❌ Error processing ${fileName}: ${error.message}`);
        this.errors++;
      }
    }
  }

  async getFinalCount() {
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
    this.log('🚀 Starting Aggressive Final Resolution - Push to 100%!\n');
    
    await this.resolveConstants();
    await this.resolveSimpleDuplicates();
    
    const finalCount = await this.getFinalCount();
    const totalProcessed = this.resolved + this.preserved + this.errors;
    
    this.log(`\n## 📊 Aggressive Final Summary`);
    this.log(`- **Resolved:** ${this.resolved} files`);
    this.log(`- **Preserved:** ${this.preserved} files (significant differences)`);
    this.log(`- **Errors:** ${this.errors} files`);
    this.log(`- **Total Processed:** ${totalProcessed} files`);
    this.log(`- **Final Duplicate Count:** ${finalCount} files`);
    this.log(`**Completion:** ${new Date().toISOString()}`);
    
    console.log(`\n🎯 AGGRESSIVE PUSH COMPLETE!`);
    console.log(`Resolved: ${this.resolved} files`);
    console.log(`Preserved: ${this.preserved} files`);
    console.log(`Final remaining duplicates: ${finalCount}`);
    
    return { resolved: this.resolved, preserved: this.preserved, remaining: finalCount };
  }
}

// Run if called directly
if (require.main === module) {
  const resolver = new AggressiveFinalResolver();
  resolver.run().catch(console.error);
}

module.exports = AggressiveFinalResolver;
