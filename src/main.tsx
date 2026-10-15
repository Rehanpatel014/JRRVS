import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { RootErrorBoundary } from './components/RootErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);

(window as any).__APP_MOUNTED__ = true;


