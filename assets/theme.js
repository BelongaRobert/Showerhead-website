document.documentElement.classList.remove('no-js');

function initGallery(root, slideSel, thumbSel, prevSel, nextSel) {
  const slides = Array.from(root.querySelectorAll(slideSel));
  const thumbs = Array.from(root.querySelectorAll(thumbSel));
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

  root.querySelector(prevSel)?.addEventListener('click', () => show(index - 1));
  root.querySelector(nextSel)?.addEventListener('click', () => show(index + 1));
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      show(Number(thumb.dataset.index || 0));
    });
  });
}

function initPdpGalleries() {
  document.querySelectorAll('.pdp').forEach((root) => {
    initGallery(root, '.pdp__slide', '.pdp__thumb', '[data-pdp-prev]', '[data-pdp-next]');

    const filterRoot = root.querySelector('[data-filter-addon]');
    if (filterRoot) {
      initGallery(filterRoot, '.filter-addon__slide', '.filter-addon__thumb', null, null);
    }

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
  return root.querySelector('input[name="purchase_mode"]:checked')?.value || 'subscribe';
}

function syncPurchaseMode(root) {
  const mode = selectedPurchaseMode(root);
  const onetimeLabel = root.querySelector('[data-atc-label-onetime]');
  const subscribeLabel = root.querySelector('[data-atc-label-subscribe]');
  const sellingPlanInput = root.querySelector('[data-selling-plan]');
  const modes = root.querySelector('[data-purchase-modes]');
  const headPlanFromRadio = root.querySelector('input[name="head_selling_plan"]:checked')?.value;
  const headPlanId = headPlanFromRadio || modes?.dataset.headPlanId || '';

  root.querySelectorAll('.sub-card').forEach((card) => {
    card.classList.toggle('is-selected', Boolean(card.querySelector('input[name="purchase_mode"]')?.checked));
  });

  root.querySelectorAll('.sub-freq').forEach((card) => {
    card.classList.toggle('is-selected', Boolean(card.querySelector('input')?.checked));
  });

  if (sellingPlanInput) {
    sellingPlanInput.value = mode === 'subscribe' && headPlanId ? headPlanId : '';
  }

  if (onetimeLabel && subscribeLabel) {
    onetimeLabel.hidden = mode === 'subscribe';
    subscribeLabel.hidden = mode !== 'subscribe';
  }

  const filterAddon = root.querySelector('[data-filter-addon]');
  if (filterAddon) {
    filterAddon.classList.toggle('is-dimmed', mode !== 'subscribe');
  }

  const freqs = root.querySelector('.sub-card__frequencies');
  if (freqs) {
    freqs.classList.toggle('is-dimmed', mode !== 'subscribe');
  }
}

function cartRoot() {
  return window.Shopify?.routes?.root || '/';
}

async function addItemsToCart(items) {
  const response = await fetch(`${cartRoot()}cart/add.js`, {
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
      /* ignore */
    }
    throw new Error(message);
  }

  return response.json();
}

function readLoopSellingPlan(form) {
  const candidates = form.querySelectorAll(
    'input[name="selling_plan"], select[name="selling_plan"], input[name="selling_plan_id"]',
  );
  for (const el of candidates) {
    if (el.hasAttribute('data-selling-plan')) continue;
    const value = el.value;
    if (value && /^\d+$/.test(String(value))) return value;
  }
  return '';
}

function initPurchaseModes() {
  document.querySelectorAll('.pdp').forEach((root) => {
    const form = root.querySelector('form.pdp__form');
    if (!form || form.dataset.purchaseBound === 'true') return;
    form.dataset.purchaseBound = 'true';

    syncPurchaseMode(root);

    root.querySelectorAll('input[name="purchase_mode"], input[name="filter_selling_plan"], input[name="head_selling_plan"]').forEach((input) => {
      input.addEventListener('change', () => syncPurchaseMode(root));
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const mode = selectedPurchaseMode(root);
      const modes = root.querySelector('[data-purchase-modes]');
      const addon = root.querySelector('[data-filter-addon]');
      const button = form.querySelector('[data-atc-button]');
      const headId = form.querySelector('input[name="id"]:checked')?.value
        || form.querySelector('input[name="id"]')?.value;

      if (!headId) return;

      const headPlanFromRadio = root.querySelector('input[name="head_selling_plan"]:checked')?.value;
      const filterPlanFromRadio = root.querySelector('input[name="filter_selling_plan"]:checked')?.value;
      const loopPlan = readLoopSellingPlan(form);

      const headPlanId = headPlanFromRadio || modes?.dataset.headPlanId || loopPlan || '';
      const filterId = addon?.dataset.filterVariantId || modes?.dataset.filterVariantId || '';
      const filterPlanId = filterPlanFromRadio
        || addon?.dataset.filterPlanId
        || modes?.dataset.filterPlanId
        || '';

      const items = [];

      if (mode === 'subscribe') {
        const headItem = { id: Number(headId), quantity: 1 };
        if (headPlanId && /^\d+$/.test(String(headPlanId))) {
          headItem.selling_plan = Number(headPlanId);
        }
        items.push(headItem);

        if (filterId && /^\d+$/.test(String(filterId))) {
          const filterItem = { id: Number(filterId), quantity: 1 };
          if (filterPlanId && /^\d+$/.test(String(filterPlanId))) {
            filterItem.selling_plan = Number(filterPlanId);
          }
          items.push(filterItem);
        }
      } else {
        items.push({ id: Number(headId), quantity: 1 });
      }

      if (button) button.disabled = true;
      try {
        await addItemsToCart(items);
        window.location.href = `${cartRoot()}cart`;
      } catch (error) {
        window.alert(error.message || 'Could not add to cart.');
        if (button) button.disabled = false;
      }
    });
  });
}

function revealLiveLoopWidgets() {
  document.querySelectorAll('[data-loop-slot]').forEach((slot) => {
    const hasContent = Boolean(slot.querySelector('.pdp__app-block')?.childElementCount);
    slot.classList.toggle('has-content', hasContent);
  });
}

function initPdp() {
  initPdpGalleries();
  initPurchaseModes();
  revealLiveLoopWidgets();
  window.setTimeout(revealLiveLoopWidgets, 800);
  window.setTimeout(revealLiveLoopWidgets, 2000);
}

document.addEventListener('DOMContentLoaded', initPdp);
document.addEventListener('shopify:section:load', initPdp);
