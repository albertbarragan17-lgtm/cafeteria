(function () {
  'use strict';

  var MODE_KEY = 'sy_mode_v1';
  var currentType = 'card';

  function init() {
    if (!window.SY_CART) return;
    var limit = document.getElementById('receipt-items-list');
    var cart = SY_CART.getCart();
    var t = SY_CART.totals(cart);

    var num = 'SY-' + String(Math.floor(10000 + Math.random() * 90000));
    document.getElementById('order-number').textContent = '#' + num;

    document.getElementById('receipt-count-label').textContent = 'Productos (' + t.itemCount + ')';
    document.getElementById('receipt-subtotal').textContent = SY_CART.money(t.subtotal);
    document.getElementById('receipt-discount').textContent = t.hasCoupon ? '-' + SY_CART.money(t.discount) : '$0.00';
    document.getElementById('receipt-tax').textContent = SY_CART.money(t.tax);
    document.getElementById('receipt-total').textContent = SY_CART.money(t.total);
    document.getElementById('pay-button-text').textContent = 'Confirmar y Pagar ' + SY_CART.money(t.total);
    document.getElementById('sinpe-amount').textContent = SY_CART.money(t.total);
    document.getElementById('pagomovil-amount').textContent = SY_CART.money(t.total);

    var mode = localStorage.getItem(MODE_KEY);
    var modeSummary = document.getElementById('mode-summary');
    if (mode === 'dinein') {
      modeSummary.textContent = 'Consumir en Local - Barra Sensorial';
    } else {
      modeSummary.textContent = 'Recoger en Tienda - Sede Centro';
    }

    if (limit) {
      if (cart.length === 0) {
        limit.innerHTML = '<p class="font-body-sm text-body-sm text-on-surface-variant py-2">Tu canasta está vacía.</p>';
        document.getElementById('pay-button').disabled = true;
        return;
      }
      limit.innerHTML = cart.map(function (item) {
        return (
          '<div class="flex items-center justify-between py-2 border-b border-outline-variant/20">' +
            '<div class="flex items-center gap-3">' +
              '<div class="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0">' +
                '<img class="w-full h-full object-cover" alt="' + item.alt + '" src="' + item.img + '">' +
              '</div>' +
              '<div>' +
                '<h4 class="font-title-md text-title-md text-on-surface leading-tight">' + item.qty + 'x ' + item.name + '</h4>' +
                '<p class="font-body-sm text-body-sm text-on-surface-variant">' + item.subtitle + '</p>' +
              '</div>' +
            '</div>' +
            '<span class="font-title-md text-title-md text-on-surface font-semibold shrink-0 ml-2">' + SY_CART.money(item.price * item.qty) + '</span>' +
          '</div>'
        );
      }).join('');
    }

    wirePaymentMethods();
    wireCardDetection();
    wireCopy();
    wireToggleReceipt();
    wirePay();
    if (window.SY_CART) SY_CART.updateBadge();
  }

  function wirePaymentMethods() {
    var cards = document.querySelectorAll('.payment-method-card');
    cards.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectPaymentMethod(btn);
      });
    });
  }

  function selectPaymentMethod(btn) {
    currentType = btn.getAttribute('data-type');

    document.querySelectorAll('.payment-method-card').forEach(function (card) {
      card.classList.remove('bg-surface-container', 'shadow-sm', 'active-payment');
      card.classList.add('bg-surface-container-low');
      var dot = card.querySelector('.status-dot');
      if (dot) dot.classList.add('hidden');
    });
    btn.classList.remove('bg-surface-container-low');
    btn.classList.add('bg-surface-container', 'shadow-sm', 'active-payment');
    var dot = btn.querySelector('.status-dot');
    if (dot) dot.classList.remove('hidden');

    ['card-details-section', 'wallet-info-section', 'bank-info-section', 'pagomovil-details-section'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    document.getElementById('pay-button-text').textContent = 'Confirmar y Pagar ' + SY_CART.money(SY_CART.totals().total);

    if (currentType === 'card') {
      document.getElementById('card-details-section').classList.remove('hidden');
    } else if (currentType === 'wallet') {
      document.getElementById('wallet-info-section').classList.remove('hidden');
      document.getElementById('pay-button-text').textContent = 'Continuar con Billetera Digital';
    } else if (currentType === 'bank') {
      document.getElementById('bank-info-section').classList.remove('hidden');
      document.getElementById('pay-button-text').textContent = 'Registrar Comprobante de Pago';
    } else if (currentType === 'pagomovil') {
      document.getElementById('pagomovil-details-section').classList.remove('hidden');
      document.getElementById('pay-button-text').textContent = 'Confirmar y Pagar ' + SY_CART.money(SY_CART.totals().total);
    }
  }

  function wireCardDetection() {
    var input = document.getElementById('card-number');
    if (!input) return;
    input.addEventListener('input', function () {
      var val = input.value.replace(/\D/g, '');
      var formatted = val.match(/.{1,4}/g) ? val.match(/.{1,4}/g).join(' ') : val;
      input.value = formatted;

      var visaBadge = document.getElementById('visa-badge');
      var mcBadge = document.getElementById('mc-badge');
      var amexBadge = document.getElementById('amex-badge');
      var icon = document.getElementById('detected-brand-icon');

      function resetAll() {
        visaBadge.className = 'px-2 py-0.5 rounded bg-surface-container-highest font-label-sm text-[11px] font-bold text-on-surface transition-all';
        mcBadge.className = 'px-2 py-0.5 rounded bg-surface-container-highest font-label-sm text-[11px] font-bold text-on-surface transition-all';
        amexBadge.className = 'px-2 py-0.5 rounded bg-surface-container-highest font-label-sm text-[11px] font-bold text-on-surface-variant transition-all';
      }
      function active(badge) {
        resetAll();
        badge.className = 'px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[11px] font-bold transition-all';
      }

      if (val.startsWith('4')) {
        active(visaBadge);
        icon.textContent = 'credit_card';
      } else if (val.startsWith('5')) {
        active(mcBadge);
        icon.textContent = 'credit_card';
      } else if (val.startsWith('3')) {
        active(amexBadge);
        icon.textContent = 'credit_score';
      } else {
        resetAll();
        icon.textContent = 'credit_card';
      }
    });
  }

  function wireCopy() {
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        var original = btn.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = '¡Copiado!';
            setTimeout(function () { btn.textContent = original; }, 1500);
          });
        } else {
          btn.textContent = '¡Copiado!';
          setTimeout(function () { btn.textContent = original; }, 1500);
        }
      });
    });
  }

  function wireToggleReceipt() {
    var btn = document.getElementById('receipt-toggle-btn');
    var list = document.getElementById('receipt-items-list');
    var icon = document.getElementById('toggle-icon');
    var label = document.getElementById('toggle-label');
    if (!btn || !list) return;
    btn.addEventListener('click', function () {
      if (list.classList.contains('hidden')) {
        list.classList.remove('hidden');
        icon.textContent = 'expand_less';
        label.textContent = 'Ver detalles';
      } else {
        list.classList.add('hidden');
        icon.textContent = 'expand_more';
        label.textContent = 'Mostrar ' + SY_CART.cartCount() + ' ítems';
      }
    });
  }

  function wirePay() {
    var payBtn = document.getElementById('pay-button');
    if (!payBtn) return;
    payBtn.addEventListener('click', function () {
      var cart = SY_CART.getCart();
      if (cart.length === 0) return;

      var name = (document.getElementById('checkout-name').value || '').trim();
      var phone = (document.getElementById('checkout-phone').value || '').trim();
      var email = (document.getElementById('checkout-email').value || '').trim();

      if (!name || !phone || !email) {
        validateField('checkout-name');
        validateField('checkout-phone');
        validateField('checkout-email');
        return;
      }

      if (currentType === 'card') {
        var num = document.getElementById('card-number').value.replace(/\D/g, '');
        if (num.length < 15) {
          highlight('card-number');
          return;
        }
      }

      var t = SY_CART.totals(cart);
      var order = {
        number: document.getElementById('order-number').textContent.replace('#', ''),
        mode: (localStorage.getItem(MODE_KEY) || 'pickup'),
        name: name,
        phone: phone,
        email: email,
        paymentType: currentType,
        paymentLabel: paymentLabel(currentType),
        items: cart,
        totals: {
          itemCount: t.itemCount,
          subtotal: t.subtotal,
          discount: t.discount,
          hasCoupon: t.hasCoupon,
          tax: t.tax,
          total: t.total
        }
      };

      payBtn.disabled = true;
      var originalHtml = payBtn.innerHTML;
      payBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[22px]">progress_activity</span><span>Cifrando y procesando pedido...</span>';

      setTimeout(function () {
        try {
          localStorage.setItem(SY_CART.orderKey, JSON.stringify(order));
        } catch (e) { /* fallo silencioso */ }

        payBtn.classList.remove('bg-primary-container', 'hover:bg-secondary');
        payBtn.classList.add('bg-secondary');
        payBtn.innerHTML = '<span class="material-symbols-outlined text-[22px]">check_circle</span><span>¡Pago Exitoso! Redirigiendo...</span>';
        SY_CART.clearCart();

        setTimeout(function () {
          window.location.href = 'confirmacion.html';
        }, 1400);
      }, 1600);
    });
  }

  function paymentLabel(type) {
    if (type === 'card') return 'Tarjeta Crédito / Débito';
    if (type === 'wallet') return 'Billetera Digital (Apple/Google Pay)';
    if (type === 'bank') return 'Sinpe Móvil / Bizum';
    if (type === 'pagomovil') return 'Pago Móvil';
    return type;
  }

  function validateField(id) {
    var el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.classList.add('ring-2', 'ring-error/60', 'bg-error-container/20');
      setTimeout(function () {
        el.classList.remove('ring-2', 'ring-error/60', 'bg-error-container/20');
      }, 2200);
    }
  }

  function highlight(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.add('ring-2', 'ring-error/60');
      setTimeout(function () {
        el.classList.remove('ring-2', 'ring-error/60');
      }, 2200);
    }
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();