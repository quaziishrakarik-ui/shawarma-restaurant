import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface PageHeaderProps {
  tagline: string;
  title: string;
  imageUrl?: string | null;
}

export default function PageHeader({ tagline, title, imageUrl }: PageHeaderProps) {
  return (
    <div className="relative pt-20 pb-16 md:py-32 text-center overflow-hidden">
      {/* Background: image or default color */}
      {imageUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-secondary/40" />
      )}
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className={`text-xs font-body font-medium tracking-[0.3em] uppercase mb-4 block ${
              imageUrl ? "text-white/70" : "text-primary"
            }`}
          >
            {tagline}
          </span>
          <h1
            className={`text-5xl md:text-6xl font-display font-semibold mb-4 ${
              imageUrl ? "text-white" : ""
            }`}
          >
            {title}
          </h1>
          <div className="arabesque-divider max-w-xs mx-auto mt-6">
            <Star className={`h-4 w-4 ${imageUrl ? "text-white/60" : "text-primary"}`} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
