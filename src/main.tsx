import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { RoleProvider } from './context/RoleContext';
import { ChatbotProvider } from './context/ChatbotContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoleProvider>
      <ChatbotProvider>
        <App />
      </ChatbotProvider>
    </RoleProvider>
  </StrictMode>,
);
