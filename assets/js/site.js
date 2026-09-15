(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    if (window.SY_CART) {
      SY_CART.updateBadge();
    }

    var page = document.body.getAttribute('data-page');
    if (page) {
      document.querySelectorAll('.header-nav a[data-page]').forEach(function (link) {
        if (link.getAttribute('data-page') === page) {
          link.classList.add('text-primary', 'font-semibold');
          link.classList.remove('text-on-surface-variant');
          link.classList.add('border-b-2', 'border-primary');
        }
      });
    }

    // Menu movil
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('hidden');
        document.body.classList.toggle('menu-open', !open);
        toggle.querySelector('.material-symbols-outlined').textContent = open ? 'menu' : 'close';
      });
    }
  });
})();