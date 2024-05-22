import './styles.scss';
import ReactDOM from 'react-dom/client';
import './i18n';
import enableAuthInterceptor from './services/auth.interceptor';
import Root from './Root';


enableAuthInterceptor();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Root />,
);
