import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
import { AuthProvider } from './context/AuthContext';

// Configure Amplify
try {
  Amplify.configure(awsmobile);
} catch (error) {
  console.warn("Failed to configure AWS Amplify. Running with Mock Auth.");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
