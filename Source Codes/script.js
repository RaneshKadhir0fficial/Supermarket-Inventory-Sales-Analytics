// ============================================================
//  DATABASE (localStorage persistence)
// ============================================================
const DB_KEY = 'superstock_data';

const defaultData = {
    products: [
        { id: 'p1', sku: 'MIG-001', name: 'Whole Grain Bread', category: 'Bakery', price: 3.50, supplier: 'Baker\'s Pride', stock: 45, reorderLevel: 20 },
        { id: 'p2', sku: 'OR-102', name: 'Organic Milk 1L', category: 'Dairy', price: 2.20, supplier: 'Daily Dairy Co.', stock: 12, reorderLevel: 20 },
        { id: 'p3', sku: 'FA-203', name: 'Fresh Apples (kg)', category: 'Produce', price: 4.00, supplier: 'Green Valley Produce', stock: 50, reorderLevel: 20 },
        { id: 'p4', sku: 'BL-104', name: 'Bottled Water 500ml', category: 'Beverages', price: 0.50, supplier: 'Pacific Beverages', stock: 85, reorderLevel: 20 },
        { id: 'p5', sku: 'CT-005', name: 'Canned Tomatoes 400g', category: 'Pantry', price: 1.20, supplier: 'Global Foods Corp', stock: 10, reorderLevel: 20 },
        { id: 'p6', sku: 'OR-106', name: 'Greek Yogurt 500g', category: 'Dairy', price: 3.00, supplier: 'Daily Dairy Co.', stock: 25, reorderLevel: 20 },
        { id: 'p7', sku: 'EG-107', name: 'Eggs (dozen)', category: 'Dairy', price: 5.50, supplier: 'Daily Dairy Co.', stock: 5, reorderLevel: 25 },
        { id: 'p8', sku: 'PS-008', name: 'Pasta Spaghetti 500g', category: 'Pantry', price: 1.80, supplier: 'Global Foods Corp', stock: 120, reorderLevel: 50 },
        { id: 'p9', sku: '03-309', name: 'Orange Juice 2L', category: 'Beverages', price: 4.50, supplier: 'Pacific Beverages', stock: 18, reorderLevel: 15 },
        { id: 'p10', sku: 'BB-410', name: 'Basmati Rice 5kg', category: 'Pantry', price: 12.00, supplier: 'Global Foods Corp', stock: 30, reorderLevel: 10 }
    ],
    sales: [
        { id: 's1', date: '2026-03-01', productId: 'p1', quantity: 5, unitPrice: 3.50, total: 17.50, status: 'COMPLETED' },
        { id: 's2', date: '2026-03-02', productId: 'p2', quantity: 10, unitPrice: 2.20, total: 22.00, status: 'COMPLETED' },
        { id: 's3', date: '2026-03-03', productId: 'p3', quantity: 8, unitPrice: 4.00, total: 32.00, status: 'COMPLETED' },
        { id: 's4', date: '2026-03-04', productId: 'p4', quantity: 50, unitPrice: 0.50, total: 25.00, status: 'COMPLETED' },
        { id: 's5', date: '2026-03-05', productId: 'p5', quantity: 12, unitPrice: 1.20, total: 14.40, status: 'COMPLETED' },
        { id: 's6', date: '2026-03-06', productId: 'p6', quantity: 4, unitPrice: 3.00, total: 12.00, status: 'COMPLETED' },
        { id: 's7', date: '2026-03-07', productId: 'p1', quantity: 2, unitPrice: 3.50, total: 7.00, status: 'COMPLETED' },
        { id: 's8', date: '2026-03-08', productId: 'p2', quantity: 3, unitPrice: 2.20, total: 6.60, status: 'COMPLETED' },
        { id: 's9', date: '2026-03-09', productId: 'p3', quantity: 15, unitPrice: 4.00, total: 60.00, status: 'COMPLETED' },
        { id: 's10', date: '2026-03-10', productId: 'p4', quantity: 20, unitPrice: 0.50, total: 10.00, status: 'COMPLETED' },
        { id: 's11', date: '2026-03-11', productId: 'p5', quantity: 8, unitPrice: 1.20, total: 9.60, status: 'COMPLETED' },
        { id: 's12', date: '2026-03-12', productId: 'p1', quantity: 10, unitPrice: 3.50, total: 35.00, status: 'COMPLETED' }
    ],
    suppliers: [
        { id: 'sup1', name: 'Global Foods Corp', location: 'Regional Distribution Center', contactEmail: 'supply@globalfoods.com', phone: '+1 (555) 123-4567', activeSkus: 4, fillRate: 98, reliability: 98, leadTime: 3 },
        { id: 'sup2', name: 'Green Valley Produce', location: 'Regional Distribution Center', contactEmail: 'supply@greenvalleyproduce.com', phone: '+1 (555) 293-4287', activeSkus: 1, fillRate: 92, reliability: 99, leadTime: 1 },
        { id: 'sup3', name: 'Daily Dairy Co.', location: 'Regional Distribution Center', contactEmail: 'supply@dailydairyco.com', phone: '+1 (555) 864-6926', activeSkus: 3, fillRate: 99, reliability: 99, leadTime: 1 },
        { id: 'sup4', name: 'Baker\'s Pride', location: 'Regional Bakery', contactEmail: 'orders@bakerspride.com', phone: '+1 (555) 555-0199', activeSkus: 1, fillRate: 100, reliability: 100, leadTime: 1 },
        { id: 'sup5', name: 'Pacific Beverages', location: 'West Coast Dist.', contactEmail: 'supply@pacificbeverages.com', phone: '+1 (555) 987-6543', activeSkus: 2, fillRate: 95, reliability: 95, leadTime: 4 },
        { id: 'sup6', name: 'Swift Logistics Suppliers', location: 'Central Hub', contactEmail: 'logistics@swift.com', phone: '+1 (555) 888-9999', activeSkus: 0, fillRate: 88, reliability: 88, leadTime: 7 }
    ],
    // For reorder suggestions (hardcoded to match the image)
    reorderSuggestions: {
        'p2': 18,  // Organic Milk +18
        'p4': 115, // Bottled Water +115
        'p5': 70,  // Canned Tomatoes +70
        'p7': 25   // Eggs (dozen) +25 (implied)
    }
};

