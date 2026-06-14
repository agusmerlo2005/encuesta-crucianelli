// Regiones de actuación.
// `coords` = [longitud, latitud] de la ciudad ancla, para ubicar el pin en el mapa real.
export const regions = [
  {
    id: 'mt-norte',
    state: 'MT',
    name: 'MT Norte',
    cities: ['Sinop', 'Sorriso', 'Lucas do Rio Verde'],
    coords: [-55.5, -11.86],
  },
  {
    id: 'mt-oeste',
    state: 'MT',
    name: 'MT Oeste',
    cities: ['Campo Novo do Parecis', 'Sapezal'],
    coords: [-57.89, -13.67],
  },
  {
    id: 'mt-araguaia',
    state: 'MT',
    name: 'MT Araguaia',
    cities: ['Canarana', 'Querência'],
    coords: [-52.21, -12.6],
  },
  {
    id: 'mt-sur',
    state: 'MT',
    name: 'MT Sul',
    cities: ['Primavera do Leste', 'Rondonópolis'],
    coords: [-54.63, -16.47],
  },
  {
    id: 'to',
    state: 'TO',
    name: 'Tocantins',
    cities: ['Palmas', 'Gurupi', 'Araguaína'],
    coords: [-48.33, -10.18],
  },
  {
    id: 'ba-oeste',
    state: 'BA',
    name: 'Oeste Baiano',
    cities: ['Luís Eduardo Magalhães', 'Barreiras', 'São Desidério'],
    coords: [-45.4, -12.1],
  },
  {
    id: 'go-norte',
    state: 'GO',
    name: 'GO Norte',
    cities: ['Uruaçu', 'Porangatu'],
    coords: [-49.15, -13.44],
  },
  {
    id: 'go-sudoeste',
    state: 'GO',
    name: 'GO Sudoeste',
    cities: ['Rio Verde', 'Jataí'],
    coords: [-50.92, -17.79],
  },
]

// Siglas de estados donde Crucianelli opera (para resaltar en el mapa).
export const operatingStates = new Set(['MT', 'GO', 'TO', 'BA'])

export const regionById = (id) => regions.find((r) => r.id === id)
