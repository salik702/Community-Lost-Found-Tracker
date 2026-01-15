'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemCard } from '@/components/item-card';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export type Item = {
  id: number;
  title: string;
  description: string;
  category: 'lost' | 'found' | 'stolen';
  location: string;
  date: string;
  image_url: string | null;
  contact_info: string;
  status: 'active' | 'resolved';
  created_at: string;
  user?: {
    Name: string;
    Email: string;
    Location?: string;
  };
};

function ItemSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl animate-pulse" />
      <div className="relative glass rounded-2xl overflow-hidden border border-border/50">
        <div className="h-48 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="h-6 w-2/3 bg-muted rounded-lg animate-pulse" />
            <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
          </div>
          <div className="h-10 bg-muted rounded-lg animate-pulse mt-4" />
        </div>
      </div>
    </motion.div>
  );
}

export function ItemsGrid() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    setDisplayLimit(3);
    fetchItems(3);
  }, [category]);

  useEffect(() => {
    if (displayLimit > 3) {
      fetchItems(displayLimit);
    }
  }, [displayLimit]);

  const fetchItems = async (currentLimit: number) => {
    try {
      if (currentLimit === 3) setLoading(true);
      else setLoadingMore(true);

      let url = category && category !== 'all'
        ? `http://localhost:3001/api/items?status=${category.charAt(0).toUpperCase() + category.slice(1)}&limit=${currentLimit}`
        : `http://localhost:3001/api/items?limit=${currentLimit}`;

      let response = await fetch(url);
      let data = await response.json();

      if (Array.isArray(data) && data.length === 0 && category && category !== 'all') {
        response = await fetch(`http://localhost:3001/api/items?limit=${currentLimit}`);
        data = await response.json();
      }

      if (Array.isArray(data)) {
        const mappedItems = data.map((item: any) => ({
          id: item.ItemID,
          title: item.ItemName,
          description: item.Description,
          category: item.Status ? item.Status.toLowerCase() : 'lost',
          location: item.location ? item.location.LocationName : (item.LocationFoundOrLost ? 'Unknown Location' : 'Unknown'),
          date: item.DateReported,
          image_url: item.ImageURL,
          contact_info: item.user ? item.user.Contact : 'Contact Admin',
          status: item.Status === 'Recovered' ? 'resolved' : 'active',
          created_at: item.DateReported || new Date().toISOString(),
          user: item.user ? {
            Name: item.user.Name,
            Email: item.user.Email,
            Location: item.user.Location,
          } : undefined
        }));

        const validItems = mappedItems.filter((item: any) => item.id);
        const uniqueItems = Array.from(new Map(validItems.map((item: any) => [item.id, item])).values());

        setItems(uniqueItems);
        setHasMore(uniqueItems.length >= currentLimit);
      } else {
        setItems([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <ItemSkeleton key={i} index={i} />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <h3 className="text-2xl font-bold mb-4">No specific items found</h3>
          <p className="text-muted-foreground mb-8">
            No items in this category yet. Start by reporting one!
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <span className="text-sm text-muted-foreground">Recent Reports</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold">
          Browse{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {category && category !== 'all'
              ? category.charAt(0).toUpperCase() + category.slice(1)
              : 'All'}{' '}
            Items
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                delay: index * 0.08,
                duration: 0.5,
                type: 'spring',
                stiffness: 100,
              }}
              layout
              className="relative"
            >
              <ItemCard item={item} onUpdate={() => fetchItems(displayLimit)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-16 flex justify-center"
        >
          <Button
            onClick={() => setDisplayLimit((prev) => prev + 3)}
            disabled={loadingMore}
            size="lg"
            className="group relative overflow-hidden bg-white/5 border border-white/10 hover:border-blue-500/50 px-8 py-6 rounded-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2 text-lg font-medium">
              {loadingMore ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 transition-transform group-hover:rotate-180 duration-500" />
                  Load More Items
                </>
              )}
            </span>
          </Button>
        </motion.div>
      )}
    </section>
  );
}