// ----- Load / Save -----
function loadData() {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
        try {
            const data = JSON.parse(raw);
            // Ensure all fields exist
            if (!data.products || !data.sales || !data.suppliers) return defaultData;
            return data;
        } catch { return defaultData; }
    }
    return defaultData;
}

function saveData(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

let AppData = loadData();

// ============================================================
//  HELPERS
// ============================================================
function getProduct(id) { return AppData.products.find(p => p.id === id); }
function getProductByName(name) { return AppData.products.find(p => p.name === name); }
function getSupplier(name) { return AppData.suppliers.find(s => s.name === name); }
function getSupplierById(id) { return AppData.suppliers.find(s => s.id === id); }

function getStockStatus(stock, reorderLevel) {
    if (stock <= 0) return 'out';
    if (stock < reorderLevel) return 'low';
    return 'healthy';
}

function formatCurrency(val) { return '$' + val.toFixed(2); }

function generateId() { return '_' + Math.random().toString(36).substr(2, 9); }

// ============================================================
//  RENDER FUNCTIONS
// ============================================================

// ----- PRODUCTS TABLE -----
function renderProducts(filter = '', category = 'all') {
    const tbody = document.getElementById('productTableBody');
    let list = AppData.products;
    if (filter) {
        const f = filter.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(f) || p.sku.toLowerCase().includes(f));
    }
    if (category !== 'all') {
        list = list.filter(p => p.category === category);
    }
    tbody.innerHTML = list.map(p => `
        <tr>
            <td><strong>${p.sku}</strong></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${formatCurrency(p.price)}</td>
            <td>${p.supplier}</td>
            <td><span class="stock-badge ${getStockStatus(p.stock, p.reorderLevel)}">${p.stock}</span></td>
            <td><button class="btn-outline small" onclick="editProduct('${p.id}')" style="padding:4px 10px;font-size:12px;">Edit</button></td>
        </tr>
    `).join('');
    document.getElementById('productCount').textContent = `Showing ${list.length} of ${AppData.products.length} products`;
}

