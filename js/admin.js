// Global variables
let products = [];
let categories = [];
let nextId = 1;
let editingProductId = null;
let deletingProductId = null;

// Bootstrap modals
const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Initialize the application
function initializeApp() {
    // Try to load existing data from localStorage first
    try {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            // Find the highest ID to set nextId correctly
            nextId = products.reduce((max, product) => Math.max(max, parseInt(product.ID || 0) + 1), 1);
        } else {
            // If no local storage data, try to load from the initial XLSX file
            loadInitialProductData();
        }
    } catch (error) {
        console.error('Error loading saved products:', error);
        loadInitialProductData();
    }

    // Extract categories from products
    updateCategoriesList();
    
    // Render products table
    renderProductsTable();
    
    // Populate category dropdowns
    populateCategoryDropdowns();
}

// Load initial product data from XLSX file if available
function loadInitialProductData() {
    try {
        // Here we're attempting to fetch the products.xlsx from our server
        fetch('products.xlsx')
            .then(response => response.blob())
            .then(blob => {
                readXlsxFile(blob, function(data) {
                    if (data && data.length > 0) {
                        products = data;
                        nextId = products.reduce((max, product) => Math.max(max, parseInt(product.ID || 0) + 1), 1);
                        
                        // Update UI
                        updateCategoriesList();
                        renderProductsTable();
                        populateCategoryDropdowns();
                        
                        // Save to localStorage for future use
                        localStorage.setItem('products', JSON.stringify(products));
                    }
                });
            })
            .catch(error => {
                console.error('Error loading initial product data:', error);
                // Initialize with empty products if we can't load the file
                products = [];
                nextId = 1;
            });
    } catch (error) {
        console.error('Error in loadInitialProductData:', error);
    }
}

// Read XLSX file and parse data
function readXlsxFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        callback(jsonData);
    };
    reader.readAsArrayBuffer(file);
}

// Set up all event listeners
function setupEventListeners() {
    // Add product form submission
    document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);
    
    // Add category form submission
    document.getElementById('add-category-form').addEventListener('submit', handleAddCategory);
    
    // Save edits button click
    document.getElementById('save-edit-btn').addEventListener('click', handleSaveEdit);
    
    // Confirm delete button click
    document.getElementById('confirm-delete-btn').addEventListener('click', handleConfirmDelete);
    
    // Export XLSX button click
    document.getElementById('export-xlsx-btn').addEventListener('click', handleExportXlsx);
    
    // Import data button click
    document.getElementById('import-btn').addEventListener('click', handleImportData);
    
    // Save all changes button click
    document.getElementById('save-all-btn').addEventListener('click', handleSaveAll);
    
    // Product search input
    document.getElementById('product-search').addEventListener('input', handleProductSearch);
    
    // Image preview for add product
    document.getElementById('image-file-input').addEventListener('change', function(e) {
        handleImagePreview(e, 'image-preview');
    });
    
    // Image preview for edit product
    document.getElementById('edit-image-file-input').addEventListener('change', function(e) {
        handleImagePreview(e, 'edit-image-preview');
    });

    // Image path input change for add product
    document.getElementById('product-image').addEventListener('input', function(e) {
        updateImagePreviewFromPath(e.target.value, 'image-preview');
    });

    // Image path input change for edit product
    document.getElementById('edit-product-image').addEventListener('input', function(e) {
        updateImagePreviewFromPath(e.target.value, 'edit-image-preview');
    });

    // Navigation links smooth scrolling
    document.querySelectorAll('#sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
                
                // Update active link
                document.querySelectorAll('#sidebar .nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Update image preview from file input
function handleImagePreview(event, previewId) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewElement = document.getElementById(previewId);
        previewElement.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
    };
    reader.readAsDataURL(file);
}

// Update image preview from path input
function updateImagePreviewFromPath(path, previewId) {
    if (!path) {
        document.getElementById(previewId).innerHTML = '';
        return;
    }
    
    const previewElement = document.getElementById(previewId);
    previewElement.innerHTML = `<img src="${path}" alt="Image Preview" onerror="this.src='images/default-product.png';">`;
}

