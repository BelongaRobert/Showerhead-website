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
    root.querySelectorAll('.qty-card input[type="radio"]').forEach((input) => {
      input.addEventListener('change', () => {
        root.querySelectorAll('.qty-card').forEach((card) => {
          card.classList.toggle('is-selected', card.querySelector('input')?.checked);
        });
      });
    });
  });

  document.querySelectorAll('[data-filter-addon]').forEach((filterRoot) => {
    initGallery(filterRoot, '.filter-addon__slide', '.filter-addon__thumb', null, null);
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

function syncSubPanel(panel) {
  const mode = panel.querySelector('input[name="dd_purchase_mode"]:checked')?.value || 'subscribe';
  panel.querySelectorAll('.sub-card').forEach((card) => {
    card.classList.toggle('is-selected', Boolean(card.querySelector('input[name="dd_purchase_mode"]')?.checked));
  });
  panel.querySelectorAll('.sub-freq').forEach((chip) => {
    chip.classList.toggle('is-selected', Boolean(chip.querySelector('input')?.checked));
  });
  const onetime = panel.querySelector('[data-atc-label-onetime]');
  const subscribe = panel.querySelector('[data-atc-label-subscribe]');
  if (onetime && subscribe) {
    onetime.hidden = mode === 'subscribe';
    subscribe.hidden = mode !== 'subscribe';
  }
  panel.querySelector('[data-filter-addon]')?.classList.toggle('is-dimmed', mode !== 'subscribe');
}

function initSubPanels() {
  document.querySelectorAll('[data-sub-panel]').forEach((panel) => {
    if (panel.dataset.bound === 'true') return;
    panel.dataset.bound = 'true';

    syncSubPanel(panel);

    panel.querySelectorAll('input[name="dd_purchase_mode"], input[name="dd_filter_plan"]').forEach((input) => {
      input.addEventListener('change', () => syncSubPanel(panel));
    });

    panel.querySelector('[data-sub-atc]')?.addEventListener('click', async () => {
      const mode = panel.querySelector('input[name="dd_purchase_mode"]:checked')?.value || 'subscribe';
      const headId = panel.dataset.headId;
      const filterId = panel.dataset.filterId;
      const headPlanId = panel.dataset.headPlanId;
      const filterPlanId = panel.querySelector('input[name="dd_filter_plan"]:checked')?.value
        || panel.dataset.filterPlanId;
      const button = panel.querySelector('[data-sub-atc]');

      if (!headId) {
        window.alert('Showerhead product is missing. Set it in the Subscription options section.');
        return;
      }

      const items = [];
      if (mode === 'subscribe') {
        const headItem = { id: Number(headId), quantity: 1 };
        if (headPlanId && /^\d+$/.test(headPlanId)) headItem.selling_plan = Number(headPlanId);
        items.push(headItem);

        if (filterId && /^\d+$/.test(filterId)) {
          const filterItem = { id: Number(filterId), quantity: 1 };
          if (filterPlanId && /^\d+$/.test(filterPlanId)) filterItem.selling_plan = Number(filterPlanId);
          items.push(filterItem);
        } else {
          window.alert('Carbon Filters product not found yet. Autoship will still add the showerhead — set Filter product in Subscription options.');
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

function initPdp() {
  initPdpGalleries();
  initSubPanels();
}

document.addEventListener('DOMContentLoaded', initPdp);
document.addEventListener('shopify:section:load', initPdp);