// ----- INVENTORY TABLE -----
function renderInventory(filter = '', statusFilter = 'all') {
    const tbody = document.getElementById('inventoryTableBody');
    let list = AppData.products;
    if (filter) {
        const f = filter.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(f) || p.sku.toLowerCase().includes(f));
    }
    if (statusFilter !== 'all') {
        list = list.filter(p => getStockStatus(p.stock, p.reorderLevel) === statusFilter);
    }
    tbody.innerHTML = list.map(p => {
        const status = getStockStatus(p.stock, p.reorderLevel);
        const statusLabel = status === 'healthy' ? 'Healthy' : status === 'low' ? 'Low Stock' : 'Out of Stock';
        return `
            <tr>
                <td>${p.name}</td>
                <td><span class="stock-badge ${status}">${p.stock}</span></td>
                <td>${statusLabel}</td>
                <td>7/19/2016 10:33AM</td>
                <td><button class="btn-outline small" onclick="adjustStock('${p.id}')" style="padding:4px 10px;font-size:12px;">Manage</button></td>
            </tr>
        `;
    }).join('');
}

// ----- SALES TABLE -----
function renderSales(filter = '', period = 'alltime') {
    const tbody = document.getElementById('salesTableBody');
    let list = AppData.sales;
    if (filter) {
        const f = filter.toLowerCase();
        list = list.filter(s => {
            const p = getProduct(s.productId);
            return p && p.name.toLowerCase().includes(f);
        });
    }
    // Period filter (simplified)
    if (period === 'month') {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        list = list.filter(s => {
            const d = new Date(s.date);
            return d.getMonth() === month && d.getFullYear() === year;
        });
    } else if (period === 'week') {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        list = list.filter(s => new Date(s.date) >= weekStart);
    }
    // Sort by date desc
    list.sort((a,b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = list.map(s => {
        const p = getProduct(s.productId);
        return `
            <tr>
                <td>${s.date}</td>
                <td>${p ? p.name : 'Unknown'}</td>
                <td>${s.quantity}</td>
                <td>${formatCurrency(s.unitPrice)}</td>
                <td>${formatCurrency(s.total)}</td>
                <td><span class="stock-badge healthy">${s.status}</span></td>
            </tr>
        `;
    }).join('');

    const totalUnits = list.reduce((acc, s) => acc + s.quantity, 0);
    document.getElementById('salesTotalUnits').textContent = `Total Sales Volume: ${totalUnits} units`;
}

// ----- SUPPLIERS -----
function renderSuppliers() {
    // Partner details grid
    const grid = document.getElementById('partnerGrid');
    grid.innerHTML = AppData.suppliers.map(s => `
        <div class="partner-card">
            <h4>${s.name}</h4>
            <div class="sub">${s.location}</div>
            <div class="detail"><span>Contact</span><span>${s.contactEmail}</span></div>
            <div class="detail"><span>Phone</span><span>${s.phone}</span></div>
            <div class="detail"><span>Active SKU Count</span><span>${s.activeSkus} SKUs</span></div>
            <div class="detail"><span>Fill Rate</span><span>${s.fillRate}% FULFILLED ORDERS</span></div>
            <div class="detail"><span>Reliability</span><span>${s.reliability}% FULFILLED ORDERS</span></div>
        </div>
    `).join('');

    // Lead time bars
    const barsContainer = document.getElementById('leadTimeBars');
    const sorted = [...AppData.suppliers].sort((a,b) => a.leadTime - b.leadTime);
    const maxLead = Math.max(...sorted.map(s => s.leadTime), 1);
    barsContainer.innerHTML = sorted.map(s => {
        const pct = (s.leadTime / maxLead) * 100;
        return `
            <div class="lead-time-item">
                <span style="min-width:160px;">${s.name}</span>
                <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;"></div></div>
                <span class="days">${s.leadTime} days</span>
            </div>
        `;
    }).join('');

    // Chart for supplier fill rate
    const ctx = document.getElementById('supplierChart').getContext('2d');
    if (window.supplierChartInstance) window.supplierChartInstance.destroy();
    window.supplierChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: AppData.suppliers.map(s => s.name),
            datasets: [{
                label: 'Fill Rate %',
                data: AppData.suppliers.map(s => s.fillRate),
                backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'],
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });
}

// ----- REORDER -----
function renderReorder() {
    const container = document.getElementById('reorderList');
    // Show products that need reorder (stock < reorderLevel) or specifically suggested
    const critical = AppData.products.filter(p => p.stock < p.reorderLevel);
    // Also include the ones from the image (even if stock is above? Bottled water 85 is above 20 but image shows it)
    // We'll include the ones explicitly in the suggestions map
    const suggestedIds = Object.keys(AppData.reorderSuggestions);
    const toShow = new Set();
    critical.forEach(p => toShow.add(p.id));
    suggestedIds.forEach(id => toShow.add(id));

    if (toShow.size === 0) {
        container.innerHTML = '<div class="reorder-item" style="justify-content:center;color:#94a3b8;">All products are well stocked.</div>';
        return;
    }

    container.innerHTML = Array.from(toShow).map(id => {
        const p = getProduct(id);
        if (!p) return '';
        const suggest = AppData.reorderSuggestions[id] || Math.max(p.reorderLevel - p.stock + 10, 5);
        const supplier = getSupplier(p.supplier);
        const leadTime = supplier ? supplier.leadTime : '--';
        return `
            <div class="reorder-item">
                <div class="info">
                    <span class="name">${p.name}</span>
                    <span class="sku">SKU: ${p.sku}</span>
                </div>
                <div class="stock-suggest">
                    <span class="stock">STOCK <strong>${p.stock}</strong></span>
                    <span class="suggest">SUGGESTED +${suggest}</span>
                </div>
                <div class="supplier-info">
                    <span><i class="fas fa-truck"></i> Supplier: ${p.supplier}</span>
                    <span><i class="fas fa-clock"></i> Lead Time: ${leadTime} Day${leadTime > 1 ? 's' : ''}</span>
                </div>
                <div class="actions">
                    <button class="btn-primary" style="padding:6px 14px;font-size:12px;" onclick="generateOrder('${p.id}')">Generate Order</button>
                </div>
            </div>
        `;
    }).join('');
}

// ----- REPORTS -----
function renderReports() {
    // Top Selling Products
    const salesMap = {};
    AppData.sales.forEach(s => {
        if (!salesMap[s.productId]) salesMap[s.productId] = { units: 0, revenue: 0 };
        salesMap[s.productId].units += s.quantity;
        salesMap[s.productId].revenue += s.total;
    });
    const top = Object.keys(salesMap).map(pid => {
        const p = getProduct(pid);
        return { ...salesMap[pid], name: p ? p.name : 'Unknown', id: pid };
    }).sort((a,b) => b.units - a.units).slice(0, 5);

    const topBody = document.getElementById('topSellingBody');
    topBody.innerHTML = top.map(item => `
        <tr><td>${item.name}</td><td>${item.units}</td><td>${formatCurrency(item.revenue)}</td></tr>
    `).join('');

    // Supplier Reliability
    const supBody = document.getElementById('supplierReliabilityBody');
    supBody.innerHTML = AppData.suppliers.map(s => {
        const status = s.fillRate >= 95 ? 'Prime' : s.fillRate >= 85 ? 'Regular' : 'Needs Review';
        return `<tr><td>${s.name}</td><td>${s.fillRate}%</td><td>${status}</td></tr>`;
    }).join('');

    // KPI updates
    const totalRev = AppData.sales.reduce((acc, s) => acc + s.total, 0);
    const totalUnits = AppData.sales.reduce((acc, s) => acc + s.quantity, 0);
    const avgOrder = AppData.sales.length > 0 ? totalRev / AppData.sales.length : 0;
    const invVal = AppData.products.reduce((acc, p) => acc + (p.price * p.stock), 0);

    document.getElementById('rMonthlyRevenue').textContent = formatCurrency(totalRev);
    document.getElementById('rInventoryValue').textContent = formatCurrency(invVal);
    document.getElementById('rAvgOrder').textContent = formatCurrency(avgOrder);
    document.getElementById('rUnitsSold').textContent = totalUnits;
}

// ----- DASHBOARD -----
function renderDashboard() {
    // KPI
    const totalRev = AppData.sales.reduce((acc, s) => acc + s.total, 0);
    const lowCount = AppData.products.filter(p => p.stock < p.reorderLevel).length;
    const totalProducts = AppData.products.length;
    // turnover: total units sold / average stock (approx)
    const totalUnits = AppData.sales.reduce((acc, s) => acc + s.quantity, 0);
    const avgStock = AppData.products.reduce((acc, p) => acc + p.stock, 0) / totalProducts;
    const turnover = avgStock > 0 ? (totalUnits / avgStock) : 0;

    document.getElementById('totalRevenue').textContent = formatCurrency(totalRev);
    document.getElementById('lowStockCount').textContent = lowCount;
    document.getElementById('inventoryTurnover').textContent = turnover.toFixed(1);
    document.getElementById('totalProducts').textContent = totalProducts;

    // Fast movers
    const salesMap = {};
    AppData.sales.forEach(s => {
        if (!salesMap[s.productId]) salesMap[s.productId] = 0;
        salesMap[s.productId] += s.quantity;
    });
    const sorted = Object.keys(salesMap).map(pid => {
        const p = getProduct(pid);
        return { name: p ? p.name : 'Unknown', units: salesMap[pid] };
    }).sort((a,b) => b.units - a.units).slice(0, 5);
    const fastList = document.getElementById('fastMovers');
    fastList.innerHTML = sorted.map(item => `<li>${item.name}</li>`).join('');

    // Alert list
    const alerts = AppData.products.filter(p => p.stock < p.reorderLevel);
    const alertList = document.getElementById('alertList');
    alertList.innerHTML = alerts.map(p => {
        const dot = p.stock <= 5 ? 'danger' : 'warning';
        return `<li><span class="alert-dot ${dot}"></span> ${p.name}: ${p.stock} left</li>`;
    }).join('');

    // Charts
    renderCharts();
}

// ----- CHARTS -----
function renderCharts() {
    // Sales Chart (daily revenue)
    const ctx1 = document.getElementById('salesChart').getContext('2d');
    if (window.salesChartInstance) window.salesChartInstance.destroy();
    const daily = {};
    AppData.sales.forEach(s => {
        if (!daily[s.date]) daily[s.date] = 0;
        daily[s.date] += s.total;
    });
    const labels = Object.keys(daily).sort();
    const values = labels.map(d => daily[d]);
    window.salesChartInstance = new Chart(ctx1, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Revenue', data: values, backgroundColor: '#3b82f6', borderRadius: 4 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Category Distribution
    const ctx2 = document.getElementById('categoryChart').getContext('2d');
    if (window.categoryChartInstance) window.categoryChartInstance.destroy();
    const catMap = {};
    AppData.products.forEach(p => {
        if (!catMap[p.category]) catMap[p.category] = 0;
        catMap[p.category] += p.price * p.stock;
    });
    const catLabels = Object.keys(catMap);
    const catValues = catLabels.map(c => catMap[c]);
    window.categoryChartInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: catLabels,
            datasets: [{ data: catValues, backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'] }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });

    // Supplier chart is rendered in renderSuppliers
}

// ============================================================
//  ACTIONS (Add, Edit, Reset, etc.)
// ============================================================

function editProduct(id) {
    const p = getProduct(id);
    if (!p) return;
    openModal('Edit Product', `
        <div class="form-group"><label>SKU</label><input type="text" id="editSku" value="${p.sku}" /></div>
        <div class="form-group"><label>Name</label><input type="text" id="editName" value="${p.name}" /></div>
        <div class="form-group"><label>Category</label><input type="text" id="editCategory" value="${p.category}" /></div>
        <div class="form-group"><label>Price</label><input type="number" step="0.01" id="editPrice" value="${p.price}" /></div>
        <div class="form-group"><label>Supplier</label><input type="text" id="editSupplier" value="${p.supplier}" /></div>
        <div class="form-group"><label>Stock</label><input type="number" id="editStock" value="${p.stock}" /></div>
        <div class="form-group"><label>Reorder Level</label><input type="number" id="editReorder" value="${p.reorderLevel}" /></div>
        <button class="btn-primary" onclick="saveEditProduct('${p.id}')">Save Changes</button>
    `);
}

function saveEditProduct(id) {
    const p = getProduct(id);
    if (!p) return;
    p.sku = document.getElementById('editSku').value;
    p.name = document.getElementById('editName').value;
    p.category = document.getElementById('editCategory').value;
    p.price = parseFloat(document.getElementById('editPrice').value);
    p.supplier = document.getElementById('editSupplier').value;
    p.stock = parseInt(document.getElementById('editStock').value);
    p.reorderLevel = parseInt(document.getElementById('editReorder').value);
    saveData(AppData);
    closeModal();
    refreshAll();
}

function adjustStock(id) {
    const p = getProduct(id);
    if (!p) return;
    const newStock = prompt(`Adjust stock for ${p.name} (current: ${p.stock}):`, p.stock);
    if (newStock !== null) {
        const val = parseInt(newStock);
        if (!isNaN(val) && val >= 0) {
            p.stock = val;
            saveData(AppData);
            refreshAll();
        }
    }
}

function generateOrder(id) {
    const p = getProduct(id);
    if (!p) return;
    const suggest = AppData.reorderSuggestions[id] || Math.max(p.reorderLevel - p.stock + 10, 5);
    const confirmMsg = `Generate order for ${p.name}? Add +${suggest} units.`;
    if (confirm(confirmMsg)) {
        p.stock += suggest;
        saveData(AppData);
        alert(`Order generated! ${p.name} stock increased to ${p.stock}.`);
        refreshAll();
    }
}

function addProduct() {
    openModal('Add Product', `
        <div class="form-group"><label>SKU</label><input type="text" id="newSku" placeholder="e.g. ABC-001" /></div>
        <div class="form-group"><label>Name</label><input type="text" id="newName" placeholder="Product name" /></div>
        <div class="form-group"><label>Category</label><input type="text" id="newCategory" placeholder="Category" /></div>
        <div class="form-group"><label>Price</label><input type="number" step="0.01" id="newPrice" placeholder="0.00" /></div>
        <div class="form-group"><label>Supplier</label><input type="text" id="newSupplier" placeholder="Supplier name" /></div>
        <div class="form-group"><label>Stock</label><input type="number" id="newStock" placeholder="0" /></div>
        <div class="form-group"><label>Reorder Level</label><input type="number" id="newReorder" placeholder="20" value="20" /></div>
        <button class="btn-primary" onclick="saveNewProduct()">Add Product</button>
    `);
}

function saveNewProduct() {
    const sku = document.getElementById('newSku').value.trim();
    const name = document.getElementById('newName').value.trim();
    const category = document.getElementById('newCategory').value.trim();
    const price = parseFloat(document.getElementById('newPrice').value);
    const supplier = document.getElementById('newSupplier').value.trim();
    const stock = parseInt(document.getElementById('newStock').value) || 0;
    const reorderLevel = parseInt(document.getElementById('newReorder').value) || 20;
    if (!sku || !name || !category || isNaN(price) || !supplier) {
        alert('Please fill all required fields.');
        return;
    }
    const newProduct = {
        id: generateId(),
        sku, name, category, price, supplier, stock, reorderLevel
    };
    AppData.products.push(newProduct);
    // Update supplier active SKU count
    const sup = getSupplier(supplier);
    if (sup) sup.activeSkus = (sup.activeSkus || 0) + 1;
    saveData(AppData);
    closeModal();
    refreshAll();
}

function newSale() {
    openModal('New Sale', `
        <div class="form-group"><label>Product</label>
            <select id="saleProduct">
                ${AppData.products.map(p => `<option value="${p.id}">${p.name} (${p.sku})</option>`).join('')}
            </select>
        </div>
        <div class="form-group"><label>Quantity</label><input type="number" id="saleQuantity" value="1" min="1" /></div>
        <div class="form-group"><label>Date</label><input type="date" id="saleDate" value="${new Date().toISOString().split('T')[0]}" /></div>
        <button class="btn-primary" onclick="saveNewSale()">Record Sale</button>
    `);
}

function saveNewSale() {
    const productId = document.getElementById('saleProduct').value;
    const quantity = parseInt(document.getElementById('saleQuantity').value);
    const date = document.getElementById('saleDate').value;
    if (!productId || !quantity || quantity <= 0) {
        alert('Invalid sale data.');
        return;
    }
    const p = getProduct(productId);
    if (!p) return;
    if (p.stock < quantity) {
        alert(`Not enough stock! Available: ${p.stock}`);
        return;
    }
    const total = p.price * quantity;
    const sale = {
        id: generateId(),
        date: date || new Date().toISOString().split('T')[0],
        productId: p.id,
        quantity: quantity,
        unitPrice: p.price,
        total: total,
        status: 'COMPLETED'
    };
    AppData.sales.push(sale);
    p.stock -= quantity;
    saveData(AppData);
    closeModal();
    refreshAll();
}

function resetAppData() {
    if (confirm('WARNING: This will reset ALL data to initial demo state. Are you sure?')) {
        if (confirm('Are you absolutely sure? This cannot be undone.')) {
            AppData = JSON.parse(JSON.stringify(defaultData));
            // Re-apply default suggestions
            saveData(AppData);
            refreshAll();
            alert('Data has been reset.');
        }
    }
}

// ============================================================
//  MODAL CONTROLS
// ============================================================
function openModal(title, html) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// ============================================================
//  NAVIGATION
// ============================================================
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
    // Refresh content for that page
    switch(page) {
        case 'dashboard': renderDashboard(); break;
        case 'products': renderProducts(); break;
        case 'inventory': renderInventory(); break;
        case 'sales': renderSales(); break;
        case 'suppliers': renderSuppliers(); break;
        case 'reorder': renderReorder(); break;
        case 'reports': renderReports(); break;
        case 'settings': break;
    }
}

function refreshAll() {
    renderDashboard();
    renderProducts(document.getElementById('productSearch')?.value || '', document.getElementById('categoryFilter')?.value || 'all');
    renderInventory(document.getElementById('inventorySearch')?.value || '', document.querySelector('.status-tab.active')?.dataset.status || 'all');
    renderSales(document.getElementById('salesSearch')?.value || '', document.getElementById('salesPeriod')?.value || 'alltime');
    renderSuppliers();
    renderReorder();
    renderReports();
}

// ============================================================
//  EVENT LISTENERS & INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateTo(page);
        });
    });

    // Product search/filter
    document.getElementById('productSearch')?.addEventListener('input', function() {
        renderProducts(this.value, document.getElementById('categoryFilter').value);
    });
    document.getElementById('categoryFilter')?.addEventListener('change', function() {
        renderProducts(document.getElementById('productSearch').value, this.value);
    });

    // Inventory search
    document.getElementById('inventorySearch')?.addEventListener('input', function() {
        const status = document.querySelector('.status-tab.active')?.dataset.status || 'all';
        renderInventory(this.value, status);
    });

    // Status tabs
    document.querySelectorAll('.status-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderInventory(document.getElementById('inventorySearch').value, this.dataset.status);
        });
    });

    // Sales search/period
    document.getElementById('salesSearch')?.addEventListener('input', function() {
        renderSales(this.value, document.getElementById('salesPeriod').value);
    });
    document.getElementById('salesPeriod')?.addEventListener('change', function() {
        renderSales(document.getElementById('salesSearch').value, this.value);
    });

    // Buttons
    document.getElementById('addProductBtn')?.addEventListener('click', addProduct);
    document.getElementById('newSaleBtn')?.addEventListener('click', newSale);
    document.getElementById('resetDataBtn')?.addEventListener('click', resetAppData);
    document.getElementById('modalClose')?.addEventListener('click', closeModal);
    document.getElementById('modalOverlay')?.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Settings toggles (just for UI feedback)
    document.querySelectorAll('.toggle-label input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function() {
            // Just save preference in data (optional)
            console.log(this.id, this.checked);
        });
    });

    // Reorder level input (settings)
    document.getElementById('reorderLevel')?.addEventListener('change', function() {
        const val = parseInt(this.value);
        if (!isNaN(val) && val > 0) {
            AppData.products.forEach(p => p.reorderLevel = val);
            saveData(AppData);
            refreshAll();
        }
    });

    // Default to Dashboard
    navigateTo('dashboard');
});