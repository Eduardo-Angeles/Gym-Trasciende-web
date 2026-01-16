/**
 * PricingSelector - Componente interactivo de precios con Preact
 *
 * Funcionalidad:
 * - Grid 2x2 en móvil para selector de áreas
 * - Cambio de fondo dinámico según área seleccionada
 * - Transiciones suaves (700ms)
 * - Muestra tarjetas de precios por área
 */

import { useState } from "preact/hooks";

// Definición de tipos
type AreaId = "area1" | "area2" | "area3" | "area4";

interface Area {
  id: AreaId;
  name: string;
  gradient: string; // Clases de Tailwind para gradiente
}

interface PricingCard {
  type:
    | "Semanal"
    | "Quincenal"
    | "Mensual"
    | "Spinning+Pesas"
    | "Mensual estudiante"
    | "3 Meses"
    | "6 Meses"
    | "1 Año";
  price: string;
  features: string[];
}

// Configuración de áreas - Degradados vivos y transparentes
const areas: Area[] = [
  {
    id: "area1",
    name: "Clases de Spinning",
    gradient: "from-gray-900/50 via-emerald-600/60 to-gray-900/50",
  },
  {
    id: "area2",
    name: "Fuerza y Pesas",
    gradient: "from-gray-900/50 via-teal-600/60 to-gray-900/50",
  },
  {
    id: "area3",
    name: "Adultos Mayores",
    gradient: "from-gray-900/50 via-cyan-600/60 to-gray-900/50",
  },
  {
    id: "area4",
    name: "Promociones Fin de Año",
    gradient: "from-emerald-600/60 via-teal-600/60 to-cyan-600/60",
  },
];

// Datos de precios por área (ejemplo - ajusta según tus precios reales)
const pricingData: Record<AreaId, PricingCard[]> = {
  area2: [
    {
      type: "Semanal",
      price: "$110",
      features: [
        "Asesoría personalizada en rutinas",
        "Acceso completo",
        "Lun-Vie 5am-10pm",
        "Sáb 6:00am-5pm",
        "Dom 12pm-4pm",
      ],
    },
    {
      type: "Quincenal",
      price: "$200",
      features: [
        "Asesoría personalizada en rutinas",
        "Acceso completo",
        "Lun-Vie 5am-10pm",
        "Sáb 6:00am-5pm",
        "Dom 12pm-4pm",
      ],
    },
    {
      type: "Mensual",
      price: "$380",
      features: [
        "Asesoría personalizada en rutinas",
        "Acceso completo",
        "Lun-Vie 5am-10pm",
        "Sáb 6:00am-5pm",
        "Dom 12pm-4pm",
        "Promo estudiante $340",
      ],
    },
  ],
  area1: [
    {
      type: "Mensual",
      price: "$500",
      features: [
        "Cupo limitado",
        "Lun-Vie 6am-7am",
        "Lun-Vie 7am-8am",
        "Lun-Vie 6pm-7pm, 7pm-8pm",
      ],
    },
    {
      type: "Spinning+Pesas",
      price: "$800",
      features: [
        "Cupo limitado",
        "Spinning + Pesas",
        "Todos los horarios",
        "Acceso completo",
      ],
    },
    {
      type: "Mensual estudiante",
      price: "$460",
      features: [
        "Cupo limitado",
        "Credencial vigente",
        "Todos los horarios",
        "Instructor certificado",
      ],
    },
  ],
  area3: [
    {
      type: "Semanal",
      price: "$140",
      features: [
        "Lun-Vie 8:15am-9:15am",
        "Clases especializadas",
        "Ambiente seguro",
        "Seguimiento personalizado",
      ],
    },
    {
      type: "Quincenal",
      price: "$200",
      features: [
        "Lun-Vie 8:15am-9:15am",
        "Clases especializadas",
        "Ambiente seguro",
        "Seguimiento personalizado",
      ],
    },
    {
      type: "Mensual",
      price: "$400",
      features: [
        "Lun-Vie 8:15am-9:15am",
        "Clases especializadas",
        "Ambiente seguro",
        "Seguimiento personalizado",
      ],
    },
  ],
  area4: [
    {
      type: "3 Meses",
      price: "$1,000",
      features: ["Horarios de Pesas", "Todos los beneficios del área de pesas"],
    },
    {
      type: "6 Meses",
      price: "$1,900",
      features: ["Horarios de Pesas", "Todos los beneficios del área de pesas"],
    },
    {
      type: "1 Año",
      price: "$3,750",
      features: [
        "Horarios de Pesas",
        "Todos los beneficios del área de pesas",
        "¡Mejor precio!",
      ],
    },
  ],
};

export default function PricingSelector() {
  // Estado: área seleccionada (por defecto area2)
  const [selectedArea, setSelectedArea] = useState<AreaId>("area2");

  // Obtener el gradiente actual
  const currentGradient =
    areas.find((a) => a.id === selectedArea)?.gradient || "";

  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Fondo con gradiente - transición suave */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${currentGradient} transition-all duration-1500 ease-in-out`}
      />

      {/* Overlay para suavizar aún más */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 p-4 md:p-12">
        {/* Selector de Áreas - Diseño moderno compacto */}
        <div className="mb-8 md:mb-10">
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center">
              {areas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-500 md:px-6 md:py-3 md:text-base ${
                    selectedArea === area.id
                      ? "bg-primary shadow-primary/50 scale-105 text-gray-900 shadow-lg"
                      : "bg-white/80 text-gray-900 backdrop-blur-sm hover:bg-white/90"
                  }`}
                >
                  {/* Efecto de brillo en hover */}
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  <span className="relative">{area.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tarjetas de Precios - Scroll horizontal en móvil */}
        <div className="relative">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            {pricingData[selectedArea].map((card, index) => (
              <div
                key={`${selectedArea}-${index}`}
                className="group max-w-62.5 min-w-62.5 shrink-0 snap-center rounded-2xl bg-white/85 p-5 shadow-lg backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:bg-linear-to-br hover:from-emerald-500/90 hover:to-teal-600/90 hover:shadow-2xl active:scale-[0.98] md:max-w-none md:min-w-0 md:hover:-translate-y-2 md:hover:scale-[1.03]"
                style={{
                  animation: "fadeInUp 0.8s ease-out",
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                {/* Tipo de plan */}
                <h3 className="mb-2 text-center text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-white">
                  {card.type}
                </h3>

                {/* Precio */}
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-white">
                    {card.price}
                  </span>
                  {(card.type === "Semanal" ||
                    card.type === "Quincenal" ||
                    card.type === "Mensual" ||
                    card.type === "Mensual estudiante") && (
                    <span className="text-gray-600 transition-colors duration-300 group-hover:text-white/90">
                      /
                      {card.type === "Semanal"
                        ? "semana"
                        : card.type === "Quincenal"
                          ? "quincena"
                          : "mes"}
                    </span>
                  )}
                </div>

                {/* Características */}
                <ul className="mb-6 space-y-3">
                  {card.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-gray-700 transition-colors duration-300 group-hover:text-white"
                    >
                      <svg
                        className="mt-1 h-5 w-5 shrink-0 text-green-500 transition-all duration-300 group-hover:scale-110 group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Botón CTA como enlace a contacto */}
                <a
                  href="/contacto"
                  className="block w-full rounded-lg bg-linear-to-r from-gray-900 to-gray-800 px-6 py-3 text-center font-semibold text-white transition-all duration-300 group-hover:bg-white group-hover:from-white group-hover:to-white group-hover:text-emerald-700 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  Inscribirme
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estilos para la animación fadeInUp */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
