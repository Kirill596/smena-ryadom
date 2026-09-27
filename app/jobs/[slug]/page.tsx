import {JobDetail} from '@/components/site/site';
import {jobs} from '@/data/jobs';
import {notFound} from 'next/navigation';
export const metadata={title:'Работа курьером в Самокате — Смена рядом',description:'Требования, выбор города и условия предложения партнёра. Независимый информационный сервис.'};
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!jobs.some(j=>j.id===slug&&j.active))notFound();return <JobDetail jobId={slug}/>}

export function generateStaticParams(){return jobs.filter(j=>j.active).map(j=>({slug:j.id}))}
