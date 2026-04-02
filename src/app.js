/* ===========================
   AutoVault — App Logic
=========================== */

const STORAGE_KEY = 'autovault_cars';

// ---- State ----
let cars = [];
let editingId = null;
let deleteTargetId = null;

// ---- Seed Data ----
const SEED_CARS = [
  {
    id: uid(),
    make: 'Toyota',
    model: 'Fortuner',
    year: 2022,
    price: 3800000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    mileage: 28000,
    color: 'Midnight Black',
    status: 'available',
    notes: 'Single owner, full service history.',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: uid(),
    make: 'Hyundai',
    model: 'Creta',
    year: 2023,
    price: 1650000,
    fuel: 'Petrol',
    transmission: 'CVT',
    mileage: 5000,
    color: 'Phantom Black',
    status: 'reserved',
    notes: 'Almost new, under warranty.',
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: uid(),
    make: 'Tata',
    model: 'Nexon EV',
    year: 2023,
    price: 1950000,
    fuel: 'Electric',
    transmission: 'Automatic',
    mileage: 12000,
    color: 'Tropical Mist',
    status: 'available',
    notes: 'Xtra variant, 40.5 kWh battery. Charging cable included.',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: uid(),
    make: 'Maruti',
    model: 'Baleno',
    year: 2021,
    price: 720000,
    fuel: 'CNG',
    transmission: 'Manual',
    mileage: 52000,
    color: 'Splendid Silver',
    status: 'sold',
    notes: 'Factory-fitted CNG. Excellent mileage.',
    createdAt: Date.now() - 86400000 * 10
  }
];

// ---- Utils ----
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatPrice(n) {
  if (!n && n !== 0) return '—';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatMileage(n) {
  if (!n && n !== 0) return '—';
  return `${Number(n).toLocaleString('en-IN')} km`;
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

// ---- Persistence ----
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cars = JSON.parse(raw);
    } else {
      cars = SEED_CARS;
      save();
    }
  } catch {
    cars = SEED_CARS;
  }
}

// ---- Stats ----
function updateStats() {
  const total = cars.length;
  const available = cars.filter(c => c.status === 'available').length;
  const sold = cars.filter(c => c.status === 'sold').length;
  const prices = cars.filter(c => c.price > 0).map(c => c.price);
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statAvailable').textContent = available;
  document.getElementById('statSold').textContent = sold;
  document.getElementById('statAvgPrice').textContent = avg ? formatPrice(avg) : '—';
  document.getElementById('carCount').textContent = `${total} vehicle${total !== 1 ? 's' : ''}`;
}