// Handle adding a new product
function handleAddProduct(e) {
    e.preventDefault();
    
    const productName = document.getElementById('product-name').value;
    const productCategory = document.getElementById('product-category').value;
    const productDescription = document.getElementById('product-description').value;
    const productImagePath = document.getElementById('product-image').value;
    
    const newProduct = {
        ID: nextId++,
        'Product Name': productName,
        Description: productDescription,
        Category: productCategory,
        Image: productImagePath || 'images/default-product.png'
    };
    
    products.push(newProduct);
    saveProducts();
    renderProductsTable();
    
    // Reset form
    document.getElementById('add-product-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    
    // Show success notification
    showNotification('Product added successfully!', 'success');
}

// Handle adding a new category
function handleAddCategory(e) {
    e.preventDefault();
    
    const categoryName = document.getElementById('category-name').value;
    
    if (categoryName && !categories.includes(categoryName)) {
        categories.push(categoryName);
        populateCategoryDropdowns();
        renderCategoriesList();
        
        // Reset form
        document.getElementById('add-category-form').reset();
        
        // Show success notification
        showNotification('Category added successfully!', 'success');
        
        // Save categories to localStorage
        localStorage.setItem('categories', JSON.stringify(categories));
    } else {
        showNotification('Category already exists!', 'danger');
    }
}

// Handle edit product button click
function handleEditProduct(productId) {
    const product = products.find(p => p.ID == productId);
    if (!product) return;
    
    editingProductId = productId;
    
    // Fill form fields
    document.getElementById('edit-product-id').value = product.ID;
    document.getElementById('edit-product-name').value = product['Product Name'];
    document.getElementById('edit-product-category').value = product.Category || '';
    document.getElementById('edit-product-description').value = product.Description || '';
    document.getElementById('edit-product-image').value = product.Image || '';
    
    // Update image preview
    updateImagePreviewFromPath(product.Image, 'edit-image-preview');
    
    // Show modal
    editProductModal.show();
}

// Handle saving edited product
function handleSaveEdit() {
    if (!editingProductId) return;
    
    const productIndex = products.findIndex(p => p.ID == editingProductId);
    if (productIndex === -1) return;
    
    const updatedProduct = {
        ...products[productIndex],
        'Product Name': document.getElementById('edit-product-name').value,
        Description: document.getElementById('edit-product-description').value,
        Category: document.getElementById('edit-product-category').value,
        Image: document.getElementById('edit-product-image').value || products[productIndex].Image
    };
    
    products[productIndex] = updatedProduct;
    saveProducts();
    renderProductsTable();
    
    // Hide modal
    editProductModal.hide();
    
    // Show success notification
    showNotification('Product updated successfully!', 'success');
}

// Handle delete product button click
function handleDeleteProduct(productId) {
    const product = products.find(p => p.ID == productId);
    if (!product) return;
    
    deletingProductId = productId;
    
    // Set product name in confirmation modal
    document.getElementById('delete-product-name').textContent = product['Product Name'];
    
    // Show confirmation modal
    deleteConfirmModal.show();
}

// Handle confirmed delete
function handleConfirmDelete() {
    if (!deletingProductId) return;
    
    const productIndex = products.findIndex(p => p.ID == deletingProductId);
    if (productIndex === -1) return;
    
    products.splice(productIndex, 1);
    saveProducts();
    renderProductsTable();
    
    // Hide modal
    deleteConfirmModal.hide();
    
    // Show success notification
    showNotification('Product deleted successfully!', 'success');
}

// Handle exporting data as XLSX
function handleExportXlsx() {
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(products);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    
    // Generate XLSX file and trigger download
    XLSX.writeFile(wb, 'products.xlsx');
    
    // Show success notification
    showNotification('Data exported successfully!', 'success');
}

// Handle importing data
function handleImportData() {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Please select a file to import!', 'danger');
        return;
    }
    
    readXlsxFile(file, function(data) {
        if (data && data.length > 0) {
            products = data;
            nextId = products.reduce((max, product) => Math.max(max, parseInt(product.ID || 0) + 1), 1);
            
            // Update UI
            updateCategoriesList();
            renderProductsTable();
            populateCategoryDropdowns();
            
            // Save to localStorage
            saveProducts();
            
            // Reset file input
            fileInput.value = '';
            
            // Show success notification
            showNotification('Data imported successfully!', 'success');
        } else {
            showNotification('No data found in the file!', 'danger');
        }
    });
}

// Handle saving all changes
function handleSaveAll() {
    saveProducts();
    showNotification('All changes saved!', 'success');
}

