import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useSiteConfig, useNavLinks } from '@/hooks/usePortfolioData';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <header className="fixed top-3 md:top-4 left-3 md:left-1/2 md:-translate-x-1/2 z-50 w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] max-w-5xl">
      <nav
        className={`
          flex items-center justify-start md:justify-center
          rounded-none md:rounded-pill transition-all duration-300
          bg-transparent md:bg-card/95 backdrop-blur-none md:backdrop-blur-xl
          ${isScrolled ? 'md:shadow-card' : ''}
          md:border md:border-primary/20
          px-0 md:px-10 py-0 md:py-3
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
        
        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground/90 hover:text-primary transition-colors rounded-full bg-card/50 backdrop-blur-sm border border-primary/10"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 mt-2 w-full bg-card border border-primary/20 rounded-2xl shadow-card overflow-hidden animate-fade-in">
            <ul className="flex flex-col py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className={`
                      block px-5 py-3 text-sm font-medium transition-colors
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
          </div>
        )}
      </nav>
    </header>
  );
}

