// script.js

(() => {
  // Constantes
  const I_REF = 1e-12;
  const MIN_I = I_REF; // 1e-12
  const MAX_I = 1;     // según lo pedido

  // Elementos del DOM
  const form = document.getElementById('nis-form');
  const input = document.getElementById('intensity');
  const btn = document.getElementById('calculate');
  const message = document.getElementById('message');
  const result = document.getElementById('result');

  // Helpers
  function clearMessages() {
    message.textContent = '';
    result.textContent = '';
    message.className = '';
    result.className = 'result';
  }

  function showError(text) {
    message.textContent = text;
    message.className = 'error';
    result.textContent = '';
  }

  function showResult(dbValue) {
    result.textContent = `Su NIS es de: ${dbValue} dB`;
    result.className = 'result success';
  }

  function parseInput(value) {
    // Permitir notación científica como "1e-6", coma decimal, o punto.
    const normalized = value.trim().replace(',', '.');
    if (normalized === '') return null;
    // Rechazamos claramente entradas con letras mezcladas (ej: "1e-6x")
    // Pero aceptamos la "e" de notación científica; comprobamos con Number()
    const num = Number(normalized);
    if (!Number.isFinite(num)) return NaN;
    return num;
  }

  function formatDb(db) {
    // 2 decimales, quitar ceros inútiles
    return Number.isFinite(db) ? parseFloat(db.toFixed(2)).toString() : db.toString();
  }

  // Validación y cálculo
  function validateAndCalculate() {
    clearMessages();

    const raw = input.value;
    if (raw.trim() === '') {
      showError('Ingrese nivel de potencia (I).');
      input.focus();
      return;
    }

    const value = parseInput(raw);

    if (Number.isNaN(value)) {
      showError('Entrada inválida: ingrese sólo un número (se permite notación científica, por ejemplo 1e-6).');
      input.focus();
      return;
    }

    if (value < MIN_I) {
      showError(`El valor no puede ser menor que ${MIN_I} (1×10⁻¹²).`);
      input.focus();
      return;
    }

    if (value > MAX_I) {
      showError(`El valor no puede ser mayor que ${MAX_I}.`);
      input.focus();
      return;
    }

    // Cálculo: NIS = 10 * log10( I / I_ref )
    const nis = 10 * Math.log10(value / I_REF);
    const nisFormatted = formatDb(nis);
    showResult(nisFormatted);
  }

  // Eventos
  btn.addEventListener('click', validateAndCalculate);

  // Permitimos 'Enter' en el input para calcular
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateAndCalculate();
    }
  });

  // Validación en vivo básica (evita letras completas y muestra sugerencia)
  input.addEventListener('input', () => {
    const v = input.value;
    // Si hay letras que no forman parte de notación científica permitida -> marcar
    // Permitimos dígitos, ., ,, +, -, e, E, espacios
    const allowedPattern = /^[0-9eE+\-.,\s]*$/;
    if (!allowedPattern.test(v)) {
      message.textContent = 'Caracteres inválidos detectados (sólo números y notación científica permitida).';
      message.className = 'error';
    } else {
      message.textContent = '';
      message.className = '';
    }
  });

})();
