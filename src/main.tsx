import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { WishlistProvider } from "./contexts/WishlistContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  </BrowserRouter>
);
