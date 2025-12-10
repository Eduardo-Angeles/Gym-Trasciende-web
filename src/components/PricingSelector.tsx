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
  type: "Semanal" | "Quincenal" | "Mensual";
  price: string;
  features: string[];
}

// Configuración de áreas - Tonos oscuros con énfasis en verde
const areas: Area[] = [
  {
    id: "area1",
    name: "Área 1",
    gradient: "from-teal-800 to-cyan-900",
  },
  {
    id: "area2",
    name: "Área 2",
    gradient: "from-emerald-800 to-green-900",
  },
  {
    id: "area3",
    name: "Área 3",
    gradient: "from-slate-800 to-zinc-900",
  },
  {
    id: "area4",
    name: "Área 4",
    gradient: "from-lime-800 to-gray-900",
  },
];

// Datos de precios por área (ejemplo - ajusta según tus precios reales)
const pricingData: Record<AreaId, PricingCard[]> = {
  area1: [
    {
      type: "Semanal",
      price: "$150",
      features: ["Acceso ilimitado", "Clases grupales", "Casillero"],
    },
    {
      type: "Quincenal",
      price: "$280",
      features: [
        "Acceso ilimitado",
        "Clases grupales",
        "Casillero",
        "1 clase personalizada",
      ],
    },
    {
      type: "Mensual",
      price: "$500",
      features: [
        "Acceso ilimitado",
        "Clases grupales",
        "Casillero",
        "2 clases personalizadas",
        "Nutrición",
      ],
    },
  ],
  area2: [
    {
      type: "Semanal",
      price: "$180",
      features: ["Acceso ilimitado", "Clases spinning", "Casillero"],
    },
    {
      type: "Quincenal",
      price: "$320",
      features: ["Acceso ilimitado", "Clases spinning", "Casillero", "Toalla"],
    },
    {
      type: "Mensual",
      price: "$580",
      features: [
        "Acceso ilimitado",
        "Clases spinning",
        "Casillero",
        "Toalla",
        "Bebida energética",
      ],
    },
  ],
  area3: [
    {
      type: "Semanal",
      price: "$200",
      features: ["Zona adultos", "Instructor dedicado", "Plan personalizado"],
    },
    {
      type: "Quincenal",
      price: "$370",
      features: [
        "Zona adultos",
        "Instructor dedicado",
        "Plan personalizado",
        "Seguimiento semanal",
      ],
    },
    {
      type: "Mensual",
      price: "$650",
      features: [
        "Zona adultos",
        "Instructor dedicado",
        "Plan personalizado",
        "Seguimiento semanal",
        "Consulta nutrición",
      ],
    },
  ],
  area4: [
    {
      type: "Semanal",
      price: "$120",
      features: ["Acceso básico", "Área cardio", "Casillero"],
    },
    {
      type: "Quincenal",
      price: "$220",
      features: ["Acceso básico", "Área cardio", "Casillero", "1 clase grupal"],
    },
    {
      type: "Mensual",
      price: "$400",
      features: [
        "Acceso básico",
        "Área cardio",
        "Casillero",
        "Clases grupales ilimitadas",
      ],
    },
  ],
};

export default function PricingSelector() {
  // Estado: área seleccionada (por defecto area1)
  const [selectedArea, setSelectedArea] = useState<AreaId>("area1");

  // Obtener el gradiente actual
  const currentGradient =
    areas.find((a) => a.id === selectedArea)?.gradient || "";

  return (
    <div
      className={`bg-gradient-to-br ${currentGradient} rounded-3xl p-6 transition-colors duration-700 ease-in-out md:p-12`}
    >
      {/* Selector de Áreas - Grid 2x2 en móvil */}
      <div className="mb-8">
        <h2 className="mb-6 text-center text-3xl font-bold text-white md:text-4xl">
          Selecciona tu Área
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area.id)}
              className={`rounded-xl px-6 py-4 font-semibold transition-all duration-300 ${
                selectedArea === area.id
                  ? "scale-105 bg-white text-gray-900 shadow-2xl"
                  : "bg-white/20 text-white hover:scale-105 hover:bg-white/30"
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas de Precios */}
      <div className="grid gap-6 md:grid-cols-3">
        {pricingData[selectedArea].map((card, index) => (
          <div
            key={card.type}
            className="animate-fade-in rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:scale-105"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Tipo de plan */}
            <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
              {card.type}
            </h3>

            {/* Precio */}
            <div className="mb-6 text-center">
              <span className="text-4xl font-bold text-gray-900">
                {card.price}
              </span>
              <span className="text-gray-600">
                /
                {card.type === "Semanal"
                  ? "semana"
                  : card.type === "Quincenal"
                    ? "quincena"
                    : "mes"}
              </span>
            </div>

            {/* Características */}
            <ul className="mb-6 space-y-3">
              {card.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-green-500"
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

            {/* Botón CTA */}
            <button className="w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800">
              Inscribirme
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
