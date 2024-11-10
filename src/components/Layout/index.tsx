import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Dashboard/Header';
import { Sidebar } from '../Dashboard/Sidebar';
import { Container } from '@radix-ui/themes';

export const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <Container size="4" className="p-6">
          <Outlet />
        </Container>
      </main>
    </div>
  );
};
