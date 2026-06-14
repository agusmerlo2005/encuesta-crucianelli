// Esquema del formulario de relevamiento para ensayo / demostración de sembradora.
// Basado en la planilla oficial de Crucianelli. Editá acá para sumar/quitar campos.
//
// Tipos soportados: 'text' | 'number' | 'textarea' | 'select' | 'date'
// Cada label/option tiene versión pt (Brasil) y es (rioplatense).

// Opciones reutilizables
const SINO = [
  { value: 'Sim', pt: 'Sim', es: 'Sí' },
  { value: 'Nao', pt: 'Não', es: 'No' },
]

export const formSchema = [
  {
    id: 'contact',
    title: { pt: 'Seus dados', es: 'Tus datos' },
    note: { pt: 'Para entrarmos em contato.', es: 'Para poder contactarte.' },
    fields: [
      { key: 'name', type: 'text', required: true, label: { pt: 'Nome completo', es: 'Nombre completo' } },
      { key: 'farm', type: 'text', label: { pt: 'Fazenda / Empresa', es: 'Establecimiento / Empresa' } },
      { key: 'phone', type: 'text', required: true, label: { pt: 'WhatsApp / Telefone', es: 'WhatsApp / Teléfono' } },
      { key: 'email', type: 'text', label: { pt: 'E-mail', es: 'E-mail' } },
    ],
  },
  {
    id: 'machine',
    title: { pt: 'Plantadeira (configuração)', es: 'Sembradora (configuración)' },
    fields: [
      { key: 'cantLineas', type: 'number', label: { pt: 'Quantidade de linhas', es: 'Cantidad de líneas' } },
      { key: 'separacion', type: 'number', label: { pt: 'Espaçamento (cm)', es: 'Separación (cm)' } },
      { key: 'anchoTpte', type: 'text', label: { pt: 'Largura de transporte', es: 'Ancho de transporte' } },
    ],
  },
  {
    id: 'productos',
    title: { pt: 'Produtos a aplicar', es: 'Productos a aplicar' },
    fields: [
      { key: 'cultivo', type: 'text', label: { pt: 'Cultura a semear (semente)', es: 'Cultivo a sembrar (semilla)' } },
      {
        key: 'tratamientoSemilla',
        type: 'text',
        label: { pt: 'Tratamento da semente (curada, peletizada, etc)', es: 'Tratamiento de la semilla (curado, peleteado, etc)' },
      },
      { key: 'dosisSiembra', type: 'text', label: { pt: 'Dose de semeadura (g/m ou kg/ha)', es: 'Dosis de siembra (gr/mt o kg/ha)' } },
      { key: 'fertilizante', type: 'text', label: { pt: 'Fertilizante a aplicar (nome)', es: 'Fertilizante a aplicar (nombre)' } },
      { key: 'dosisFertilizacion', type: 'text', label: { pt: 'Dose de fertilização (kg/ha)', es: 'Dosis de fertilización (kg/ha)' } },
      { key: 'aplicaInoculante', type: 'select', options: SINO, label: { pt: 'Aplicação de inoculante', es: 'Aplicación de inoculante' } },
      { key: 'dosisInoculante', type: 'text', label: { pt: 'Dose de inoculante (L/ha)', es: 'Dosis de inoculante (Lt/ha)' } },
      { key: 'siembraBrachiaria', type: 'text', label: { pt: 'Semeadura de braquiária (Sim - Não - Dose)', es: 'Siembra de brachiaria (Sí - No - Dosis)' } },
      { key: 'velocidadTrabajo', type: 'number', label: { pt: 'Velocidade de trabalho habitual (km/h)', es: 'Velocidad de trabajo habitual (Km/h)' } },
    ],
  },
  {
    id: 'lote',
    title: { pt: 'Lote / Talhão a semear', es: 'Lote a sembrar' },
    fields: [
      { key: 'cantidadHas', type: 'number', label: { pt: 'Quantidade de hectares', es: 'Cantidad de hectáreas' } },
      {
        key: 'ventanaSiembra',
        type: 'text',
        label: { pt: 'Janela de semeadura (início e fim - estimada)', es: 'Ventana de siembra (inicio y fin - estimada)' },
      },
      { key: 'cultivoAntecesor', type: 'text', label: { pt: 'Cultura antecessora (palhada)', es: 'Cultivo antecesor (rastrojo)' } },
      {
        key: 'desniveles',
        type: 'select',
        label: { pt: 'Desníveis', es: 'Desniveles' },
        options: [
          { value: 'Grandes', pt: 'Grandes', es: 'Grandes' },
          { value: 'Medianos', pt: 'Médios', es: 'Medianos' },
          { value: 'Chicos', pt: 'Pequenos', es: 'Chicos' },
        ],
      },
      {
        key: 'obstaculos',
        type: 'text',
        label: { pt: 'Obstáculos no terreno (pedras, tosca, paus, etc)', es: 'Obstáculos en el terreno (piedras, tosca, palos, etc)' },
      },
      {
        key: 'humedadSuelo',
        type: 'select',
        label: { pt: 'Umidade do solo', es: 'Humedad del suelo' },
        options: [
          { value: 'Barro', pt: 'Barro', es: 'Barro' },
          { value: 'Optimo', pt: 'Ótimo', es: 'Óptimo' },
          { value: 'Seco', pt: 'Seco', es: 'Seco' },
        ],
      },
      { key: 'riegoArtificial', type: 'select', options: SINO, label: { pt: 'Possui irrigação artificial', es: 'Posee riego artificial' } },
      {
        key: 'estadoCaminos',
        type: 'select',
        label: { pt: 'Estado das estradas de acesso', es: 'Estado de los caminos de acceso' },
        options: [
          { value: 'Bueno', pt: 'Bom', es: 'Bueno' },
          { value: 'Regular', pt: 'Regular', es: 'Regular' },
          { value: 'Malo', pt: 'Ruim', es: 'Malo' },
        ],
      },
      { key: 'siembraConsociada', type: 'select', options: SINO, label: { pt: 'Semeadura consorciada (braquiária)', es: 'Siembra de consociada (brachiaria)' } },
    ],
  },
  {
    id: 'tractor',
    title: { pt: 'Trator disponível', es: 'Tractor disponible' },
    fields: [
      { key: 'tractorMarca', type: 'text', label: { pt: 'Marca', es: 'Marca' } },
      { key: 'tractorModelo', type: 'text', label: { pt: 'Modelo', es: 'Modelo' } },
      { key: 'potencia', type: 'number', label: { pt: 'Potência (HP)', es: 'Potencia (HP)' } },
      { key: 'caudalHidraulico', type: 'number', label: { pt: 'Vazão hidráulica total (L/min)', es: 'Caudal hidráulico total (Lt/min)' } },
      { key: 'cantVcr', type: 'number', label: { pt: 'Quantidade de VCR (válvulas remotas)', es: 'Cantidad de VCR (válvulas de control remoto)' } },
      { key: 'conexionLs', type: 'select', options: SINO, label: { pt: 'Conexão LS (Load Sensing)', es: 'Conexión LS (Load Sensing)' } },
      { key: 'piloto', type: 'text', label: { pt: 'Piloto (marca, modelo, tipo de sinal)', es: 'Piloto (marca, modelo, tipo señal)' } },
      {
        key: 'tomaFuerza',
        type: 'select',
        label: { pt: 'Tomada de força (TDF)', es: 'Toma de fuerza (TDF)' },
        options: [
          { value: '540', pt: '540', es: '540' },
          { value: '1000', pt: '1000', es: '1000' },
        ],
      },
      {
        key: 'tipoEstria',
        type: 'select',
        label: { pt: 'Tipo de estria', es: 'Tipo de estría' },
        options: [
          { value: 'Z=6', pt: 'Z=6', es: 'Z=6' },
          { value: 'Z=20 d.44mm', pt: 'Z=20 d.44mm', es: 'Z=20 d.44mm' },
          { value: 'Z=21 d.35mm', pt: 'Z=21 d.35mm', es: 'Z=21 d.35mm' },
        ],
      },
      { key: 'diametroPerno', type: 'text', label: { pt: 'Diâmetro do pino de engate (mm)', es: 'Diámetro perno de enganche (mm)' } },
    ],
  },
]

// Lista plana de keys, en orden, para construir el payload y las columnas del Sheet.
export const allFieldKeys = formSchema.flatMap((s) => s.fields.map((f) => f.key))
