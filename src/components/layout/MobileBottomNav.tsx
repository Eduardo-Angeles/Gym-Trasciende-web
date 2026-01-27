/**
 * MobileBottomNav - Navegación inferior móvil inteligente
 *
 * Características:
 * - Auto-hide al hacer scroll down
 * - Active state según sección visible
 * - Vibración háptica al tocar
 * - Smooth scroll
 * - Glassmorphism design
 * - Solo visible en móviles (<768px)
 */

import { useEffect, useState, useCallback } from "preact/hooks";
import type { JSX } from "preact";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: "clock" | "tag" | "star" | "grid" | "image";
}

interface Props {
  items: NavItem[];
  hideOnScroll?: boolean;
  vibration?: boolean;
}

// Iconos SVG minimalistas
const Icon = ({
  type,
  className = "",
}: {
  type: string;
  className?: string;
}): JSX.Element => {
  const icons: Record<string, JSX.Element> = {
    clock: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    tag: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <circle cx="7" cy="7" r="1" fill="currentColor" />
      </svg>
    ),
    star: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    grid: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    image: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  };

  return icons[type] || icons.grid;
};

export default function MobileBottomNav({
  items,
  hideOnScroll = true,
  vibration = true,
}: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Vibración háptica (si está disponible)
  const vibrate = useCallback(() => {
    if (vibration && "vibrate" in navigator) {
      navigator.vibrate(10); // 10ms suave
    }
  }, [vibration]);

  // Detectar dirección de scroll
  useEffect(() => {
    if (!hideOnScroll) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Siempre visible en la parte superior
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 150) {
        // Scroll down → ocultar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scroll up → mostrar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, hideOnScroll]);

  // Detectar sección activa con Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Centro del viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observar secciones que tengan ID
    items.forEach((item) => {
      if (item.href.startsWith("#")) {
        const sectionId = item.href.slice(1);
        const element = document.getElementById(sectionId);
        if (element) {
          observer.observe(element);
        }
      }
    });

    return () => observer.disconnect();
  }, [items]);

  // Smooth scroll + vibración
  const handleClick = useCallback(
    (e: Event, item: NavItem) => {
      if (item.href.startsWith("#")) {
        e.preventDefault();

        if (isTransitioning) return;

        vibrate();
        setIsTransitioning(true);

        const targetId = item.href.slice(1);
        const element = document.getElementById(targetId);

        if (element) {
          const navHeight = 64; // Altura del navbar
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - navHeight - 20;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Actualizar active state inmediatamente
          setActiveSection(targetId);
        }

        setTimeout(() => setIsTransitioning(false), 800);
      } else {
        vibrate();
      }
    },
    [vibrate, isTransitioning],
  );

  return (
    <nav
      role="navigation"
      aria-label="Navegación móvil"
      className={`fixed right-0 bottom-0 left-0 z-50 transform transition-transform duration-300 md:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ willChange: "transform" }}
    >
      {/* Contenedor con glassmorphism */}
      <div className="border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-xl">
        <div
          className={`mx-auto grid max-w-lg gap-0`}
          style={{
            gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          {items.map((item) => {
            const isActive = item.href.startsWith("#")
              ? activeSection === item.href.slice(1)
              : false;

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleClick(e as any, item)}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex min-h-16 flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-95 ${
                  isActive
                    ? "text-primary"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {/* Indicator line arriba (solo si está activo) */}
                {isActive && (
                  <div className="bg-primary absolute top-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full" />
                )}

                {/* Icono */}
                <Icon type={item.icon} className="h-5 w-5" />

                {/* Label */}
                <span className="text-xs leading-tight font-medium">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
