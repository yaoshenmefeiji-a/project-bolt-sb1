import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ResourceSearch } from './pages/ResourceSearch';
import { ServerConfig } from './pages/ServerConfig';
import { OrderConfirm } from './pages/OrderConfirm';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ResourceSearch />} />
        <Route path="/server-config" element={<ServerConfig />} />
        <Route path="/payment" element={<OrderConfirm />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;