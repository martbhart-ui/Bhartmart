import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './Components/Header';
import { HeroCarousel } from './Components/HeroCarousel';
import { CategoryList } from './Components/CategoryList';
import { ProductGrid } from './Components/ProductGrid';
import { Footer } from './Components/Footer';
import { CartDrawer } from './Components/CartDrawer';
import { AdminPanel } from './Components/AdminPanel';

export const MainApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header
        onAdminClick={() => setIsAdminOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main className="flex-1">
        <HeroCarousel />
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <ProductGrid
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
        />
      </main>

      <Footer onAdminClick={() => setIsAdminOpen(true)} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}