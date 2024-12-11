import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext.jsx'; // Fixed the import

createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
      <AppContextProvider> {/* Uncomment this only if you want to use the AppContextProvider */}
        <App />
      </AppContextProvider>
    </BrowserRouter>

);
