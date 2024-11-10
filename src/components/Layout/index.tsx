import { ReactNode } from 'react';
import { Header } from '../Dashboard/Header';
import { Sidebar } from '../Dashboard/Sidebar';
import { Container } from '@radix-ui/themes';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Container size="4" className="p-6">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};
