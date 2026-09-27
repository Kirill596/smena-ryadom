import {sitePath} from '@/lib/paths';
import {Header,Footer} from '@/components/site/site';
export default function NotFound(){return <><Header/><main className="legal wrap"><p>404</p><h1>Страница не найдена</h1><p className="muted">Возможно, предложение больше недоступно. Посмотрите другие варианты.</p><a className="button" style={{marginTop:25}} href={sitePath('/')}>Посмотреть вакансии</a></main><Footer/></>}
