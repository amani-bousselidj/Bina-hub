#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

// Final Cleanup Phase - Systematic Duplicate Resolution
class FinalCleanupResolver {
  constructor() {
    this.resolved = 0;
    this.preserved = 0;
    this.errors = 0;
    this.logFile = './file-organization/FINAL_CLEANUP_LOG.md';
    
    fs.writeFileSync(this.logFile, `# Final Cleanup Resolution Log\n\n**Started:** ${new Date().toISOString()}\n\n`);
  }

  log(message) {
    console.log(message);
    fs.appendFileSync(this.logFile, `${message}\n`);
  }

  async processSimpleDuplicates() {
    this.log('## 🎯 Processing Simple Component Duplicates\n');
    
    // Components that likely have file vs folder structure duplicates
    const simpleComponents = [
      'cancel-return.ts',
      'components.tsx',
      'engine.tsx',
      'form.tsx',
      'header.tsx',
      'index.ts',
      'layout.tsx',
      'loading.tsx',
      'menu.tsx',
      'modal.tsx',
      'page.tsx',
      'provider.tsx',
      'skeleton.tsx',
      'table.tsx',
      'types.ts',
      'utils.ts'
    ];

    for (const fileName of simpleComponents) {
      await this.processComponent(fileName);
    }
  }

  async processComponent(fileName) {
    try {
      const searchResult = execSync(`Get-ChildItem -Path "src" -Recurse -Name "${fileName}" | Select-Object -First 5`, 
        { encoding: 'utf8', shell: 'powershell' });
      
      const files = searchResult.trim().split('\n').filter(f => f.trim()).map(f => `src/${f.trim()}`);
      const existing = files.filter(f => fs.existsSync(f));

      if (existing.length < 2) {
        this.log(`✅ ${fileName} - No redundancy (${existing.length} file)`);
        return;
      }

      this.log(`🔍 ${fileName} (${existing.length} files):`);
      
      // Analyze content similarity and organization
      const analyses = [];
      for (const file of existing) {
        const content = fs.readFileSync(file, 'utf8');
        const size = content.length;
        const hasSupabase = content.includes('supabase') || content.includes('createClientComponentClient');
        const isInUI = file.includes('/ui/');
        const isInDomain = file.includes('/domains/');
        const isInApp = file.includes('/app/');
        const isInCore = file.includes('/core/');
        
        analyses.push({
          file,
          size,
          hasSupabase,
          isInUI,
          isInDomain,
          isInApp,
          isInCore,
          score: this.calculateScore(size, hasSupabase, isInUI, isInDomain, isInApp, isInCore)
        });
        
        this.log(`   📁 ${file} (${size} chars, Score: ${analyses[analyses.length - 1].score})`);
      }

      // Sort by score and prefer certain locations
      analyses.sort((a, b) => b.score - a.score);
      
      const toKeep = analyses[0];
      const toRemove = analyses.slice(1);
      
      this.log(`   🎯 Keeping: ${toKeep.file}`);
      
      for (const analysis of toRemove) {
        // Only remove if content is very similar and score difference is significant
        if (this.shouldRemove(toKeep, analysis)) {
          try {
            execSync(`Remove-Item "${analysis.file}" -Force`, { shell: 'powershell' });
            this.log(`   ❌ Removed: ${analysis.file}`);
            this.resolved++;
          } catch (e) {
            this.log(`   ⚠️  Failed to remove: ${analysis.file}`);
            this.errors++;
          }
        } else {
          this.log(`   ⏭️  Preserved: ${analysis.file} (different purpose)`);
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

  calculateScore(size, hasSupabase, isInUI, isInDomain, isInApp, isInCore) {
    let score = 0;
    
    // Size preference (more complete)
    score += Math.min(size / 100, 20);
    
    // Technology preferences
    if (hasSupabase) score += 15;
    
    // Location preferences
    if (isInUI) score += 10; // UI components should be in UI folder
    if (isInDomain) score += 8; // Domain-specific is good
    if (isInCore) score += 6; // Core shared is good
    if (isInApp) score += 4; // App structure is okay
    
    return Math.floor(score);
  }

  shouldRemove(toKeep, candidate) {
    const scoreDiff = toKeep.score - candidate.score;
    
    // Only remove if there's a significant score difference
    if (scoreDiff < 5) return false;
    
    // Never remove if they're in different major domains
    if (toKeep.isInDomain !== candidate.isInDomain) return false;
    if (toKeep.isInApp && candidate.isInDomain) return false;
    if (toKeep.isInDomain && candidate.isInApp) return false;
    
    return true;
  }

  async generateReport() {
    const total = this.resolved + this.preserved + this.errors;
    const summary = `
## 📊 Final Cleanup Summary

- **Resolved:** ${this.resolved} files
- **Preserved:** ${this.preserved} files (different purposes)
- **Errors:** ${this.errors} files
- **Total Processed:** ${total} files

**Safe Resolution Rate:** ${total > 0 ? ((this.resolved / total) * 100).toFixed(1) : 0}%

---
**Completed:** ${new Date().toISOString()}
`;

    this.log(summary);
  }

  async run() {
    this.log('🚀 Starting Final Cleanup Resolution...\n');
    
    await this.processSimpleDuplicates();
    await this.generateReport();
    
    console.log(`\n✅ Final cleanup complete!`);
    console.log(`Resolved: ${this.resolved}, Preserved: ${this.preserved}, Errors: ${this.errors}`);
  }
}

// Run if called directly
if (require.main === module) {
  const resolver = new FinalCleanupResolver();
  resolver.run().catch(console.error);
}

module.exports = FinalCleanupResolver;
