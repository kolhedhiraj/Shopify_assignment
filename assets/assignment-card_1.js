document.addEventListener('DOMContentLoaded', () => {
  // 1. Swatch Selection
  document.querySelectorAll('.assignment-card').forEach((card) => {
    const swatches = card.querySelectorAll('.swatch-btn');
    const image = card.querySelector('.js-card-img');
    const links = card.querySelectorAll('.js-card-link, .assignment-card__image-link');
    const quickAdd = card.querySelector('.js-quick-add');
    const priceContainer = card.querySelector('.js-card-price');

    swatches.forEach((swatch) => {
      swatch.addEventListener('click', (e) => {
        e.preventDefault();
        swatches.forEach((s) => s.classList.remove('is-active'));
        swatch.classList.add('is-active');

        // Swap Image
        if (image && swatch.dataset.variantImage) {
          image.src = swatch.dataset.variantImage;
        }

        // Swap Target Variant & URLs
        const variantId = swatch.dataset.variantId;
        const variantUrl = swatch.dataset.variantUrl;
        links.forEach((l) => (l.href = variantUrl));

        if (quickAdd) {
          quickAdd.dataset.variantId = variantId;
          const available = swatch.dataset.variantAvailable === 'true';
          quickAdd.disabled = !available;
          quickAdd.textContent = available ? '+ Quick Add' : 'Sold Out';
        }

        // Swap Prices
        if (priceContainer) {
          const regularPrice = swatch.dataset.variantPrice;
          const comparePrice = swatch.dataset.variantCompare;
          let html = `<span class="price-regular">${regularPrice}</span>`;
          if (comparePrice) {
            html += `<s class="price-compare">${comparePrice}</s>`;
          }
          priceContainer.innerHTML = html;
        }
      });
    });
  });

  // 2. AJAX Quick Add with Double-Click Protection
  document.querySelectorAll('.js-quick-add').forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      if (button.disabled || button.classList.contains('is-loading')) return;

      const variantId = button.dataset.variantId;
      if (!variantId) return;

      button.classList.add('is-loading');
      button.disabled = true;
      const initialText = button.textContent;
      button.textContent = 'Adding...';

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] }),
        });

        if (!response.ok) throw new Error('Could not add to cart');

        button.textContent = '✓ Added';
        // Notify theme to update cart count/drawers
        document.dispatchEvent(new CustomEvent('cart:updated'));
        setTimeout(() => {
          button.textContent = initialText;
          button.disabled = false;
        }, 1500);
      } catch (err) {
        button.textContent = 'Error';
        setTimeout(() => {
          button.textContent = initialText;
          button.disabled = false;
        }, 2000);
      } finally {
        button.classList.remove('is-loading');
      }
    });
  });
});