// ---- Render ----
function renderCars() {
  const search = document.getElementById('searchInput').value.trim().toLowerCase();
  const statusFilter = document.getElementById('filterStatus').value;
  const sort = document.getElementById('filterSort').value;
  const grid = document.getElementById('carsGrid');
  const empty = document.getElementById('emptyState');

  let filtered = cars.filter(c => {
    const matchSearch = !search ||
      c.make.toLowerCase().includes(search) ||
      c.model.toLowerCase().includes(search) ||
      String(c.year).includes(search) ||
      (c.color || '').toLowerCase().includes(search);
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  filtered.sort((a, b) => {
    if (sort === 'newest') return b.createdAt - a.createdAt;
    if (sort === 'oldest') return a.createdAt - b.createdAt;
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return 0;
  });

  grid.innerHTML = '';

  if (!filtered.length) {
    empty.classList.add('visible');
    updateStats();
    return;
  }
  empty.classList.remove('visible');

  filtered.forEach((car, i) => {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.style.animationDelay = `${i * 40}ms`;
    card.innerHTML = `
      <div class="car-card-inner">
        <div class="car-card-top">
          <div class="car-make-model">
            <span class="car-make">${car.make}</span>
            <span class="car-model">${car.model}</span>
            <span class="car-year">${car.year}</span>
          </div>
          <span class="status-badge status-${car.status}">${car.status}</span>
        </div>
        <div class="car-price">${formatPrice(car.price)}</div>
        <div class="car-details">
          <div class="car-detail">
            <span class="car-detail-label">Fuel</span>
            <span class="car-detail-value">${car.fuel || '—'}</span>
          </div>
          <div class="car-detail">
            <span class="car-detail-label">Transmission</span>
            <span class="car-detail-value">${car.transmission || '—'}</span>
          </div>
          <div class="car-detail">
            <span class="car-detail-label">Mileage</span>
            <span class="car-detail-value">${formatMileage(car.mileage)}</span>
          </div>
          <div class="car-detail">
            <span class="car-detail-label">Color</span>
            <span class="car-detail-value">${car.color || '—'}</span>
          </div>
        </div>
        ${car.notes ? `<div class="car-notes">${car.notes}</div>` : ''}
        <div class="car-actions">
          <button class="btn btn-ghost btn-sm" onclick="openEdit('${car.id}')">Edit</button>
          <button class="btn btn-ghost btn-sm" onclick="openDelete('${car.id}')">Remove</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  updateStats();
}

// ---- Modal Helpers ----
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  resetForm();
}
function openDeleteModal() {
  document.getElementById('deleteOverlay').classList.add('open');
}
function closeDeleteModal() {
  document.getElementById('deleteOverlay').classList.remove('open');
  deleteTargetId = null;
}

function resetForm() {
  editingId = null;
  document.getElementById('carForm').reset();
  document.getElementById('carId').value = '';
  document.getElementById('modalTitle').textContent = 'Add Vehicle';
  document.getElementById('saveBtn').textContent = 'Save Vehicle';
  document.querySelector('input[name="carStatus"][value="available"]').checked = true;
}

// ---- Add ----
function openAdd() {
  resetForm();
  openModal();
}

// ---- Edit ----
window.openEdit = function(id) {
  const car = cars.find(c => c.id === id);
  if (!car) return;
  editingId = id;

  document.getElementById('carId').value = car.id;
  document.getElementById('carMake').value = car.make;
  document.getElementById('carModel').value = car.model;
  document.getElementById('carYear').value = car.year;
  document.getElementById('carPrice').value = car.price;
  document.getElementById('carFuel').value = car.fuel || 'Petrol';
  document.getElementById('carTransmission').value = car.transmission || 'Automatic';
  document.getElementById('carMileage').value = car.mileage || '';
  document.getElementById('carColor').value = car.color || '';
  document.getElementById('carNotes').value = car.notes || '';
  document.querySelector(`input[name="carStatus"][value="${car.status}"]`).checked = true;

  document.getElementById('modalTitle').textContent = 'Edit Vehicle';
  document.getElementById('saveBtn').textContent = 'Update Vehicle';
  openModal();
};

// ---- Delete ----
window.openDelete = function(id) {
  deleteTargetId = id;
  openDeleteModal();
};

// ---- Form Submit ----
document.getElementById('carForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const carData = {
    make: document.getElementById('carMake').value.trim(),
    model: document.getElementById('carModel').value.trim(),
    year: parseInt(document.getElementById('carYear').value),
    price: parseFloat(document.getElementById('carPrice').value) || 0,
    fuel: document.getElementById('carFuel').value,
    transmission: document.getElementById('carTransmission').value,
    mileage: parseInt(document.getElementById('carMileage').value) || 0,
    color: document.getElementById('carColor').value.trim(),
    status: document.querySelector('input[name="carStatus"]:checked').value,
    notes: document.getElementById('carNotes').value.trim(),
  };

  if (editingId) {
    const idx = cars.findIndex(c => c.id === editingId);
    if (idx > -1) {
      cars[idx] = { ...cars[idx], ...carData };
      toast('Vehicle updated successfully');
    }
  } else {
    cars.unshift({ id: uid(), createdAt: Date.now(), ...carData });
    toast('Vehicle added to inventory');
  }

  save();
  renderCars();
  closeModal();
});

// ---- Confirm Delete ----
document.getElementById('confirmDelete').addEventListener('click', function() {
  if (!deleteTargetId) return;
  cars = cars.filter(c => c.id !== deleteTargetId);
  save();
  renderCars();
  closeDeleteModal();
  toast('Vehicle removed from inventory');
});

// ---- Event Bindings ----
document.getElementById('openAddModal').addEventListener('click', openAdd);
document.getElementById('emptyAddBtn').addEventListener('click', openAdd);
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelModal').addEventListener('click', closeModal);
document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.getElementById('deleteOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeDeleteModal();
});

document.getElementById('searchInput').addEventListener('input', renderCars);
document.getElementById('filterStatus').addEventListener('change', renderCars);
document.getElementById('filterSort').addEventListener('change', renderCars);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
    closeDeleteModal();
  }
});

// ---- Init ----
load();
renderCars();
