const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('<GlobalVoiceBtn />')) {
    // Add import
    if (!content.includes('import GlobalVoiceBtn')) {
      content = "import GlobalVoiceBtn from '../components/GlobalVoiceBtn';\n" + content;
    }
    
    // Inyectarlo antes del primer <button className="btn ...
    // Asegurándonos de no reemplazar en todo el archivo sino solo el primero (que suele estar en el card-head)
    content = content.replace(/(<button[^>]*className="btn)/i, '<GlobalVoiceBtn />\n            $1');
    
    fs.writeFileSync(filePath, content);
    console.log('Updated', file);
  } else {
    console.log('Skipped', file);
  }
});
