import type {Metadata} from 'next';
import './globals.css';
import {sitePath} from '@/lib/paths';
export const metadata:Metadata={...(process.env.SITE_URL?{metadataBase:new URL(process.env.SITE_URL)}:{}),title:'Смена рядом — работа и подработка в вашем городе',description:'Найдите актуальные варианты работы и подработки с гибким графиком. Выберите город, сравните условия и перейдите к работодателю.',...(process.env.SITE_URL?{openGraph:{title:'Смена рядом — работа под твой график',images:[process.env.SITE_URL.replace(/\/$/,'')+'/og.png'],locale:'ru_RU',type:'website' as const}}:{}),icons:{icon:sitePath('/favicon.svg')}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
