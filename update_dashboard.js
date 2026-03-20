const fs = require('fs');
const path = 'app/(dashboard)/dashboard/page.tsx';

let content = fs.readFileSync(path, 'utf8');

// Replace main container background rules
content = content.replace('bg-[#F8F9FA]', 'bg-[#0A0A0A]');
// Replace text color
content = content.replace(/text-\[#1A1A1A\]/g, 'text-white/90');
// Replace white backgrounds with glass
content = content.replace(/bg-white/g, 'bg-white/5');
// Replace borders
content = content.replace(/border-\[#1A1A1A\]\/5/g, 'border-white/10');
// Replace the solid dark blocks that are now confusing
content = content.replace(/bg-\[#1A1A1A\]/g, 'bg-black/60');
// The hover border colors
content = content.replace(/hover:border-\[#1A1A1A\]/g, 'hover:border-white/30');

// Replace brutalist drop shadows with glowing HUD shadows
content = content.replace(/shadow-\[0_30px_80px_-20px_rgba\(0,0,0,0.1\)\]/g, 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]');

fs.writeFileSync(path, content, 'utf8');
console.log('Updated app/(dashboard)/dashboard/page.tsx for dark mode glassmorphism.');
