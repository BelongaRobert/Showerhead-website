document.documentElement.classList.remove('no-js');

function initPdpGalleries() {
  document.querySelectorAll('.pdp').forEach((root) => {
    const slides = Array.from(root.querySelectorAll('.pdp__slide'));
    const thumbs = Array.from(root.querySelectorAll('.pdp__thumb'));
    if (!slides.length) return;

    let index = Math.max(
      0,
      slides.findIndex((slide) => slide.classList.contains('is-active')),
    );

    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle('is-active', active);
        if (active) slide.removeAttribute('hidden');
        else slide.setAttribute('hidden', '');
      });
      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('is-active', i === index);
      });
    };

    show(index);

    root.querySelector('[data-pdp-prev]')?.addEventListener('click', () => show(index - 1));
    root.querySelector('[data-pdp-next]')?.addEventListener('click', () => show(index + 1));
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const i = Number(thumb.dataset.index || 0);
        show(i);
      });
    });

    root.querySelectorAll('.qty-card input[type="radio"]').forEach((input) => {
      input.addEventListener('change', () => {
        root.querySelectorAll('.qty-card').forEach((card) => {
          card.classList.toggle('is-selected', card.querySelector('input')?.checked);
        });
      });
    });
  });
}

function selectedPurchaseMode(root) {
  return root.querySelector('input[name="purchase_mode"]:checked')?.value || 'onetime';
}

function syncPurchaseMode(root) {
  const mode = selectedPurchaseMode(root);
  const addon = root.querySelector('[data-filter-addon]');
  const onetimeLabel = root.querySelector('[data-atc-label-onetime]');
  const subscribeLabel = root.querySelector('[data-atc-label-subscribe]');

  root.querySelectorAll('.purchase-mode').forEach((card) => {
    card.classList.toggle('is-selected', card.querySelector('input')?.checked);
  });

  if (addon) {
    if (mode === 'subscribe') addon.removeAttribute('hidden');
    else addon.setAttribute('hidden', '');
  }

  if (onetimeLabel && subscribeLabel) {
    onetimeLabel.hidden = mode === 'subscribe';
    subscribeLabel.hidden = mode !== 'subscribe';
  }
}

function syncFilterPlanCards(root) {
  root.querySelectorAll('.filter-plan').forEach((card) => {
    card.classList.toggle('is-selected', card.querySelector('input')?.checked);
  });
}

async function addItemsToCart(items) {
  const response = await fetch(window.Shopify?.routes?.root
    ? `${window.Shopify.routes.root}cart/add.js`
    : '/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    let message = 'Could not add to cart';
    try {
      const data = await response.json();
      message = data.description || data.message || message;
    } catch (_) {
      /* ignore parse errors */
    }
    throw new Error(message);
  }

  return response.json();
}

function initPurchaseModes() {
  document.querySelectorAll('.pdp').forEach((root) => {
    const form = root.querySelector('form.pdp__form');
    if (!form || form.dataset.purchaseBound === 'true') return;
    form.dataset.purchaseBound = 'true';

    syncPurchaseMode(root);
    syncFilterPlanCards(root);

    root.querySelectorAll('input[name="purchase_mode"]').forEach((input) => {
      input.addEventListener('change', () => syncPurchaseMode(root));
    });

    root.querySelectorAll('input[name="filter_selling_plan"]').forEach((input) => {
      input.addEventListener('change', () => syncFilterPlanCards(root));
    });

    form.addEventListener('submit', async (event) => {
      const mode = selectedPurchaseMode(root);
      const addon = root.querySelector('[data-filter-addon]');
      if (mode !== 'subscribe' || !addon) return;

      event.preventDefault();

      const headId = form.querySelector('input[name="id"]:checked')?.value
        || form.querySelector('input[name="id"]')?.value;
      const filterId = addon.dataset.filterVariantId;
      const planId = root.querySelector('input[name="filter_selling_plan"]:checked')?.value;
      const button = form.querySelector('[data-atc-button]');

      if (!headId) return;

      if (addon.dataset.filterAvailable === 'false') {
        window.alert('Carbon filters are currently unavailable.');
        return;
      }

      if (!planId) {
        window.alert('Choose a Loop filter subscription plan (map Carbon Filters to a Loop selling plan first).');
        return;
      }

      const items = [
        { id: Number(headId), quantity: 1 },
        { id: Number(filterId), quantity: 1, selling_plan: Number(planId) },
      ];

      if (button) button.disabled = true;
      try {
        await addItemsToCart(items);
        window.location.href = window.Shopify?.routes?.root
          ? `${window.Shopify.routes.root}cart`
          : '/cart';
      } catch (error) {
        window.alert(error.message || 'Could not add subscription to cart.');
        if (button) button.disabled = false;
      }
    });
  });
}

function initPdp() {
  initPdpGalleries();
  initPurchaseModes();
}

document.addEventListener('DOMContentLoaded', initPdp);
document.addEventListener('shopify:section:load', initPdp);
