(function () {
  'use strict';

  var CART_KEY = 'sy_cart_v1';
  var ORDER_KEY = 'sy_order_v1';
  var COUPON_KEY = 'sy_coupon_v1';
  var DISCOUNT_RATE = 0.10; // ORIGEN10
  var TAX_RATE = 0.08; // IVA

  var PRODUCTS = {
    'flat-white': {
      id: 'flat-white',
      name: 'Flat White de Origen',
      subtitle: 'Blend Sierra Nevada · Tueste Medio Sedoso',
      price: 4.80,
      category: 'calientes',
      badge: 'Especialidad',
      badgeClass: 'bg-primary-container/90 text-on-primary',
      meta: 'Bebida',
      tags: ['Cacao 70%', 'Avellana', 'Sedoso'],
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJSEZqFwgY7MuOUKO18oNJoMGLUwI_VWXjLWhnkCj4LIG-Mc-ZzlI5DX_IEhvzZ_ZzqSycNIQoq4PW8kiGSlw06i0VzZc8-ZiXcsFCIRxYYMaoIU1vtogsx78Cj8mg2m-45xvRY7MZbYIVgs7UJrry3kP4naA4wmH-86knHWeAsC1XDoqq8h2ZRnn4ObetzchH9CXeZ0yh-mK7ezlUfe-zXkS4kUjpVC4h69eTXtzOEBarHfIItDLJ',
      alt: 'An artisanal Flat White served in a rustic ceramic speckled cup with delicate tulip latte art on a warm textured walnut wood counter, ambient soft morning sunlight illuminating steam, specialty coffee aesthetic in dark bistre and cream tones.'
    },
    'pistachio-latte': {
      id: 'pistachio-latte',
      name: 'Iced Pistachio Latte',
      subtitle: 'Espresso doble · Leche de avena barista',
      price: 5.90,
      category: 'frias',
      badge: 'Favorito',
      badgeClass: 'bg-secondary text-on-secondary',
      meta: 'Bebida',
      tags: ['Pistacho Real', 'Avena Barista', 'Refrescante'],
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBngTNAWhWy_9NPvZKQs6szSC-8I-k3oqBL_C6bLnWVnklgwQmokYYG1e6JOOwMToaK3XX7-Zjuw0MAuA5SlVuRA00XefwqV8otZK_0NBN0uxv9mzSzN7M7ILpQlrGFP72CMJOyBqEblDJoF_0YuwjJns1V0AVVU1bO4kxrYpJpNy9CZJ2iDCeheATo2vbINg0wk5m6Ba1kdjUnERyErHLW-atmyfem_t4MJUdN1g4gGt8BQsxJ_Xza',
      alt: 'Layered iced pistachio latte inside a ribbed tall glass, rich green organic pistachio cream swirl at the bottom, crystalline square ice cubes, oat milk and a rich espresso shot cascade on top, warm daylight table setting.'
    },
    'croissant-almendras': {
      id: 'croissant-almendras',
      name: 'Croissant de Almendras & Miel',
      subtitle: 'Mantequilla de pastura · Fermentación lenta',
      price: 4.20,
      category: 'reposteria',
      badge: null,
      badgeClass: '',
      meta: 'Horno',
      tags: ['Mantequilla Normanda', 'Frangipane', 'Miel Silvestre'],
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM0fsIcTOXTv0MikPPNEonFBHuHTr3EDJ7nt83YAdSIPSM-oWf45XDAlxjC9_k4d-6Vq4Ocs7ZMHzoiskygEswa3wLfJRrdd036fnCeF0moWYIcNhVnMiHbfXwlmdAVfYUct4fVKqjMcej2LCZDzCEl8L4elNzuaht2q0es-KDNbjMIcAQ7AowARY94gDLSmuEsufynG0futvuxvBCUN8QM44ATPcUNklTKyB-i71okNGhHuLpKQIi',
      alt: 'Golden brown flaked almond croissant baked to perfection, generously topped with sliced roasted almonds and powdered sugar dusting, served on a handmade speckled earthenware plate with honeycomb honey dripper nearby.'
    },
    'geisha-250g': {
      id: 'geisha-250g',
      name: 'Granos Sierra Nevada Geisha (250g)',
      subtitle: 'Altitud 1,950 msnm · Proceso Lavado Floral',
      price: 18.50,
      category: 'granos',
      badge: 'Cosecha Limitada',
      badgeClass: 'bg-tertiary-container text-tertiary-fixed',
      meta: 'Microlote',
      tags: ['Jazmín', 'Bergamota', 'Lavado 1900m'],
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnDSsvyyJ6bZHRNyrkCXWHLaxPAq1X4EuEH0u0uDUeIjag9EZr0sDV7T5Fa1GshCqVMKitjJcNaSdEPkHmylRx8Q06gFpx5mVmBrMP5qiyh891YJZovvQLRdE3f0xVHrS9x8bHORsz5bgfeYWXuY1Lr5xY0KeFPCR8_9IMZAf0Kik62Htbd9ySC4VaLY6o8qrKVTXlllVN2Kk3XQV81syKBZlkUIAzkWkndiynfLcCfX01wx5ibx89',
      alt: 'Premium minimalist craft coffee bean bag labeled Sierra Nevada Geisha 250g with embossed botanical gold foil leaves, accompanied by fresh raw whole roasted coffee beans scattered on tactile linen cloth in soft warm lighting.'
    },
    'cold-brew-nitro': {
      id: 'cold-brew-nitro',
      name: 'Cold Brew Nitro 18 Horas',
      subtitle: 'Infusión en frío · Nitrógeno activo',
      price: 5.20,
      category: 'frias',
      badge: null,
      badgeClass: '',
      meta: 'Bebida',
      tags: ['Caramelo Quemado', 'Sin Azúcar', 'Nitro Stout'],
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6PBv4DGOI8zMiUQvk8N9OEuZPZOoQcNR5Mue6YA8fMdDNkWeeQuD-__1tuYgpr36hFrleLXQUmBFpXrDuLUwdBkCoJ1OdWVrRvkFsaWyDl-LoTkVaHwHP0a8Vxe4bPVPbSxka4Fqclmzsdy3p-TNOBotCA1PsIFRyNSoSgI62Ne1QxomYh_OSc1q8l88X069B1Dt6hAxmLKv62H6P_796l_-dXOyFEq6pKCnrg4uK8MPNypHS7V9u',
      alt: 'Rich velvety Nitro Cold brew poured fresh from draft tap into an elegant stemless chalice glass with a thick Guinness-style creamy cascading foam head, deep dark coffee body, ambient moody wooden coffee bar counter.'
    },
    'toston-aguacate': {
      id: 'toston-aguacate',
      name: 'Tostón de Aguacate & Masa Madre',
      subtitle: 'Pan campesino · Huevo pochado de campo',
      price: 8.50,
      category: 'brunch',
      badge: null,
      badgeClass: '',
      meta: 'Brunch',
      tags: ['Masa Madre 48h', 'Huevo Libre', 'Cáñamo'],
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWADlwZYDbtDk6E9-yDh0mRYO4DJup0SlrB-xTmLLekfVLxKYXCqbpV5pguPyh73NwRJochKede0jVHvAskd6JSS9eSguAVgJJkEK5qbmrnBOQuJnbm8e5DL7w4tiegEWXZKEVqmIctDP-eOVdqzIMvr7Vsurd95pmh9uYG5rEgnT_615OeUlo6Q-SbMVE8muiDPYuE3BlctAVLdShBZew7yJC_dZbMcGTLTghBOwsCC9r3FBAuZ2K',
      alt: 'Artisanal avocado sourdough toast on thick crusty country bread, topped with vibrant mashed Hass avocado, perfectly runny poached farm egg, toasted hemp seeds and micro greens, styled on handmade warm pottery.'
    }
  };

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* storage no disponible */
    }
    updateBadge();
  }

  function getCoupon() {
    return localStorage.getItem(COUPON_KEY);
  }

  function setCoupon(code) {
    localStorage.setItem(COUPON_KEY, String(code || ''));
  }

  function cartCount(cart) {
    cart = cart || getCart();
    return cart.reduce(function (n, i) { return n + (i.qty || 0); }, 0);
  }

  function addProduct(id) {
    var product = PRODUCTS[id];
    if (!product) return;
    var cart = getCart();
    var existing = cart.find(function (i) { return i.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        price: product.price,
        img: product.img,
        alt: product.alt,
        meta: product.meta,
        options: [],
        qty: 1
      });
    }
    saveCart(cart);
    return cart;
  }

  function updateQty(id, delta) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.id === id; });
    if (!item) return cart;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(function (i) { return i.id !== id; });
    }
    saveCart(cart);
    return cart;
  }

  function removeItem(id) {
    var cart = getCart().filter(function (i) { return i.id !== id; });
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function totals(cart) {
    cart = cart || getCart();
    var itemCount = 0;
    var raw = 0;
    cart.forEach(function (i) {
      raw += i.price * i.qty;
      itemCount += i.qty;
    });
    var hasCoupon = !!getCoupon();
    var discount = hasCoupon ? raw * DISCOUNT_RATE : 0;
    var taxable = raw - discount;
    var tax = taxable * TAX_RATE;
    return {
      itemCount: itemCount,
      subtotal: raw,
      discount: discount,
      hasCoupon: hasCoupon,
      tax: tax,
      total: taxable + tax
    };
  }

  function money(n) {
    return '$' + Number(n).toFixed(2);
  }

  function updateBadge() {
    var count = cartCount();
    document.querySelectorAll('[data-cart-badge]').forEach(function (el) {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  }

  window.SY_CART = {
    key: CART_KEY,
    orderKey: ORDER_KEY,
    products: PRODUCTS,
    getCart: getCart,
    saveCart: saveCart,
    getCoupon: getCoupon,
    setCoupon: setCoupon,
    cartCount: cartCount,
    addProduct: addProduct,
    updateQty: updateQty,
    removeItem: removeItem,
    clearCart: clearCart,
    totals: totals,
    money: money,
    updateBadge: updateBadge,
    rates: { discount: DISCOUNT_RATE, tax: TAX_RATE }
  };
})();