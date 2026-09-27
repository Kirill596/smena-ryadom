// Имя репозитория меняется через BASE_PATH при сборке.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export function sitePath(path:string):string {
 if(!path.startsWith('/') || path.startsWith('//')) return path;
 const index = path.search(/[?#]/);
 const pathname = index < 0 ? path : path.slice(0,index);
 const suffix = index < 0 ? '' : path.slice(index);
 const route = pathname === '/' || /\.[a-z0-9]+$/i.test(pathname) || pathname.endsWith('/') ? pathname : pathname + '/';
 return BASE_PATH + route + suffix;
}
