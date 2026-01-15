'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { ItemDetailsDialog } from '@/components/item-details-dialog';
import type { Item } from '@/components/items-grid';
import { format } from 'date-fns';

type ItemCardProps = {
  item: Item;
  onUpdate: () => void;
};

const categoryConfig = {
  lost: {
    label: 'Lost',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    gradient: 'from-orange-500',
    glow: 'shadow-orange-500/20',
  },
  found: {
    label: 'Found',
    color: 'bg-green-500/20 text-green-400 border-green-500/50',
    gradient: 'from-green-500',
    glow: 'shadow-green-500/20',
  },
  stolen: {
    label: 'Stolen',
    color: 'bg-red-500/20 text-red-400 border-red-500/50',
    gradient: 'from-red-500',
    glow: 'shadow-red-500/20',
  },
};

export function ItemCard({ item, onUpdate }: ItemCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const config = categoryConfig[item.category] || categoryConfig.lost;

  return (
    <>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <div className="relative h-full group">
          {/* Glow effect */}
          <motion.div
            animate={{ opacity: isHovered ? 0.5 : 0 }}
            className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} to-blue-500 rounded-2xl blur-xl transition-opacity`}
          />

          <Card className="relative overflow-hidden h-full flex flex-col glass border-border/50 group-hover:border-blue-500/50 transition-all duration-500">
            {/* Animated border */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div
                className="absolute inset-[-2px] bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl animate-gradient"
                style={{ backgroundSize: '200% 100%' }}
              />
              <div className="absolute inset-[1px] bg-card rounded-2xl" />
            </div>

            <CardHeader className="relative space-y-3 pb-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant="outline"
                    className={`${config.color} whitespace-nowrap`}
                  >
                    {config.label}
                  </Badge>
                </motion.div>
              </div>
              {item.status === 'resolved' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Badge
                    variant="outline"
                    className="w-fit bg-blue-500/20 text-blue-400 border-blue-500/50"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Resolved
                  </Badge>
                </motion.div>
              )}
            </CardHeader>

            <CardContent className="relative space-y-4 flex-1">
              {item.image_url && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/50 border border-border/50">
                  <motion.img
                    src={item.image_url || '/placeholder.svg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Overlay gradient */}
                  <motion.div
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className={`absolute inset-0 bg-gradient-to-t ${config.gradient}/30 to-transparent`}
                  />
                  {/* View icon */}
                  <motion.div
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.5,
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="p-3 rounded-full glass">
                      <ExternalLink className="h-6 w-6 text-white" />
                    </div>
                  </motion.div>
                </div>
              )}

              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="space-y-2 text-sm">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  <span className="line-clamp-1">{item.location}</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Calendar className="h-4 w-4 flex-shrink-0 text-red-400" />
                  <span>
                    {(() => {
                      const date = new Date(item.date);
                      return isNaN(date.getTime()) ? 'Date pending' : format(date, 'MMM d, yyyy');
                    })()}
                  </span>
                </motion.div>
              </div>
            </CardContent>

            <CardFooter className="relative pt-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  onClick={() => setDetailsOpen(true)}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-0 shadow-lg shadow-blue-500/20"
                >
                  <motion.div
                    animate={{ x: isHovered ? 4 : 0 }}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </motion.div>
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </div>
      </motion.div>

      <ItemDetailsDialog
        item={item}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onUpdate={onUpdate}
      />
    </>
  );
}
