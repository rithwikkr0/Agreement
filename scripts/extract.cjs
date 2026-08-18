const fs = require('fs');
const path = require('path');

const downloads = 'C:/Users/rithw/Downloads';
const files = fs.readdirSync(downloads).filter(f => f.startsWith('Covenant-') && f.endsWith('.pdf'));

console.log('Found PDF files:', files);

files.forEach(file => {
  const filePath = path.join(downloads, file);
  const buffer = fs.readFileSync(filePath);
  const str = buffer.toString('binary');
  
  // Find images in PDF
  const imgMatches = str.match(/\/Subtype\s*\/Image/g);
  console.log(`File: ${file}, Size: ${buffer.length} bytes, Images: ${imgMatches ? imgMatches.length : 0}`);
});
