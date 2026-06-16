/**
 * Crucianelli · Demonstração de Plantio
 * Web App de Google Apps Script que recibe las solicitudes del formulario
 * y las escribe en una hoja de Google Sheets.
 *
 * Cómo usarlo: ver apps-script/README-deploy.md
 *
 * El script es GENÉRICO: si llegan campos nuevos, crea la columna sola.
 * El orden preferido de columnas está en COLUMN_ORDER; cualquier campo
 * extra se agrega al final automáticamente.
 */

// Nombre de la pestaña donde se guardan las respuestas.
var SHEET_NAME = 'Respostas';

// Orden preferido de columnas (deben coincidir con las keys del payload del form).
var COLUMN_ORDER = [
  'submittedAt',
  // Contato
  'name', 'farm', 'phone', 'email', 'machine', 'region', 'city',
  // Plantadeira
  'cantLineas', 'separacion', 'anchoTpte',
  // Produtos a aplicar
  'cultivo', 'tratamientoSemilla', 'dosisSiembra', 'fertilizante', 'dosisFertilizacion',
  'aplicaInoculante', 'dosisInoculante', 'velocidadTrabajo',
  // Lote / Talhão
  'cantidadHas', 'ventanaSiembraInicio', 'ventanaSiembraFin', 'cultivoAntecesor', 'desniveles', 'obstaculos',
  'humedadSuelo', 'riegoArtificial', 'estadoCaminos', 'siembraConsociada',
  // Trator
  'tractorMarca', 'tractorModelo', 'potencia', 'caudalHidraulico', 'cantVcr',
  'conexionLs', 'piloto', 'tomaFuerza', 'tipoEstria', 'diametroPerno',
  'lang',
];

// Etiquetas "lindas" para la fila de encabezado (opcional; si falta, usa la key).
var COLUMN_LABELS = {
  submittedAt: 'Data/Hora',
  name: 'Nome',
  farm: 'Fazenda / Empresa',
  phone: 'WhatsApp / Telefone',
  email: 'E-mail',
  machine: 'Plantadeira',
  region: 'Região',
  city: 'Cidade',
  // Plantadeira
  cantLineas: 'Nº de linhas',
  separacion: 'Espaçamento (cm)',
  anchoTpte: 'Largura de transporte',
  // Produtos
  cultivo: 'Cultura (semente)',
  tratamientoSemilla: 'Tratamento da semente',
  dosisSiembra: 'Dose de semeadura',
  fertilizante: 'Fertilizante (nome)',
  dosisFertilizacion: 'Dose de fertilização (kg/ha)',
  aplicaInoculante: 'Aplica inoculante',
  dosisInoculante: 'Dose de inoculante (L/ha)',
  velocidadTrabajo: 'Velocidade de trabalho (km/h)',
  // Lote
  cantidadHas: 'Hectares a plantar',
  ventanaSiembraInicio: 'Janela de semeadura — início',
  ventanaSiembraFin: 'Janela de semeadura — fim',
  cultivoAntecesor: 'Cultura antecessora',
  desniveles: 'Desníveis',
  obstaculos: 'Obstáculos no terreno',
  humedadSuelo: 'Umidade do solo',
  riegoArtificial: 'Irrigação artificial',
  estadoCaminos: 'Estado das estradas',
  siembraConsociada: 'Semeadura consorciada',
  // Trator
  tractorMarca: 'Trator - Marca',
  tractorModelo: 'Trator - Modelo',
  potencia: 'Potência (HP)',
  caudalHidraulico: 'Vazão hidráulica (L/min)',
  cantVcr: 'Qtd. VCR',
  conexionLs: 'Conexão LS',
  piloto: 'Piloto',
  tomaFuerza: 'Tomada de força (TDF)',
  tipoEstria: 'Tipo de estria',
  diametroPerno: 'Diâmetro do pino (mm)',
  lang: 'Idioma',
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var data = parseBody_(e);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Formateamos la fecha/hora a la zona horaria de la planilla, sin la "Z" de UTC.
    var tz = ss.getSpreadsheetTimeZone();
    var when = data.submittedAt ? new Date(data.submittedAt) : new Date();
    data.submittedAt = Utilities.formatDate(when, tz, 'dd/MM/yyyy HH:mm:ss');

    // Determina las columnas: las del header actual + cualquier key nueva del payload.
    var headers = getOrInitHeaders_(sheet, data);

    // Arma la fila respetando el orden de columnas.
    var row = headers.map(function (key) {
      var v = data[key];
      return v === undefined || v === null ? '' : v;
    });
    sheet.appendRow(row);
    // Alineamos a la izquierda la fila recién agregada (números/fechas incluidos).
    sheet.getRange(sheet.getLastRow(), 1, 1, row.length).setHorizontalAlignment('left');

    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Permite probar el deploy abriendo la URL en el navegador.
function doGet() {
  return jsonOut_({ ok: true, msg: 'Crucianelli demo endpoint ativo' });
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (_) {
      // Si vino como form-urlencoded
      return e.parameter || {};
    }
  }
  return (e && e.parameter) || {};
}

function getOrInitHeaders_(sheet, data) {
  var lastCol = sheet.getLastColumn();
  var existing = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  // Mapeamos las keys reales guardadas en una fila "técnica" oculta no es necesario:
  // usamos COLUMN_ORDER como fuente de verdad de las keys.
  var keys = existing.length && sheet.getLastRow() > 0 ? readKeyRow_(sheet) : [];

  if (!keys.length) {
    // Primera vez: armamos el header con COLUMN_ORDER + keys nuevas del payload.
    keys = COLUMN_ORDER.slice();
    Object.keys(data).forEach(function (k) {
      if (keys.indexOf(k) === -1) keys.push(k);
    });
    writeHeader_(sheet, keys);
    return keys;
  }

  // Ya existe: agregamos al final cualquier key nueva que no estuviera.
  var changed = false;
  Object.keys(data).forEach(function (k) {
    if (keys.indexOf(k) === -1) {
      keys.push(k);
      changed = true;
    }
  });
  if (changed) writeHeader_(sheet, keys);
  return keys;
}

// Guardamos las keys reales en una nota de la celda A1 para poder mapear bien
// aunque los encabezados visibles usen etiquetas bonitas.
function readKeyRow_(sheet) {
  var note = sheet.getRange(1, 1).getNote();
  if (note) {
    try {
      return JSON.parse(note);
    } catch (_) {}
  }
  // Fallback: usa los encabezados visibles como keys.
  var lastCol = sheet.getLastColumn();
  return lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
}

function writeHeader_(sheet, keys) {
  var labels = keys.map(function (k) {
    return COLUMN_LABELS[k] || k;
  });
  sheet.getRange(1, 1, 1, keys.length).setValues([labels]);
  // Guardamos las keys reales como nota en A1 para mapear futuros payloads.
  sheet.getRange(1, 1).setNote(JSON.stringify(keys));
  // Estilo del header.
  sheet
    .getRange(1, 1, 1, keys.length)
    .setBackground('#e30613')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('left');
  sheet.setFrozenRows(1);
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
