import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-primary/10">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>© {currentYear} Luccas Evans. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart size={14} className="text-primary fill-primary" />
            <span>in Brazil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
