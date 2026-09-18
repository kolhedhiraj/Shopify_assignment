document.addEventListener('DOMContentLoaded', function () {
  // 1. Swatch Selection Handler
  document.addEventListener('click', function (event) {
    const swatch = event.target.closest('.swatch-dot');
    if (!swatch) return;

    const card = swatch.closest('.assignment-card');
    if (!card) return;

    // Update active swatch styling
    card.querySelectorAll('.swatch-dot').forEach(dot => dot.classList.remove('is-active'));
    swatch.classList.add('is-active');

    // Extract data attributes from clicked swatch
    const variantId = swatch.getAttribute('data-variant-id');
    const variantPrice = swatch.getAttribute('data-variant-price');
    const variantCompare = swatch.getAttribute('data-variant-compare');
    const variantAvailable = swatch.getAttribute('data-variant-available') === 'true';
    const variantImage = swatch.getAttribute('data-variant-image');
    const variantUrl = swatch.getAttribute('data-variant-url');
    const variantTitle = swatch.getAttribute('data-variant-title');

    // Update Card Image
    const imgEl = card.querySelector('.js-card-img');
    if (imgEl && variantImage) {
      imgEl.src = variantImage;
    }

    // Update Card Links
    card.querySelectorAll('.js-card-link, .assignment-card__image-link').forEach(link => {
      if (variantUrl) link.href = variantUrl;
    });

    // Update Title text if variant name is appended
    const titleEl = card.querySelector('.js-card-link');
    if (titleEl && variantTitle) {
      titleEl.textContent = variantTitle;
    }

    // Update Price Block
    const priceEl = card.querySelector('.js-card-price');
    if (priceEl) {
      let priceHTML = `<span class="price-regular">${variantPrice}</span>`;
      if (variantCompare) {
        priceHTML += `<s class="price-compare">${variantCompare}</s>`;
      }
      priceEl.innerHTML = priceHTML;
    }

    // Update Quick Add Button Variant ID & Availability State
    const quickAddBtn = card.querySelector('.js-quick-add');
    if (quickAddBtn) {
      quickAddBtn.setAttribute('data-variant-id', variantId);
      if (variantAvailable) {
        quickAddBtn.removeAttribute('disabled');
        quickAddBtn.classList.remove('is-sold-out');
      } else {
        quickAddBtn.setAttribute('disabled', 'true');
        quickAddBtn.classList.add('is-sold-out');
      }
    }
  });

  // 2. AJAX Quick Add Handler with Double-Click Protection
  document.addEventListener('click', async function (event) {
    const quickAddBtn = event.target.closest('.js-quick-add');
    if (!quickAddBtn) return;
    event.preventDefault();

    // Prevent double-click race conditions
    if (quickAddBtn.dataset.loading === 'true' || quickAddBtn.hasAttribute('disabled')) {
      return;
    }

    const variantId = quickAddBtn.getAttribute('data-variant-id');
    if (!variantId) return;

    quickAddBtn.dataset.loading = 'true';
    quickAddBtn.classList.add('is-loading');
    const originalContent = quickAddBtn.innerHTML;

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
      });

      if (!response.ok) {
        throw new Error('Unable to add item to cart.');
      }

      const cartItem = await response.json();

      // Dispatch event for Dawn theme cart drawer/bubble update
      document.dispatchEvent(new CustomEvent('cart:item-added', { detail: { cartItem } }));
      
      // Fetch updated cart section if Dawn supports it, or update cart count
      fetch(window.location.pathname + '?sections=cart-icon-bubble')
        .then(res => res.json())
        .then(data => {
          const html = data['cart-icon-bubble'];
          const bubble = document.querySelector('#cart-icon-bubble');
          if (bubble && html) {
            bubble.outerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('cart-icon-bubble').outerHTML;
          }
        })
        .catch(() => {});

      // Temporary success state on button
      quickAddBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      `;

      setTimeout(() => {
        quickAddBtn.innerHTML = originalContent;
        quickAddBtn.dataset.loading = 'false';
        quickAddBtn.classList.remove('is-loading');
      }, 1500);

    } catch (error) {
      console.error('Quick Add Error:', error);
      quickAddBtn.classList.add('has-error');
      quickAddBtn.innerHTML = `<span>!</span>`;

      setTimeout(() => {
        quickAddBtn.innerHTML = originalContent;
        quickAddBtn.dataset.loading = 'false';
        quickAddBtn.classList.remove('has-error', 'is-loading');
      }, 2000);
    }
  });
});