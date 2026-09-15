(function () {
  'use strict';

  var FALLBACK_NUMBER = 'SY-84920';

  function getOrder() {
    try {
      var raw = localStorage.getItem(window.SY_CART.orderKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function buildFallback() {
    var cart = [];
    var sampleIds = ['flat-white', 'croissant-almendras', 'geisha-250g'];
    sampleIds.forEach(function (id) {
      var p = window.SY_CART.products[id];
      if (p) {
        cart.push({
          id: p.id,
          name: p.name,
          subtitle: p.subtitle,
          price: p.price,
          img: p.img,
          alt: p.alt,
          meta: p.meta,
          options: [],
          qty: 2
        });
      }
    });
    var t = window.SY_CART.totals(cart);
    return {
      number: FALLBACK_NUMBER,
      mode: 'pickup',
      name: 'Cliente de Origen',
      phone: '+506 8888 8888',
      email: 'cliente@sierrayara.com',
      paymentType: 'card',
      paymentLabel: 'Tarjeta Crédito / Débito',
      items: cart,
      totals: t
    };
  }

  function init() {
    if (!window.SY_CART) return;
    var order = getOrder() || buildFallback();
    var t = order.totals || { itemCount: 0, subtotal: 0, discount: 0, tax: 0, total: 0 };

    setText('hero-order-number', '#' + order.number.replace(/^#/, ''));
    setText('qr-order-number', order.number.replace(/^#/, ''));
    setText('conf-item-count', t.itemCount + ' Productos');
    setText('conf-subtotal', window.SY_CART.money(t.subtotal));
    setText('conf-tax', window.SY_CART.money(t.tax));
    setText('conf-total', window.SY_CART.money(t.total));

    var discRow = document.getElementById('conf-discount-row');
    var discVal = document.getElementById('conf-discount');
    if (discVal) discVal.textContent = '-' + window.SY_CART.money(t.discount);
    if (discRow) {
      if (Number(t.discount) > 0) {
        discRow.classList.remove('hidden');
      } else {
        discRow.classList.add('hidden');
      }
    }

    setText('conf-payment', order.paymentLabel || 'Pago aprobado');

    if (order.mode === 'dinein') {
      setText('pickup-title', 'Sierra Yara - Barra Sensorial');
    } else {
      setText('pickup-title', 'Sierra Yara - Centro Histórico');
    }

    var list = document.getElementById('conf-items-list');
    if (list) {
      list.innerHTML = (order.items || []).map(function (item) {
        return (
          '<div class="flex items-start justify-between gap-3">' +
            '<div class="flex items-center gap-3 min-w-0">' +
              '<div class="w-11 h-11 rounded-lg bg-surface-container overflow-hidden shrink-0">' +
                '<img class="w-full h-full object-cover" alt="' + (item.alt || item.name) + '" src="' + item.img + '">' +
              '</div>' +
              '<div class="min-w-0">' +
                '<p class="font-title-sm text-title-sm text-on-surface leading-tight truncate">' + item.qty + 'x ' + item.name + '</p>' +
                '<p class="font-body-xs text-body-xs text-on-surface-variant truncate">' + item.subtitle + '</p>' +
              '</div>' +
            '</div>' +
            '<span class="font-title-sm text-title-sm text-on-surface font-semibold shrink-0">' + window.SY_CART.money(item.price * item.qty) + '</span>' +
          '</div>'
        );
      }).join('') || '<p class="font-body-sm text-body-sm text-on-surface-variant">Sin productos registrados.</p>';
    }

    wireReceiptButton();
    simulateLiveStatus();
    if (window.SY_CART.updateBadge) window.SY_CART.updateBadge();
  }

  function wireReceiptButton() {
    var btn = document.getElementById('btnReceipt');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var original = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">task_alt</span><span>Generando PDF de ejemplo...</span>';
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">download</span><span>Descargar Recibo / Factura en PDF</span>';
        btn.disabled = false;
      }, 1600);
    });
  }

  function simulateLiveStatus() {
    var progress = document.getElementById('step-progress');
    var stepReadyWrap = document.getElementById('step-ready');
    var statusText = document.getElementById('live-status-text');
    if (!progress) return;

    setTimeout(function () { progress.style.width = '92%'; }, 2200);
    setTimeout(function () {
      progress.style.width = '100%';
      if (statusText) statusText.textContent = 'Espresso Servido · Listo para Recoger';
    }, 4800);
    setTimeout(function () {
      if (stepReadyWrap) {
        var circle = stepReadyWrap.querySelector('.w-10.h-10');
        if (circle) {
          circle.className = 'w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 z-10 shadow-sm';
          circle.innerHTML = '<span class="material-symbols-outlined text-[20px]">check</span>';
        }
        var label = stepReadyWrap.querySelector('.font-title-md');
        if (label) label.classList.remove('opacity-70');
        var wrapText = stepReadyWrap;
        wrapText.classList.remove('opacity-70');
        var time = stepReadyWrap.querySelector('.font-label-sm');
        if (time) time.className = 'font-label-sm text-label-sm text-on-surface-variant';
      }
      if (statusText) statusText.textContent = 'Todo Listo';
      var pill = document.querySelector('.w-2.h-2.rounded-full.bg-secondary');
      if (pill) pill.classList.remove('bg-secondary');
    }, 7200);
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();