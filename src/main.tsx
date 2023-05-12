import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { FluentProvider, teamsDarkTheme } from '@fluentui/react-components';
import './styles.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <FluentProvider theme={teamsDarkTheme}>
    <App />
  </FluentProvider>,
)
