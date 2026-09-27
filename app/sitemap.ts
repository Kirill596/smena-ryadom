import {cities} from '@/data/cities';
import {jobs} from '@/data/jobs';
export const dynamic='force-static';
export default function sitemap(){const origin=process.env.SITE_URL?.replace(/\/$/,'');if(!origin)return [];return ['','/privacy','/terms','/partners',...cities.filter(c=>c.active).map(c=>'/city/'+c.slug),...jobs.filter(j=>j.active).map(j=>'/jobs/'+j.id)].map(path=>({url:origin+path+'/'}))}
