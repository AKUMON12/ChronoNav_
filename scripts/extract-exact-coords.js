const fs = require('fs');

function extractFloorTexts(filePath) {
  const svgStr = fs.readFileSync(filePath, 'utf8');
  const textRegex = /<text[^>]*transform="matrix\(([^)]+)\)"[^>]*>([\s\S]*?)<\/text>/g;
  let m;
  const list = [];
  while ((m = textRegex.exec(svgStr)) !== null) {
    const mat = m[1].trim().split(/\s+/).map(Number);
    const [a, b, c, d, e, f] = mat;
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const tspanXMatch = m[2].match(/x="([^"]+)"/);
    const tspanYMatch = m[2].match(/y="([^"]+)"/);
    if (tspanXMatch && tspanYMatch) {
      const firstX = parseFloat(tspanXMatch[1].trim().split(/\s+/)[0]);
      const firstY = parseFloat(tspanYMatch[1].trim().split(/\s+/)[0]);
      const finalX = a * firstX + c * firstY + e;
      const finalY = b * firstX + d * firstY + f;
      list.push({ text, x: Math.round(finalX), y: Math.round(finalY) });
    }
  }
  return list;
}

const files = [
  'public/campus/svg/floor-1-ground.svg',
  'public/campus/svg/floor-mezzanine.svg',
  'public/campus/svg/floor-2.svg',
  'public/campus/svg/floor-3.svg',
  'public/campus/svg/floor-4.svg',
  'public/campus/svg/floor-5.svg',
  'public/campus/svg/floor-6.svg',
  'public/campus/svg/floor-7-roofdeck.svg'
];

files.forEach(f => {
  const landmarks = extractFloorTexts(f).filter(l => l.text.length > 2 && !l.text.includes('00') && !l.text.includes('1:350') && !l.text.includes('1:300'));
  console.log(`\n================== ${f} (${landmarks.length} landmarks) ==================`);
  landmarks.slice(0, 20).forEach(l => {
    console.log(`  [x: ${l.x}, y: ${l.y}] -> ${l.text}`);
  });
});
