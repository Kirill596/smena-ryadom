import {cities} from '@/data/cities';
import {Home} from '@/components/site/site';
import {notFound} from 'next/navigation';
export function generateStaticParams(){return cities.filter(c=>c.active).map(c=>({slug:c.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=cities.find(c=>c.slug===slug&&c.active);return c?{title:`Работа и подработка в ${c.locative} — Смена рядом`,description:`Варианты работы и подработки в ${c.locative}. Гибкий график, варианты без опыта и прямой переход к работодателю.`,...(process.env.SITE_URL ? {alternates:{canonical:process.env.SITE_URL.replace(/\/$/,'')+`/city/${slug}/`}} : {})}:{title:'Город не найден'}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=cities.find(c=>c.slug===slug&&c.active);if(!c)notFound();return <Home cityId={c.id}/>}
