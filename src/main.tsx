import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { AdminPage } from './pages/AdminPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Customer Facing Web Storefront */}
        <Route path="/" element={<App />} />

        {/* Dedicated Owner & Management Admin Portal */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Catch-all route redirects back to storefront */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
// Register Progressive Web App (PWA) Service Worker
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('CoffeeLand PWA Service Worker active:', reg.scope);
      })
      .catch((err) => {
        console.warn('PWA Service Worker registration skipped:', err);
      });
  });
}
