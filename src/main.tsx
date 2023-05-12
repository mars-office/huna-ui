import ReactDOM from 'react-dom/client'
import { FluentProvider, teamsDarkTheme } from '@fluentui/react-components';
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './routes';




ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <FluentProvider style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }} theme={teamsDarkTheme}>
    <RouterProvider router={router} />
  </FluentProvider>,
)
