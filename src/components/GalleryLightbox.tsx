import { useEffect, useState } from "preact/hooks";
import type { JSX } from "preact";

// Interface para las props del componente
interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
}

/**
 * Componente Lightbox interactivo para la galería
 * Se carga con client:idle para no bloquear la carga inicial
 * Maneja navegación con teclado (flechas, Escape) y touch (swipe)
 */
export default function GalleryLightbox({
  images,
}: GalleryLightboxProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // ABRIR LIGHTBOX: Escucha clicks en las imágenes del grid
  useEffect(() => {
    const handleTriggerClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const index = target.dataset.imageIndex;

      if (index !== undefined) {
        setCurrentIndex(parseInt(index, 10));
        setIsOpen(true);
        document.body.style.overflow = "hidden"; // Bloquea scroll del body
      }
    };

    // Encuentra todos los botones de la galería y añade listeners
    const triggers = document.querySelectorAll("[data-gallery-trigger]");
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", handleTriggerClick);
    });

    // Cleanup: remueve listeners cuando el componente se desmonta
    return () => {
      triggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleTriggerClick);
      });
    };
  }, []);

  // CERRAR LIGHTBOX
  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = ""; // Restaura scroll
  };

  // NAVEGACIÓN: Imagen anterior
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // NAVEGACIÓN: Imagen siguiente
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // TECLADO: Flechas para navegar, Escape para cerrar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  // TOUCH: Swipe para navegar en móviles
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left (siguiente)
      goToNext();
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right (anterior)
      goToPrevious();
    }
  };

  // No renderiza nada si está cerrado (performance)
  if (!isOpen) return <></>;

  const currentImage = images[currentIndex];

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={closeLightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imágenes"
    >
      {/* BOTÓN CERRAR (X) */}
      <button
        onClick={closeLightbox}
        class="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
        aria-label="Cerrar visor de imágenes"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* CONTADOR: Imagen X de Y */}
      <div class="absolute top-4 left-4 z-10 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
        {currentIndex + 1} / {images.length}
      </div>

      {/* BOTÓN ANTERIOR (< flecha izquierda) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrevious();
        }}
        class="absolute left-4 z-10 hidden rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20 md:block"
        aria-label="Imagen anterior"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* IMAGEN PRINCIPAL */}
      <div
        class="relative mx-4 max-h-[90vh] max-w-7xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          class="h-auto max-h-[90vh] w-auto max-w-full rounded-lg object-contain"
        />

        {/* DESCRIPCIÓN (ALT TEXT) */}
        {currentImage.alt && (
          <p class="mt-4 text-center text-sm text-white/80 md:text-base">
            {currentImage.alt}
          </p>
        )}
      </div>

      {/* BOTÓN SIGUIENTE (> flecha derecha) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        class="absolute right-4 z-10 hidden rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20 md:block"
        aria-label="Imagen siguiente"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* INDICADORES DE NAVEGACIÓN MÓVIL (solo en touch devices) */}
      <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 md:hidden">
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          class="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          aria-label="Imagen anterior"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          class="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          aria-label="Imagen siguiente"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * NOTAS PARA MODIFICAR:
 *
 * 1. CAMBIAR ESTILOS:
 *    - Backdrop: bg-black/95 (oscuridad del fondo)
 *    - Botones: bg-white/10 hover:bg-white/20 (transparencia de controles)
 *    - Contador: top-4 left-4 (posición del contador)
 *
 * 2. AÑADIR ZOOM:
 *    - Puedes agregar un estado para zoom y transformar la imagen
 *    - Ej: const [zoom, setZoom] = useState(1)
 *    - Aplicar: style={{ transform: `scale(${zoom})` }}
 *
 * 3. ANIMACIONES:
 *    - Agregar transiciones CSS o usar librerías como Framer Motion
 *    - Ejemplo: transition-transform duration-300 en la imagen
 *
 * 4. SWIPE SENSITIVITY:
 *    - Líneas 105-106: Cambiar 75 por otro valor (mayor = menos sensible)
 *
 * 5. DESACTIVAR NAVEGACIÓN CON TECLADO:
 *    - Eliminar el useEffect de las líneas 75-86
 */
