# 🎨 Guía de Diseño & Paleta de Colores — Sistema Contable (Estilo Notion Minimalista + Ultra Glassmorphism)

Este documento define el **sistema de diseño, paleta de colores y componentes visuales** para el frontend del Sistema Contable. El concepto gráfico combina la estética sobria de **Notion** con capas avanzadas de **Glassmorphism**, reflejos especulares y desenfoque multicapa.

---

## 1. Concepto y Filosofía de Diseño

- **Claridad e Intencionalidad**: Menos distracción visual para un enfoque total en los datos financieros y contables.
- **Tonalidad Cálida y Neutra**: Lienzos marfil/papel (`#F7F7F5`), grises carbón Notion (`#37352F`) y bordes refinados.
- **Ultra-Glassmorphism**: Efecto de cristal esmerilado profundo (`backdrop-blur-3xl bg-white/60 border-white/80 ring-1 ring-white/60`) refractando esferas de luz ambiente flotantes (`blur-[130px]`).
- **Capa Especular (Glass Reflect)**: Brillo sutil de refracción superior mediante degradado transparente (`before:bg-gradient-to-br before:from-white/40 before:to-transparent`).

---

## 2. Paleta de Colores Principal

| Rol de Color | Nombre / Tono | Código HEX / Clase | Clases Tailwind CSS | Uso Principal |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas / Fondo Base** | Off-White / Marfil | `#F7F7F5` | `bg-[#F7F7F5]` | Fondo principal del lienzo |
| **Orbes de Luz Ambiente** | Warm Glow Orbs | `#EADBC8` / `#F3EEEA` | `bg-gradient-to-br from-amber-100/60 blur-[130px]` | Fondo refractado bajo el cristal |
| **Panel Secundario Glass** | Warm Neutral Glass | `#FAF9F5` (40% opacidad) | `bg-[#FAF9F5]/40 backdrop-blur-xl border-r border-white/60` | Paneles laterales de tarjetas split |
| **Superficie Glass Card** | Blanco Esmerilado | `#FFFFFF` (60-70% opacidad) | `bg-white/60 backdrop-blur-3xl border-white/80 ring-1 ring-white/60` | Tarjetas flotantes principales |
| **Texto Principal** | Notion Graphite | `#37352F` | `text-[#37352F]` | Títulos, encabezados, cuerpo |
| **Texto Secundario** | Muted Gray | `#787774` | `text-[#787774]` | Subtítulos, labels, helper text |
| **Placeholder** | Neutral Gray | `#9B9A97` | `placeholder-neutral-400` | Texto dentro de inputs |
| **Borde Cristalino** | Specular Glass Border | `rgba(255,255,255,0.8)` | `border-white/80 ring-1 ring-white/60` | Bordes de tarjetas y contenedores |

---

## 3. Paleta de Estados y Feedback (Semántica)

| Estado | HEX | Fondo Glass | Texto | Borde | Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Éxito / Positivo** | `#059669` | `bg-emerald-50/90 backdrop-blur-md` | `text-emerald-900` | `border-emerald-200` | Facturas pagadas, registros exitosos |
| **Error / Peligro** | `#E11D48` | `bg-rose-50/90 backdrop-blur-md` | `text-rose-900` | `border-rose-200` | Alertas de API, campos inválidos |
| **Advertencia** | `#D97706` | `bg-amber-50/90 backdrop-blur-md` | `text-amber-900` | `border-amber-200` | Contraseña media, pagos pendientes |
| **Información** | `#2563EB` | `bg-blue-50/90 backdrop-blur-md` | `text-blue-900` | `border-blue-200` | Avisos informativos |

---

## 4. Tipografía y Jerarquía

Utilizamos la fuente nativa del sistema (`font-sans`):

- **H1 / Título de Página**: `text-2xl font-bold tracking-tight text-[#37352F]`
- **H2 / Título de Sección**: `text-xl font-bold tracking-tight text-[#37352F]`
- **H3 / Título de Tarjeta**: `text-base font-semibold text-[#37352F]`
- **Labels de Campo**: `text-[11px] font-semibold uppercase tracking-wider text-[#787774]`
- **Cuerpo de Texto**: `text-sm text-[#37352F] leading-relaxed`
- **Subtexto de Ayuda**: `text-xs text-[#787774]`

---

## 5. Tokens y Patrones de Componentes UI

### A. Tarjeta Flotante Ultra-Glassmorphism (`Card Container`)

```tsx
<div className="relative flex w-full max-w-4xl overflow-hidden rounded-3xl border border-white/80 bg-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl transition-all before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-transparent before:pointer-events-none">
  {/* Panel Izquierdo Glass */}
  <div className="w-1/2 border-r border-white/60 bg-[#FAF9F5]/40 p-10 backdrop-blur-xl">
    <!-- Contenido secundario / Branding -->
  </div>

  {/* Panel Derecho Principal */}
  <div className="w-1/2 p-10">
    <!-- Formulario / Datos principales -->
  </div>
</div>
```

---

### B. Entradas de Formulario Glassmorphic (`FormInput`)

```tsx
<div className="space-y-1.5">
  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
    Correo Electrónico
  </label>
  <input
    type="email"
    className="w-full rounded-xl border border-white/80 bg-white/60 px-3.5 py-2.5 text-sm text-[#37352F] placeholder-neutral-400 shadow-sm backdrop-blur-md transition-all duration-200 outline-none hover:border-neutral-300 focus:bg-white/90 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
    placeholder="tu@empresa.com"
  />
</div>
```

---

### C. Botones (`Button Tokens`)

#### 1. Botón Principal Notion Graphite
```tsx
<button className="rounded-xl bg-[#37352F] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#201F1C] focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 disabled:opacity-50">
  Ingresar
</button>
```

#### 2. Botón SSO Google Glass
```tsx
<button className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/80 bg-white/70 px-4 py-2.5 text-sm font-medium text-[#37352F] shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/95 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300">
  <!-- Icono de Google -->
  Continuar con Google
</button>
```

---

### D. Badges y Pills de Estado Glassmorphic

```tsx
/* Badge Glass Activo / Pagado */
<span className="inline-flex items-center rounded-full border border-white bg-emerald-100/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 backdrop-blur-md shadow-2xs">
  Pagado
</span>

/* Badge Glass Pendiente */
<span className="inline-flex items-center rounded-full border border-white bg-amber-100/60 px-2.5 py-0.5 text-xs font-semibold text-amber-800 backdrop-blur-md shadow-2xs">
  Pendiente
</span>
```

---

## 6. Reglas de Implementación Futura

1. **Mantener Capas de Reflejo**: Usar `backdrop-blur-3xl` o `backdrop-blur-2xl` sobre contenedores `bg-white/60` o `bg-white/70` para garantizar translucidez realista.
2. **Orbes de Luz**: Colocar siempre fondos de degradado sutiles (`blur-[130px]`) detrás de módulos o secciones principales para potenciar la refracción del cristal.
3. **Bordes Brilantes en Blanqueo**: Utilizar `border-white/80` o `border-white/60` para enfatizar los biseles del vidrio.
