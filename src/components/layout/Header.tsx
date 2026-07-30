import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteConfig, useNavLinks } from '@/hooks/usePortfolioData';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { data: config } = useSiteConfig();
  const { data: navLinks = [] } = useNavLinks();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Find active section
      const sections = navLinks.map(link => link.href.slice(1));
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };


  return (
    <header className="fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] max-w-5xl">
      <nav
        className={`
          flex items-center justify-center px-4 md:px-10 py-1.5 md:py-3
          rounded-pill transition-all duration-300
          bg-card md:bg-card/95 backdrop-blur-xl ${isScrolled ? 'shadow-card' : ''}
          border border-primary/20
        `}
      >
        {/* Desktop Navigation - Centered */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className={`
                  px-4 py-2 rounded-pill text-sm font-medium transition-all duration-300
                  ${activeSection === link.href.slice(1) 
                    ? 'text-primary' 
                    : 'text-foreground/80 hover:text-primary'
                  }
                `}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-11 w-11"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 p-2 rounded-2xl bg-card backdrop-blur-xl border border-primary/20 shadow-card">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-border/60 last:border-b-0">
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className={`
                    block px-4 py-3.5 rounded-xl text-sm font-medium transition-all
                    ${activeSection === link.href.slice(1)
                      ? 'text-accent'
                      : 'text-foreground/80 hover:bg-muted hover:text-primary'
                    }
                  `}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
