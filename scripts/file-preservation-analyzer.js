#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// File Preservation Decision Matrix implementation
class FilePreservationAnalyzer {
  constructor() {
    this.weights = {
      age: 3,
      usageCount: 3,
      completeness: 3,
      supabaseIntegration: 3,
      testCoverage: 2,
      codeQuality: 2,
      documentation: 1
    };
  }

  async analyzeFile(filePath) {
    const analysis = {
      filePath,
      age: 0,
      usageCount: 0,
      completeness: 0,
      supabaseIntegration: 0,
      testCoverage: 0,
      codeQuality: 0,
      documentation: 0,
      preservationScore: 0
    };

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return analysis;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      
      // Age Analysis (based on git history)
      try {
        const gitAge = execSync(`git log --follow --format="%ad" --date=unix "${filePath}" | tail -1`, { encoding: 'utf8' }).trim();
        if (gitAge) {
          const ageInDays = (Date.now() - parseInt(gitAge) * 1000) / (1000 * 60 * 60 * 24);
          analysis.age = Math.min(10, Math.floor(ageInDays / 30)); // Score 0-10 based on months old
        }
      } catch (e) {
        analysis.age = 5; // Default if git history unavailable
      }

      // Usage Count Analysis
      try {
        const fileName = path.basename(filePath, path.extname(filePath));
        const usageResult = execSync(`grep -r --include="*.tsx" --include="*.ts" "import.*${fileName}" src`, { encoding: 'utf8' });
        const usageCount = usageResult.split('\n').filter(line => line.trim() && !line.includes(filePath)).length;
        analysis.usageCount = Math.min(10, usageCount);
      } catch (e) {
        analysis.usageCount = 0;
      }

      // Completeness Analysis (line count, function count)
      const lines = content.split('\n').length;
      const functions = (content.match(/function|const.*=.*\(/g) || []).length;
      const exports = (content.match(/export/g) || []).length;
      analysis.completeness = Math.min(10, Math.floor((lines + functions * 5 + exports * 2) / 20));

      // Supabase Integration Analysis
      if (content.includes('supabase') || content.includes('createClientComponentClient')) {
        analysis.supabaseIntegration = 10;
      } else if (content.includes('fetch') || content.includes('axios')) {
        analysis.supabaseIntegration = 5;
      } else {
        analysis.supabaseIntegration = 0;
      }

      // Test Coverage Analysis
      const testFileName = filePath.replace(/\.(tsx?|jsx?)$/, '.test.$1');
      const specFileName = filePath.replace(/\.(tsx?|jsx?)$/, '.spec.$1');
      if (fs.existsSync(testFileName) || fs.existsSync(specFileName)) {
        analysis.testCoverage = 10;
      } else if (content.includes('test') || content.includes('describe')) {
        analysis.testCoverage = 5;
      }

      // Code Quality Analysis (basic metrics)
      const hasTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
      const hasComments = content.includes('//') || content.includes('/*');
      const hasInterfaces = content.includes('interface') || content.includes('type ');
      const hasErrorHandling = content.includes('try') || content.includes('catch') || content.includes('error');
      
      analysis.codeQuality = (hasTypeScript ? 3 : 0) + (hasComments ? 2 : 0) + 
                            (hasInterfaces ? 2 : 0) + (hasErrorHandling ? 3 : 0);

      // Documentation Analysis
      const hasJSDoc = content.includes('/**');
      const hasReadme = fs.existsSync(path.join(path.dirname(filePath), 'README.md'));
      analysis.documentation = (hasJSDoc ? 5 : 0) + (hasReadme ? 5 : 0);

      // Calculate Preservation Score
      analysis.preservationScore = 
        (analysis.age * this.weights.age) +
        (analysis.usageCount * this.weights.usageCount) +
        (analysis.completeness * this.weights.completeness) +
        (analysis.supabaseIntegration * this.weights.supabaseIntegration) +
        (analysis.testCoverage * this.weights.testCoverage) +
        (analysis.codeQuality * this.weights.codeQuality) +
        (analysis.documentation * this.weights.documentation);

    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error.message);
    }

    return analysis;
  }

  async compareDuplicateFiles(filePaths) {
    const analyses = [];
    
    for (const filePath of filePaths) {
      const analysis = await this.analyzeFile(filePath);
      analyses.push(analysis);
    }

    // Sort by preservation score (highest first)
    analyses.sort((a, b) => b.preservationScore - a.preservationScore);

    return {
      recommended: analyses[0],
      alternatives: analyses.slice(1),
      comparison: analyses
    };
  }

  generateReport(comparison, filename) {
    let report = `# File Preservation Analysis: ${filename}\n\n`;
    report += `**Analysis Date:** ${new Date().toISOString()}\n\n`;
    
    report += `## Recommended File to Keep\n`;
    report += `**File:** \`${comparison.recommended.filePath}\`\n`;
    report += `**Preservation Score:** ${comparison.recommended.preservationScore}\n\n`;
    
    report += `### Score Breakdown:\n`;
    report += `- Age: ${comparison.recommended.age} (weight: ${this.weights.age})\n`;
    report += `- Usage Count: ${comparison.recommended.usageCount} (weight: ${this.weights.usageCount})\n`;
    report += `- Completeness: ${comparison.recommended.completeness} (weight: ${this.weights.completeness})\n`;
    report += `- Supabase Integration: ${comparison.recommended.supabaseIntegration} (weight: ${this.weights.supabaseIntegration})\n`;
    report += `- Test Coverage: ${comparison.recommended.testCoverage} (weight: ${this.weights.testCoverage})\n`;
    report += `- Code Quality: ${comparison.recommended.codeQuality} (weight: ${this.weights.codeQuality})\n`;
    report += `- Documentation: ${comparison.recommended.documentation} (weight: ${this.weights.documentation})\n\n`;

    if (comparison.alternatives.length > 0) {
      report += `## Alternative Files (Lower Scores)\n\n`;
      comparison.alternatives.forEach((alt, index) => {
        report += `### Alternative ${index + 1}\n`;
        report += `**File:** \`${alt.filePath}\`\n`;
        report += `**Score:** ${alt.preservationScore}\n`;
        report += `**Recommendation:** ${alt.preservationScore < comparison.recommended.preservationScore * 0.8 ? 'REMOVE' : 'REVIEW MANUALLY'}\n\n`;
      });
    }

    return report;
  }
}

module.exports = FilePreservationAnalyzer;

// CLI usage
if (require.main === module) {
  const analyzer = new FilePreservationAnalyzer();
  
  // Example usage for address.ts duplicates
  const addressFiles = [
    'src/core/shared/types/address.ts',
    'src/domains/marketplace/services/address.ts'
  ];

  analyzer.compareDuplicateFiles(addressFiles).then(result => {
    const report = analyzer.generateReport(result, 'address.ts');
    
    console.log(report);
    
    // Save report
    fs.writeFileSync('./redundancy-analysis/address-preservation-analysis.md', report);
    console.log('\nAnalysis saved to: ./redundancy-analysis/address-preservation-analysis.md');
  }).catch(console.error);
}
