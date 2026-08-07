import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppSidebar from '../components/layout/AppSidebar';
import Navbar from '../components/layout/Navbar';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { SidebarProvider, SidebarInset } from '../components/ui/sidebar';

export const AppLayout: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-hidden bg-[#F7F7F5] selection:bg-neutral-200">
        {/* Global Top-Center React Sonner Toaster */}
        <Toaster position="top-center" richColors closeButton />

        {/* Background Soft Notion Glass Ambient Orbs */}
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
          <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-100/40 via-stone-100/30 to-neutral-200/20 blur-[140px]" />
          <div className="absolute -bottom-32 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-stone-200/40 via-neutral-100/30 to-amber-50/20 blur-[140px]" />
        </div>

        {/* Official shadcn AppSidebar Component */}
        <AppSidebar />

        {/* Main Content Inset Container */}
        <SidebarInset className="relative flex flex-1 flex-col overflow-hidden w-full bg-transparent">
          <Navbar />

          <main className="relative flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <Breadcrumbs />
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
