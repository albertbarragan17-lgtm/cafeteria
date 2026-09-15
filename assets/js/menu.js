(function () {
  'use strict';

  var DESCRIPTIONS = {
    'flat-white': 'Notas a chocolate amargo y avellanas tostadas con leche texturizada sedosa al vapor.',
    'pistachio-latte': 'Espresso doble, sirope casero de pistacho orgánico y leche de avena con hielo cristalino.',
    'croissant-almendras': 'Masa hojaldrada con mantequilla normanda pura, relleno de frangipane y almendras tostadas crujientes.',
    'geisha-250g': 'Tueste medio, notas florales de jazmín silvestre y bergamota con acidez cítrica brillante y final prolongado.',
    'cold-brew-nitro': 'Infusión en frío lenta con nitrógeno activo para textura sedosa tipo stout y notas pronunciadas de caramelo tostado.',
    'toston-aguacate': 'Pan campesino fermentado durante 48 hrs, puré fresco de aguacate hass, huevo pochado de campo y semillas de cáñamo.'
  };

  var TAG_CLASSES = {
    'Pistacho Real': ['bg-secondary-container', 'text-on-secondary-container'],
    'Jazmín': ['bg-tertiary-fixed', 'text-on-tertiary-fixed', 'font-semibold'],
    'Nitro Stout': ['bg-secondary-container', 'text-on-secondary-container']
  };

  var ORDER = [
    'flat-white',
    'pistachio-latte',
    'croissant-almendras',
    'geisha-250g',
    'cold-brew-nitro',
    'toston-aguacate'
  ];

  function cardHTML(id) {
    var p = window.SY_CART.products[id];
    if (!p) return '';
    var desc = DESCRIPTIONS[id] || '';
    var badge = p.badge
      ? '<span class="absolute top-3 left-3 ' + p.badgeClass + ' font-label-sm text-label-sm px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">' + p.badge + '</span>'
      : '';
    var tags = p.tags.map(function (t) {
      var extra = (TAG_CLASSES[t] || []).join(' ');
      return '<span class="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant ' + extra + '">' + t + '</span>';
    }).join('');
    return (
      '<article class="product-card group flex flex-col justify-between bg-surface-container-low hover:bg-surface-container rounded-xl overflow-hidden p-space-md shadow-sm hover:shadow-md transition-all duration-300" data-category="' + p.category + '">' +
        '<div class="flex flex-col">' +
          '<div class="relative w-full aspect-square rounded-lg overflow-hidden mb-space-md bg-surface-container-high">' +
            '<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="' + p.alt + '" src="' + p.img + '">' +
            badge +
          '</div>' +
          '<div class="flex items-start justify-between gap-space-xs mb-1">' +
            '<h2 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container transition-colors">' + p.name + '</h2>' +
          '</div>' +
          '<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed line-clamp-2 mb-space-sm">' + desc + '</p>' +
          '<div class="flex flex-wrap gap-1.5 mb-space-md">' + tags + '</div>' +
        '</div>' +
        '<div class="flex items-center justify-between pt-space-sm border-t border-outline-variant/20 mt-auto">' +
          '<div class="flex flex-col">' +
            '<span class="font-label-sm text-label-sm text-on-surface-variant">Precio</span>' +
            '<span class="font-title-lg text-title-lg font-bold text-on-surface">' + SY_CART.money(p.price) + '</span>' +
          '</div>' +
          '<button class="add-to-cart-btn flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-secondary transition-colors shadow-sm active:scale-95" type="button" data-id="' + id + '">' +
            '<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>' +
            '<span>Agregar al Carrito</span>' +
          '</button>' +
        '</div>' +
      '</article>'
    );
  }

  function init() {
    var grid = document.getElementById('product-grid');
    if (!grid || !window.SY_CART) return;

    grid.innerHTML = ORDER.map(cardHTML).join('');

    var categoryButtons = document.querySelectorAll('.category-btn');
    var productCards = document.querySelectorAll('.product-card');

    categoryButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        categoryButtons.forEach(function (b) {
          b.classList.remove('bg-secondary', 'text-on-secondary', 'shadow-sm');
          b.classList.add('bg-surface-container', 'text-on-surface');
        });
        btn.classList.add('bg-secondary', 'text-on-secondary', 'shadow-sm');
        btn.classList.remove('bg-surface-container', 'text-on-surface');

        var filter = btn.getAttribute('data-filter');
        productCards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    var cartButtons = document.querySelectorAll('.add-to-cart-btn');
    var toast = document.getElementById('cart-toast');
    var toastTitle = document.getElementById('toast-title');
    var toastSubtitle = document.getElementById('toast-subtitle');
    var toastTimeout;

    cartButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-id');
        SY_CART.addProduct(id);

        var itemTitle = button.closest('.product-card').querySelector('h2').textContent.trim();
        var originalHtml = button.innerHTML;
        var originalClass = 'bg-primary-container';
        button.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span> <span>¡Listo!</span>';
        button.classList.replace(originalClass, 'bg-secondary');

        setTimeout(function () {
          button.innerHTML = originalHtml;
          button.classList.replace('bg-secondary', originalClass);
        }, 1500);

        toastTitle.textContent = itemTitle;
        toastSubtitle.textContent = 'Agregado a tu canasta';
        toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
        toast.classList.add('translate-y-0', 'opacity-100');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
          toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
          toast.classList.remove('translate-y-0', 'opacity-100');
        }, 2500);
      });
    });

    var roastButtons = document.querySelectorAll('.roast-btn');
    roastButtons.forEach(function (rBtn) {
      rBtn.addEventListener('click', function () {
        roastButtons.forEach(function (b) {
          b.classList.remove('bg-secondary-container', 'text-on-secondary-container', 'font-semibold');
          b.classList.add('bg-surface-container', 'text-on-surface');
        });
        rBtn.classList.add('bg-secondary-container', 'text-on-secondary-container', 'font-semibold');
        rBtn.classList.remove('bg-surface-container', 'text-on-surface');
      });
    });

    document.querySelectorAll('.profile-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var selected = chip.classList.contains('bg-secondary');
        chip.classList.toggle('bg-secondary', !selected);
        chip.classList.toggle('text-on-secondary', !selected);
        chip.classList.toggle('bg-surface-container', selected);
        chip.classList.toggle('text-on-surface', selected);
      });
    });
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();