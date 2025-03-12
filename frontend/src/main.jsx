import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@material-tailwind/react";
import './styles.css' 
import {NextUIProvider} from "@nextui-org/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ThemeProvider>
     <NextUIProvider>
      <main className="dark text-foreground bg-background">
        <App />
      </main>
    </NextUIProvider>
    </ThemeProvider>
  </StrictMode>
)