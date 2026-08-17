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
    thumb.addEventListener('click', () => show(Number(thumb.dataset.index || 0)));
  });
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

function selectedQty(panel) {
  return Number(panel.querySelector('input[name="dd_qty"]:checked')?.value || 1);
}

function syncOffer(panel) {
  const mode = panel.querySelector('input[name="dd_purchase_mode"]:checked')?.value || 'subscribe';
  const qty = selectedQty(panel);

  panel.querySelectorAll('.offer-card--qty').forEach((card) => {
    card.classList.toggle('is-selected', Boolean(card.querySelector('input[name="dd_qty"]')?.checked));
  });
  panel.querySelectorAll('.offer-card:not(.offer-card--qty)').forEach((card) => {
    card.classList.toggle('is-selected', Boolean(card.querySelector('input[name="dd_purchase_mode"]')?.checked));
  });
  panel.querySelectorAll('.offer-freq').forEach((chip) => {
    chip.classList.toggle('is-selected', Boolean(chip.querySelector('input')?.checked));
  });

  const autoPrice = panel.querySelector('[data-auto-price]');
  const autoCompare = panel.querySelector('[data-auto-compare]');
  const onePrice = panel.querySelector('[data-one-price]');
  if (autoPrice) autoPrice.textContent = panel.dataset[`autoPrice${qty}`] || autoPrice.textContent;
  if (autoCompare) autoCompare.textContent = panel.dataset[`autoCompare${qty}`] || autoCompare.textContent;
  if (onePrice) onePrice.textContent = panel.dataset[`onePrice${qty}`] || onePrice.textContent;

  const subscribe = panel.querySelector('[data-atc-label-subscribe]');
  const onetime = panel.querySelector('[data-atc-label-onetime]');
  if (subscribe) subscribe.textContent = panel.dataset[`atcSub${qty}`] || subscribe.textContent;
  if (onetime) onetime.textContent = panel.dataset[`atcOne${qty}`] || onetime.textContent;
  if (onetime && subscribe) {
    onetime.hidden = mode === 'subscribe';
    subscribe.hidden = mode !== 'subscribe';
  }

  const filterNote = panel.querySelector('[data-filter-note]');
  if (filterNote) filterNote.textContent = panel.dataset[`filterNote${qty}`] || filterNote.textContent;
  panel.querySelector('.offer-filter')?.classList.toggle('is-dimmed', mode !== 'subscribe');
  const qtyInput = panel.querySelector('[data-qty-input]');
  if (qtyInput) qtyInput.value = String(qty);
}

function initPdp() {
  document.querySelectorAll('.pdp').forEach((root) => {
    initGallery(root, '.pdp__slide', '.pdp__thumb', '[data-pdp-prev]', '[data-pdp-next]');
  });

  document.querySelectorAll('[data-sub-panel]').forEach((panel) => {
    if (panel.dataset.bound === 'true') return;
    panel.dataset.bound = 'true';
    syncOffer(panel);

    panel.querySelectorAll('input[name="dd_purchase_mode"], input[name="dd_filter_plan"], input[name="dd_qty"]').forEach((input) => {
      input.addEventListener('change', () => syncOffer(panel));
    });

    const addToCart = async (event) => {
      event.preventDefault();
      const mode = panel.querySelector('input[name="dd_purchase_mode"]:checked')?.value || 'subscribe';
      const headId = panel.dataset.headId;
      const filterId = panel.dataset.filterId;
      const headPlanId = panel.dataset.headPlanId;
      const filterPlanId = panel.querySelector('input[name="dd_filter_plan"]:checked')?.value
        || panel.dataset.filterPlanId;
      const button = panel.querySelector('[data-sub-atc]');

      const qty = selectedQty(panel);

      if (!headId) {
        window.alert('Set the showerhead product in Theme settings → Shop links.');
        return;
      }

      const items = [];
      if (mode === 'subscribe') {
        const headItem = { id: Number(headId), quantity: qty };
        if (headPlanId && /^\d+$/.test(headPlanId)) headItem.selling_plan = Number(headPlanId);
        items.push(headItem);
        if (filterId && /^\d+$/.test(filterId)) {
          const filterItem = { id: Number(filterId), quantity: qty };
          if (filterPlanId && /^\d+$/.test(filterPlanId)) filterItem.selling_plan = Number(filterPlanId);
          items.push(filterItem);
        }
      } else {
        items.push({ id: Number(headId), quantity: qty });
      }

      if (button) button.disabled = true;
      try {
        await addItemsToCart(items);
        window.location.href = `${cartRoot()}cart`;
      } catch (error) {
        window.alert(error.message || 'Could not add to cart.');
        if (button) button.disabled = false;
      }
    };

    panel.addEventListener('submit', addToCart);
    if (panel.tagName !== 'FORM') {
      panel.querySelector('[data-sub-atc]')?.addEventListener('click', addToCart);
    }
  });
}

document.addEventListener('DOMContentLoaded', initPdp);
document.addEventListener('shopify:section:load', initPdp);
