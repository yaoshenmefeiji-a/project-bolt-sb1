import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ResourceSearch } from './pages/ResourceSearch';
import { ServerConfig } from './pages/ServerConfig';
import { OrderConfirm } from './pages/OrderConfirm';
import { CustomResource } from './pages/CustomResource';
import { CustomOrderInfo } from './pages/CustomOrderInfo';
import { CustomOrderConfirm } from './pages/CustomOrderConfirm';
import { BYOIPOrder } from './pages/BYOIPOrder';
import { BYOIPServerConfig } from './pages/BYOIPServerConfig';
import { BYOIPConfirm } from './pages/BYOIPConfirm';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ResourceSearch />} />
        <Route path="/server-config" element={<ServerConfig />} />
        <Route path="/payment" element={<OrderConfirm />} />
        <Route path="/custom-resource" element={<CustomResource />} />
        <Route path="/custom-order-info" element={<CustomOrderInfo />} />
        <Route path="/custom-order-confirm" element={<CustomOrderConfirm />} />
        <Route path="/byo-ip" element={<BYOIPOrder />} />
        <Route path="/byo-ip/server" element={<BYOIPServerConfig />} />
        <Route path="/byo-ip/confirm" element={<BYOIPConfirm />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;