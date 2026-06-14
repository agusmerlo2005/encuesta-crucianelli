// Sembradoras Crucianelli para la demo.
// Las specs son placeholders editables; ajustá con los datos reales de la planilla.
export const machines = [
  {
    id: 'plantor-3.9',
    name: 'PLANTOR 3.9',
    edition: 'BRASIL',
    image: '/assets/plantor3.9.png',
    tagline: {
      pt: 'Plantadeira semeadora para grãos grossos de alto rendimento.',
      es: 'Sembradora para granos gruesos de alto rendimiento.',
    },
    specs: [
      { pt: 'Linhas configuráveis', es: 'Líneas configurables', value: 'até 49' },
      { pt: 'Espaçamento', es: 'Distanciamiento', value: '45–50 cm' },
      { pt: 'Indicada para', es: 'Indicada para', value: 'Soja · Milho · Algodão' },
    ],
    accent: 'from-cruci-red to-cruci-red-dark',
  },
  {
    id: 'plantor-3.2',
    name: 'PLANTOR 3.2',
    edition: 'BRASIL',
    image: '/assets/plantor3.2.png',
    tagline: {
      pt: 'Plantadeira semeadora robusta e versátil para grãos grossos.',
      es: 'Sembradora robusta y versátil para granos gruesos.',
    },
    specs: [
      { pt: 'Linhas configuráveis', es: 'Líneas configurables', value: 'até 38' },
      { pt: 'Espaçamento', es: 'Distanciamiento', value: '45–50 cm' },
      { pt: 'Indicada para', es: 'Indicada para', value: 'Soja · Milho · Feijão' },
    ],
    accent: 'from-cruci-ink to-cruci-steel',
  },
]
