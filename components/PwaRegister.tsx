'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('PsyNova SW: registered successfully', reg.scope);
        })
        .catch((err) => {
          console.warn('PsyNova SW: registration failed', err);
        });
    }
  }, []);

  return null;
}
