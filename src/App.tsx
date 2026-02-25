import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { DynamicTheme } from "@/components/DynamicTheme";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import MenuItemPage from "./pages/MenuItemPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import SettingsTab from "./pages/admin/SettingsTab";
import LocationsTab from "./pages/admin/LocationsTab";
import CategoriesTab from "./pages/admin/CategoriesTab";
import MenuItemsTab from "./pages/admin/MenuItemsTab";
import AdminUsersTab from "./pages/admin/AdminUsersTab";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <DynamicTheme />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/menu/:id" element={<MenuItemPage />} />
              
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
            {/* Admin */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route index element={<SettingsTab />} />
              <Route path="locations" element={<LocationsTab />} />
              <Route path="categories" element={<CategoriesTab />} />
              <Route path="menu" element={<MenuItemsTab />} />
              
              <Route path="users" element={<AdminUsersTab />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
