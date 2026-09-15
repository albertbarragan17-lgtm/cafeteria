(function () {
  'use strict';

  var MODE_KEY = 'sy_mode_v1';

  function itemRow(item) {
    var metaClass = 'bg-primary/80 text-on-primary';
    if (item.meta === 'Horno') metaClass = 'bg-secondary/90 text-on-secondary';
    else if (item.meta === 'Microlote') metaClass = 'bg-primary-container text-primary-fixed';
    else if (item.meta === 'Brunch') metaClass = 'bg-tertiary-container/90 text-tertiary-fixed';

    return (
      '<article class="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-space-lg bg-surface-container-low rounded-xl shadow-sm hover:shadow-md transition-all gap-space-md group" id="item-row-' + item.id + '">' +
        '<div class="flex items-center gap-space-md min-w-0">' +
          '<div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 shadow-sm">' +
            '<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="' + item.alt + '" src="' + item.img + '">' +
            '<span class="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full ' + metaClass + ' font-label-sm text-[10px] tracking-wide uppercase">' + item.meta + '</span>' +
          '</div>' +
          '<div class="flex flex-col min-w-0">' +
            '<div class="flex items-baseline gap-2">' +
              '<h2 class="font-headline-sm text-headline-sm text-primary truncate">' + item.name + '</h2>' +
            '</div>' +
            '<p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">' + item.subtitle + '</p>' +
            '<span class="font-label-sm text-label-sm text-on-surface-variant/80 mt-2">' + SY_CART.money(item.price) + ' c/u</span>' +
          '</div>' +
        '</div>' +
        '<div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-space-sm pt-space-xs sm:pt-0 border-t sm:border-t-0 border-outline-variant/30 flex-shrink-0">' +
          '<div class="text-right">' +
            '<span class="font-title-lg text-title-lg font-bold text-primary" id="item-subtotal-' + item.id + '">' + SY_CART.money(item.price * item.qty) + '</span>' +
          '</div>' +
          '<div class="flex items-center gap-space-xs">' +
            '<div class="flex items-center bg-surface-container rounded-lg p-1 shadow-sm">' +
              '<button aria-label="Disminuir cantidad" class="w-7 h-7 rounded flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors" data-act="minus" data-id="' + item.id + '" type="button">' +
                '<span class="material-symbols-outlined text-[16px]">remove</span>' +
              '</button>' +
              '<span class="w-8 text-center font-title-md text-title-md text-on-surface font-semibold" id="qty-val-' + item.id + '">' + item.qty + '</span>' +
              '<button aria-label="Aumentar cantidad" class="w-7 h-7 rounded flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors" data-act="plus" data-id="' + item.id + '" type="button">' +
                '<span class="material-symbols-outlined text-[16px]">add</span>' +
              '</button>' +
            '</div>' +
            '<button aria-label="Eliminar ' + item.name + '" class="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-all" data-act="remove" data-id="' + item.id + '" type="button">' +
              '<span class="material-symbols-outlined text-[20px]">delete</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function emptyState() {
    return (
      '<div class="p-space-xl text-center bg-surface-container-low rounded-xl flex flex-col items-center justify-center gap-2">' +
        '<span class="material-symbols-outlined text-[48px] text-on-surface-variant/40">remove_shopping_cart</span>' +
        '<p class="font-headline-sm text-headline-sm text-on-surface">Tu canasta está vacía</p>' +
        '<p class="font-body-sm text-body-sm text-on-surface-variant">Explora nuestro menú para degustar cafés de origen y panadería viva.</p>' +
        '<a href="index.html#menu" class="mt-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md">Explorar Carta de Cafés</a>' +
      '</div>'
    );
  }

  function render() {
    var container = document.getElementById('cart-items-container');
    var cart = SY_CART.getCart();
    var t = SY_CART.totals(cart);

    var counterLabel = document.getElementById('cart-counter-label');
    if (counterLabel) counterLabel.textContent = t.itemCount === 1 ? '1 producto en tu canasta' : t.itemCount + ' productos en tu canasta';

    if (container) {
      container.innerHTML = cart.length ? cart.map(itemRow).join('') : emptyState();
    }

    document.getElementById('summary-items-label').textContent = 'Subtotal productos (' + t.itemCount + ' ' + (t.itemCount === 1 ? 'ítem' : 'ítems') + ')';
    document.getElementById('summary-subtotal').textContent = SY_CART.money(t.subtotal);
    document.getElementById('summary-discount').textContent = t.hasCoupon ? '-' + SY_CART.money(t.discount) : '$0.00';
    document.getElementById('summary-tax').textContent = SY_CART.money(t.tax);
    document.getElementById('summary-total').textContent = SY_CART.money(t.total);

    var couponApplied = document.getElementById('coupon-applied');
    if (couponApplied) {
      if (t.hasCoupon) {
        couponApplied.classList.remove('hidden');
        couponApplied.classList.add('flex');
      } else {
        couponApplied.classList.add('hidden');
        couponApplied.classList.remove('flex');
      }
    }
    SY_CART.updateBadge();
  }

  function wireItems() {
    var container = document.getElementById('cart-items-container');
    if (!container) return;
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-act]');
      if (!btn) return;
      var act = btn.getAttribute('data-act');
      var id = btn.getAttribute('data-id');
      if (act === 'plus') {
        SY_CART.updateQty(id, 1);
        render();
      } else if (act === 'minus') {
        SY_CART.updateQty(id, -1);
        render();
      } else if (act === 'remove') {
        var row = document.getElementById('item-row-' + id);
        if (row) {
          row.style.opacity = '0';
          row.style.transform = 'translateY(-10px)';
          row.style.transition = 'all 0.3s ease';
          setTimeout(function () {
            SY_CART.removeItem(id);
            render();
          }, 250);
        } else {
          SY_CART.removeItem(id);
          render();
        }
      }
    });
  }

  function wireCoupon() {
    var applyBtn = document.getElementById('coupon-apply');
    var input = document.getElementById('coupon-code');
    var error = document.getElementById('coupon-error');
    var removeBtn = document.getElementById('coupon-remove');

    function apply() {
      var code = (input.value || '').trim().toUpperCase();
      if (code === 'ORIGEN10') {
        SY_CART.setCoupon(code);
        if (error) error.classList.add('hidden');
        render();
      } else {
        if (error) error.classList.remove('hidden');
      }
    }

    if (applyBtn) applyBtn.addEventListener('click', apply);
    if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') apply(); });
    if (removeBtn) removeBtn.addEventListener('click', function () {
      SY_CART.setCoupon('');
      render();
    });
  }

  function wireMode() {
    var pickupBtn = document.getElementById('tab-pickup');
    var dineinBtn = document.getElementById('tab-dinein');
    var detailText = document.getElementById('mode-detail-text');

    function setMode(mode) {
      localStorage.setItem(MODE_KEY, mode);
      if (mode === 'pickup') {
        pickupBtn.className = 'flex flex-col items-center justify-center py-2.5 px-2 rounded-md font-label-md text-label-md transition-all bg-primary text-on-primary shadow-sm font-semibold';
        dineinBtn.className = 'flex flex-col items-center justify-center py-2.5 px-2 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all font-medium';
        detailText.textContent = 'Sucursal: Sierra Yara Centro (Calle de la Candelaria 45)';
      } else {
        dineinBtn.className = 'flex flex-col items-center justify-center py-2.5 px-2 rounded-md font-label-md text-label-md transition-all bg-primary text-on-primary shadow-sm font-semibold';
        pickupBtn.className = 'flex flex-col items-center justify-center py-2.5 px-2 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all font-medium';
        detailText.textContent = 'Mesa asignada al llegar o servicio en Barra Sensorial';
      }
    }

    if (pickupBtn) pickupBtn.addEventListener('click', function () { setMode('pickup'); });
    if (dineinBtn) dineinBtn.addEventListener('click', function () { setMode('dinein'); });

    var saved = localStorage.getItem(MODE_KEY);
    if (saved === 'dinein') setMode('dinein');
    else setMode('pickup');
  }

  var checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', function () {
    if (SY_CART.cartCount() === 0) {
      checkoutBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">info</span><span>Tu canasta está vacía</span>';
      setTimeout(function () {
        checkoutBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] text-primary-fixed-dim group-hover:rotate-12 transition-transform">lock</span><span>Proceder al Pago</span><span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>';
      }, 1600);
      return;
    }
    window.location.href = 'checkout.html';
  });

  window.clearCart = function () {
    SY_CART.clearCart();
    render();
  };

  function init() {
    if (!window.SY_CART) return;
    var couponInput = document.getElementById('coupon-code');
    if (couponInput && SY_CART.getCoupon()) couponInput.value = SY_CART.getCoupon();
    wireItems();
    wireCoupon();
    wireMode();
    render();
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();