#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

// Targeted API Management Duplicate Resolver
class APIManagementDuplicateResolver {
  constructor() {
    this.logFile = './file-organization/API_MANAGEMENT_RESOLUTION_LOG.md';
    fs.writeFileSync(this.logFile, `# API Management Duplicate Resolution\n\n**Started:** ${new Date().toISOString()}\n\n`);
  }

  log(message) {
    console.log(message);
    fs.appendFileSync(this.logFile, `${message}\n`);
  }

  async resolveAPIKeyDuplicates() {
    this.log('## 🔑 Resolving API Key Management Duplicates\n');
    
    const apiKeyFiles = [
      'api-key-create-form.tsx',
      'api-key-general-section.tsx', 
      'api-key-management-list-table.tsx',
      'api-key-management-sales-channels.tsx',
      'api-key-row-actions.tsx',
      'api-key-sales-channel-section.tsx',
      'api-key-sales-channels-form.tsx'
    ];

    for (const fileName of apiKeyFiles) {
      await this.resolveAPIKeyFile(fileName);
    }
  }

  async resolveAPIKeyFile(fileName) {
    try {
      // Find all instances
      const searchResult = execSync(`Get-ChildItem -Path "src" -Recurse -Name "${fileName}"`, 
        { encoding: 'utf8', shell: 'powershell' });
      
      const files = searchResult.trim().split('\n').filter(f => f.trim()).map(f => `src/${f.trim()}`);
      const existing = files.filter(f => fs.existsSync(f));

      if (existing.length < 2) {
        this.log(`✅ ${fileName} - No redundancy (${existing.length} file)`);
        return;
      }

      this.log(`🔍 Analyzing ${fileName} (${existing.length} files):`);
      
      // Analyze each file
      for (const file of existing) {
        const content = fs.readFileSync(file, 'utf8');
        const size = content.length;
        const hasSupabase = content.includes('supabase') || content.includes('createClientComponentClient');
        const hasModernImports = content.includes('@/') || content.includes('./');
        
        this.log(`   📁 ${file}`);
        this.log(`      Size: ${size} chars, Supabase: ${hasSupabase}, Modern: ${hasModernImports}`);
      }

      // Keep the one in store domain (likely the correct location for API management)
      const storeFile = existing.find(f => f.includes('/store/'));
      if (storeFile) {
        const toRemove = existing.filter(f => f !== storeFile);
        this.log(`   🎯 Keeping store version: ${storeFile}`);
        
        for (const file of toRemove) {
          try {
            execSync(`Remove-Item "${file}" -Force`, { shell: 'powershell' });
            this.log(`   ❌ Removed: ${file}`);
          } catch (e) {
            this.log(`   ⚠️  Failed to remove: ${file}`);
          }
        }
      } else {
        this.log(`   ⚠️  No store version found - manual review needed`);
      }

    } catch (error) {
      this.log(`❌ Error processing ${fileName}: ${error.message}`);
    }
  }

  async resolveCartDuplicates() {
    this.log('\n## 🛒 Resolving Cart-related Duplicates\n');
    
    const cartFiles = ['cart.ts', 'CartSidebar.tsx'];
    
    for (const fileName of cartFiles) {
      try {
        const searchResult = execSync(`Get-ChildItem -Path "src" -Recurse -Name "${fileName}"`, 
          { encoding: 'utf8', shell: 'powershell' });
        
        const files = searchResult.trim().split('\n').filter(f => f.trim()).map(f => `src/${f.trim()}`);
        const existing = files.filter(f => fs.existsSync(f));

        if (existing.length < 2) {
          this.log(`✅ ${fileName} - No redundancy`);
          continue;
        }

        // Prefer marketplace/ecommerce domain for cart functionality
        const preferred = existing.find(f => f.includes('/marketplace/') || f.includes('/ecommerce/')) || 
                         existing.find(f => f.includes('/domains/')) || 
                         existing[0];

        const toRemove = existing.filter(f => f !== preferred);
        
        this.log(`🔄 ${fileName}: Keep ${preferred}`);
        for (const file of toRemove) {
          try {
            execSync(`Remove-Item "${file}" -Force`, { shell: 'powershell' });
            this.log(`   ❌ Removed: ${file}`);
          } catch (e) {
            this.log(`   ⚠️  Failed to remove: ${file}`);
          }
        }
      } catch (error) {
        this.log(`❌ Error processing ${fileName}: ${error.message}`);
      }
    }
  }

  async run() {
    this.log('🚀 Starting API Management Duplicate Resolution...\n');
    
    await this.resolveAPIKeyDuplicates();
    await this.resolveCartDuplicates();
    
    this.log(`\n✅ API Management resolution complete!`);
    this.log(`**Finished:** ${new Date().toISOString()}`);
  }
}

// Run if called directly
if (require.main === module) {
  const resolver = new APIManagementDuplicateResolver();
  resolver.run().catch(console.error);
}

module.exports = APIManagementDuplicateResolver;
