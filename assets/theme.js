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

document.addEventListener('DOMContentLoaded', initPdpGalleries);
document.addEventListener('shopify:section:load', initPdpGalleries);