// Handle product search
function handleProductSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('#products-table-body tr');
    
    tableRows.forEach(row => {
        const productName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const productDesc = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        const productCategory = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
        
        if (
            productName.includes(searchTerm) || 
            productDesc.includes(searchTerm) || 
            productCategory.includes(searchTerm)
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Save products to localStorage
function saveProducts() {
    try {
        localStorage.setItem('products', JSON.stringify(products));
        
        // Also update categories list in case there are new categories
        updateCategoriesList();
    } catch (error) {
        console.error('Error saving products:', error);
    }
}

// Update categories list from products
function updateCategoriesList() {
    const uniqueCategories = new Set();
    
    // Extract all categories from products
    products.forEach(product => {
        if (product.Category) {
            uniqueCategories.add(product.Category);
        }
    });
    
    // Try to load additional categories from localStorage
    try {
        const savedCategories = localStorage.getItem('categories');
        if (savedCategories) {
            const parsedCategories = JSON.parse(savedCategories);
            parsedCategories.forEach(category => uniqueCategories.add(category));
        }
    } catch (error) {
        console.error('Error loading saved categories:', error);
    }
    
    // Update global categories array
    categories = Array.from(uniqueCategories).sort();
    
    // Render categories list
    renderCategoriesList();
}

// Render the products table
function renderProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Get image path or use default
        const imagePath = product.Image || 'images/default-product.png';
        
        row.innerHTML = `
            <td>${product.ID}</td>
            <td><img src="${imagePath}" alt="${product['Product Name']}" onerror="this.src='images/default-product.png';"></td>
            <td>${product['Product Name'] || ''}</td>
            <td>${product.Description || ''}</td>
            <td>${product.Category || ''}</td>
            <td>
                <button class="btn btn-sm btn-primary action-btn edit-btn" data-id="${product.ID}">
                    Edit
                </button>
                <button class="btn btn-sm btn-danger action-btn delete-btn" data-id="${product.ID}">
                    Delete
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => handleEditProduct(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteProduct(btn.getAttribute('data-id')));
    });
}

// Render the categories list
function renderCategoriesList() {
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '';
    
    categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        
        // Count products in this category
        const productCount = products.filter(p => p.Category === category).length;
        
        li.innerHTML = `
            ${category}
            <div>
                <span class="badge bg-primary">${productCount} products</span>
                <span class="badge bg-danger delete-category" data-category="${category}">×</span>
            </div>
        `;
        
        categoriesList.appendChild(li);
    });
    
    // Add event listeners to delete category buttons
    document.querySelectorAll('.delete-category').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteCategory(btn.getAttribute('data-category')));
    });
}

// Handle deleting a category
function handleDeleteCategory(category) {
    // Check if any products use this category
    const productsWithCategory = products.filter(p => p.Category === category);
    
    if (productsWithCategory.length > 0) {
        if (!confirm(`This category is used by ${productsWithCategory.length} products. Delete anyway?`)) {
            return;
        }
    }
    
    // Remove category from list
    const categoryIndex = categories.indexOf(category);
    if (categoryIndex !== -1) {
        categories.splice(categoryIndex, 1);
    }
    
    // Update products that used this category (set to empty string)
    products.forEach(product => {
        if (product.Category === category) {
            product.Category = '';
        }
    });
    
    // Update UI
    renderCategoriesList();
    renderProductsTable();
    populateCategoryDropdowns();
    
    // Save changes
    saveProducts();
    localStorage.setItem('categories', JSON.stringify(categories));
    
    // Show notification
    showNotification('Category deleted successfully!', 'success');
}

// Populate category dropdowns
function populateCategoryDropdowns() {
    const dropdowns = [
        document.getElementById('product-category'),
        document.getElementById('edit-product-category')
    ];
    
    dropdowns.forEach(dropdown => {
        if (!dropdown) return;
        
        // Clear existing options
        dropdown.innerHTML = '';
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Select Category --';
        dropdown.appendChild(emptyOption);
        
        // Add category options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            dropdown.appendChild(option);
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.role = 'alert';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 150);
    }, 3000);
}

// Convert data URL to file object
function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
}

// Initialize with sample data if no products exist
function initializeSampleData() {
    if (products.length === 0) {
        products = [
            {
                ID: 1,
                'Product Name': 'Nordic Chair',
                Description: 'A sleek nordic style chair',
                Category: 'Epoxy Grout',
                Image: 'images/person_1.jpg'
            },
            {
                ID: 2,
                'Product Name': 'Ergonomic Hammer',
                Description: 'Heavy-duty ergonomic hammer',
                Category: 'Hammer',
                Image: 'SDS_7331.JPG'
            },
            {
                ID: 3,
                'Product Name': 'Tile Adhesive Pro',
                Description: 'High-strength adhesive for tiles',
                Category: 'Tile Adhesive',
                Image: 'SDS_7353.JPG'
            }
        ];
        
        nextId = 4;
        saveProducts();
        updateCategoriesList();
    }
}

// Check if we need to initialize with sample data (on first run)
if (products.length === 0 && !localStorage.getItem('productsInitialized')) {
    initializeSampleData();
    localStorage.setItem('productsInitialized', 'true');
}