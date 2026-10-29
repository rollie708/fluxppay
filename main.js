const products = [
  { id: 'backpack', name: 'Everyday Backpack', price: 65, note: 'North / Form · 1 item', art: 'art-pack', tag: 'Most popular' },
  { id: 'headphones', name: 'Wireless Headphones', price: 120, note: 'North / Form · 1 item', art: 'art-headphones', tag: 'New arrival' },
  { id: 'lamp', name: 'Minimal Desk Lamp', price: 45, note: 'North / Form · 1 item', art: 'art-lamp', tag: 'Limited' },
];
const assets = {
  USDC: { symbol: '$', className: 'usdc', rates: { Base: '65.00', Ethereum: '65.00', Solana: '65.00' } },
  USDT: { symbol: '₮', className: 'usdt', rates: { Base: '65.00', Ethereum: '65.00', Solana: '65.00' } },
  ETH: { symbol: '◆', className: 'eth', rates: { Base: '0.020', Ethereum: '0.020', Solana: '0.020' } },
};
const networkOptions = ['Base', 'Ethereum', 'Solana'];
let state = { product: 'backpack', asset: 'USDC', network: 'Base', status: 'review' };
let simulationTimer;

const productList = document.querySelector('#product-list');
const checkoutBody = document.querySelector('#checkout-body');
const checkoutPanel = document.querySelector('#checkout-panel');

function logoIcon() { return '<span class="asset-icon">$</span>'; }
function selectedProduct() { return products.find((product) => product.id === state.product); }
function assetAmount() {
  const product = selectedProduct();
  const value = assets[state.asset].rates[state.network];
  if (state.asset === 'ETH') return (Number(value) * product.price / 65).toFixed(3);
  return (Number(value) * product.price / 65).toFixed(2);
}
function renderProducts() {
  productList.innerHTML = products.map((product) => `<button class="product-card ${state.product === product.id ? 'selected' : ''}" data-product="${product.id}" type="button" aria-pressed="${state.product === product.id}"><span class="product-art ${product.art}"><span class="art-detail"></span></span><span class="product-card-copy"><small>${product.tag}</small><strong>${product.name}</strong><span>${product.note}</span></span><b>$${product.price}.00</b><span class="product-selected">${state.product === product.id ? '✓' : '↗'}</span></button>`).join('');
  productList.querySelectorAll('[data-product]').forEach((button) => button.addEventListener('click', () => { state.product = button.dataset.product; state.status = 'review'; render(); }));
}
function renderCheckout() {
  const product = selectedProduct();
  if (state.status === 'complete') {
    checkoutBody.innerHTML = `<div class="complete-state"><div class="complete-icon">✓</div><span class="complete-label">Demo completed</span><h3>Payment preview<br /><em>complete.</em></h3><p>This simulated flow has finished. No funds were transferred and no wallet was connected.</p><div class="complete-summary"><div><span>Product</span><strong>${product.name}</strong></div><div><span>Amount</span><strong>$${product.price}.00 · ${state.asset}</strong></div><div><span>Network</span><strong>${state.network} · demo</strong></div><div><span>Demo reference</span><strong class="reference">FXP-${product.id.slice(0, 3).toUpperCase()}-2048</strong></div></div><button class="button button-dark full-button" data-action="reset" type="button">Return to store <span>↗</span></button></div>`;
    return;
  }
  const isSimulating = state.status === 'simulating';
  const statusText = isSimulating ? 'Simulating transaction' : 'Reviewing payment';
  checkoutBody.innerHTML = `<div class="checkout-progress ${isSimulating ? 'is-running' : ''}"><span class="progress-step done">1 <b>Choose</b></span><i></i><span class="progress-step ${isSimulating ? 'done' : 'current'}">2 <b>Review</b></span><i></i><span class="progress-step ${isSimulating ? 'current' : ''}">3 <b>Complete</b></span></div><div class="order-summary"><div class="summary-art product-art ${product.art}"><span class="art-detail"></span></div><div><span class="mini-label">You are paying for</span><strong>${product.name}</strong><small>North / Form</small></div><strong class="summary-price">$${product.price}.00</strong></div><div class="field-label"><span>Choose a payment asset</span><span>Sample conversions</span></div><div class="asset-options">${Object.entries(assets).map(([name, asset]) => `<button type="button" class="asset-option ${state.asset === name ? 'selected' : ''}" data-asset="${name}" aria-pressed="${state.asset === name}"><span class="asset-icon ${asset.className}">${asset.symbol}</span><span><strong>${name}</strong><small>${name === 'ETH' ? 'Ethereum' : 'Stablecoin'}</small></span><span class="option-check">${state.asset === name ? '✓' : ''}</span></button>`).join('')}</div><label class="select-label" for="network-select">Network <span>Demo configuration</span></label><div class="select-wrap"><select id="network-select">${networkOptions.map((network) => `<option ${state.network === network ? 'selected' : ''}>${network}</option>`).join('')}</select><span>⌄</span></div><div class="payment-summary"><div class="summary-heading"><span>Payment summary</span><span class="sample-tag">Illustrative value</span></div><div class="payment-line"><span>Product</span><strong>${product.name}</strong></div><div class="payment-line"><span>Amount in USD</span><strong>$${product.price}.00</strong></div><div class="payment-line asset-line"><span>Estimated ${state.asset} amount</span><strong>${assetAmount()} ${state.asset}</strong></div><div class="payment-line"><span>Network</span><strong>${state.network} <small>· demo</small></strong></div></div><button class="simulate-button" data-action="simulate" type="button" ${isSimulating ? 'disabled' : ''}><span>${isSimulating ? statusText : 'Simulate payment'}</span><span class="button-spinner"></span><span>↗</span></button><div class="checkout-foot"><span class="tiny-lock">~</span><span>This is a frontend-only product preview.</span></div>`;
  checkoutBody.querySelectorAll('[data-asset]').forEach((button) => button.addEventListener('click', () => { state.asset = button.dataset.asset; renderCheckout(); }));
  checkoutBody.querySelector('#network-select').addEventListener('change', (event) => { state.network = event.target.value; renderCheckout(); });
  checkoutBody.querySelector('[data-action="simulate"]').addEventListener('click', simulatePayment);
}
function render() { renderProducts(); renderCheckout(); }
function simulatePayment() {
  if (state.status === 'simulating') return;
  state.status = 'simulating'; renderCheckout();
  simulationTimer = setTimeout(() => { state.status = 'complete'; renderCheckout(); checkoutPanel.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 2200);
}
document.addEventListener('click', (event) => {
  const reset = event.target.closest('[data-action="reset"]');
  if (reset) { clearTimeout(simulationTimer); state.status = 'review'; render(); }
  const scrollDemo = event.target.closest('[data-scroll-demo]');
  if (scrollDemo) document.querySelector('#demo').scrollIntoView({ behavior: 'smooth' });
});
render();

const header = document.querySelector('#site-header');
const menuToggle = document.querySelector('#menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') === 'true'; menuToggle.setAttribute('aria-expanded', String(!open)); mobileMenu.classList.toggle('open', !open); });
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menuToggle.setAttribute('aria-expanded', 'false'); mobileMenu.classList.remove('open'); }));

document.querySelectorAll('details').forEach((detail) => detail.addEventListener('toggle', () => { if (detail.open) document.querySelectorAll('details[open]').forEach((other) => { if (other !== detail) other.removeAttribute('open'); }); }));
