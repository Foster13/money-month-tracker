// File: verify-build.js
// Quick verification script to check if all files exist

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'tailwind.config.ts',
  'next.config.js',
  'postcss.config.js',
  '.eslintrc.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'src/types/index.ts',
  'src/lib/utils.ts',
  'src/lib/schemas.ts',
  'src/stores/transactionStore.ts',
  'src/stores/simulationStore.ts',
  'src/components/Dashboard.tsx',
  'src/components/TransactionForm.tsx',
  'src/components/TransactionList.tsx',
  'src/components/Summary.tsx',
  'src/components/CategoryManager.tsx',
  'src/components/DataControls.tsx',
  'src/components/FinanceChart.tsx',
  'src/components/SimulationMode.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/form.tsx',
  'src/components/ui/input.tsx',
  'src/components/ui/label.tsx',
  'src/components/ui/select.tsx',
  'src/components/ui/table.tsx',
  'src/components/ui/tabs.tsx',
  'src/components/ui/toast.tsx',
  'src/components/ui/toaster.tsx',
  'src/hooks/use-toast.ts',
];

console.log('🔍 Verifying project files...\n');

let allFilesExist = true;
let missingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
    missingFiles.push(file);
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('✅ All required files are present!');
  console.log('\nNext steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run dev');
  console.log('3. Open: http://localhost:3000');
} else {
  console.log('❌ Missing files detected:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  process.exit(1);
}
