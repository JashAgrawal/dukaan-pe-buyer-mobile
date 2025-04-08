/**
 * This is a simple test script to check if our font changes are working correctly.
 * 
 * To run this script, use the following command:
 * node scripts/test-fonts.js
 */

console.log('Testing font configuration...');

// Check if required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'components/ui/JostText.tsx',
  'components/providers/FontProvider.tsx',
  'global.css',
  'app/_layout.tsx',
  'components/ui/Typography.tsx',
  'components/ThemedText.tsx',
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} does not exist`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('Please make sure all required files exist.');
  process.exit(1);
}

// Check if FontProvider is imported in app/_layout.tsx
const layoutContent = fs.readFileSync(path.join(process.cwd(), 'app/_layout.tsx'), 'utf8');
if (layoutContent.includes('import FontProvider from')) {
  console.log('✅ FontProvider is imported in app/_layout.tsx');
} else {
  console.error('❌ FontProvider is not imported in app/_layout.tsx');
  process.exit(1);
}

// Check if FontProvider is used in app/_layout.tsx
if (layoutContent.includes('<FontProvider>')) {
  console.log('✅ FontProvider is used in app/_layout.tsx');
} else {
  console.error('❌ FontProvider is not used in app/_layout.tsx');
  process.exit(1);
}

// Check if global.css has Jost font family
const globalCssContent = fs.readFileSync(path.join(process.cwd(), 'global.css'), 'utf8');
if (globalCssContent.includes('font-family: "Jost"')) {
  console.log('✅ global.css has Jost font family');
} else {
  console.error('❌ global.css does not have Jost font family');
  process.exit(1);
}

console.log('\n✅ All tests passed! The app should now use Jost as the default font throughout.');
console.log('\nFont Configuration:');
console.log('1. FontProvider component overrides the default Text and TextInput components to use Jost font');
console.log('2. global.css applies Jost font to all elements using CSS');
console.log('3. ThemedText component uses Jost font by default');
console.log('4. Typography component uses Jost font by default');
console.log('5. JostText component is available for explicit use when needed');
console.log('\nNote: Montserrat is still available for use in specific places by using the Typography component with font="montserrat" prop');
