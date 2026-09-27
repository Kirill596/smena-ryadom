import {rm,rename,writeFile} from 'node:fs/promises';
await rm('docs',{recursive:true,force:true}); await rename('out','docs');
await writeFile('docs/.nojekyll','');
console.log('Готово: папка docs. Загрузите её в GitHub; Pages → main /docs.');
