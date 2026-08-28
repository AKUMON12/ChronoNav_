const fs = require('fs');

function extractAllFloorLandmarks(filePath) {
  const svgStr = fs.readFileSync(filePath, 'utf8');
  const textRegex = /<text[^>]*transform="matrix\(([^)]+)\)"[^>]*>([\s\S]*?)<\/text>/g;
  let m;
  const list = [];
  while ((m = textRegex.exec(svgStr)) !== null) {
    const mat = m[1].trim().split(/\s+/).map(Number);
    const [a, b, c, d, e, f] = mat;
    const rawText = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const tspanXMatch = m[2].match(/x="([^"]+)"/);
    const tspanYMatch = m[2].match(/y="([^"]+)"/);
    if (tspanXMatch && tspanYMatch) {
      const firstX = parseFloat(tspanXMatch[1].trim().split(/\s+/)[0]);
      const firstY = parseFloat(tspanYMatch[1].trim().split(/\s+/)[0]);
      const finalX = a * firstX + c * firstY + e;
      const finalY = b * firstX + d * firstY + f;
      list.push({ text: rawText, x: Math.round(finalX), y: Math.round(finalY) });
    }
  }
  return list;
}

const floors = [
  { id: 1, name: 'Ground', file: 'public/campus/svg/floor-1-ground.svg' },
  { id: 'M', name: 'Mezzanine', file: 'public/campus/svg/floor-mezzanine.svg' },
  { id: 2, name: '2nd Floor', file: 'public/campus/svg/floor-2.svg' },
  { id: 3, name: '3rd Floor', file: 'public/campus/svg/floor-3.svg' },
  { id: 4, name: '4th Floor', file: 'public/campus/svg/floor-4.svg' },
  { id: 5, name: '5th Floor', file: 'public/campus/svg/floor-5.svg' },
  { id: 6, name: '6th Floor', file: 'public/campus/svg/floor-6.svg' },
  { id: 7, name: '7th Floor', file: 'public/campus/svg/floor-7-roofdeck.svg' }
];

const verticalNodes = {};

floors.forEach(f => {
  const landmarks = extractAllFloorLandmarks(f.file);
  const stairs = landmarks.filter(l => l.text.includes('UP') || l.text.includes('DN') || l.text.includes('U P') || l.text.includes('D N'));
  const elevators = landmarks.filter(l => l.text.includes('ELEV') || l.text.includes('E LE V'));
  const corridors = landmarks.filter(l => l.text.includes('CORRIDOR') || l.text.includes('C O R R I D O R'));
  
  console.log(`\nFloor ${f.id} (${f.name}):`);
  console.log('  Elevators:', elevators);
  console.log('  Stairs sample:', stairs.slice(0, 4));
  console.log('  Corridors:', corridors);
});
