export const dynamic='force-static';
export default function robots(){const origin=process.env.SITE_URL?.replace(/\/$/,'');return {rules:{userAgent:'*',allow:'/'},...(origin?{sitemap:origin+'/sitemap.xml'}:{})}}
