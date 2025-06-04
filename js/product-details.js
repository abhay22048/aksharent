// Function to render specifications
function renderSpecifications(specifications) {
  if (!specifications) return '';
  
  const specs = safeJSONParse(specifications);
  if (!specs || !Array.isArray(specs) || specs.length === 0) return '';
  
  const specsHTML = specs.map(spec => `
    <div class="spec-item">
      <div class="spec-key">${spec.key || 'N/A'}</div>
      <div class="spec-value">${spec.value || ''}</div>
    </div>
  `).join('');
  
  return `
    <div class="product-info-section specifications">
      <h4 class="section-title">
        <i class="fas fa-cogs"></i>
        Specifications
      </h4>
      <div class="specs-grid">
        ${specsHTML}
      </div>
    </div>
  `;
}

// Function to render features
function renderFeatures(features) {
  if (!features) return '';
  
  const featuresArray = safeJSONParse(features);
  if (!featuresArray || !Array.isArray(featuresArray) || featuresArray.length === 0) return '';
  
  const featuresHTML = featuresArray.map(feature => `
    <li>${feature}</li>
  `).join('');
  
  return `
    <div class="product-info-section features">
      <h4 class="section-title">
        <i class="fas fa-star"></i>
        Key Features
      </h4>
      <ul class="features-list">
        ${featuresHTML}
      </ul>
    </div>
  `;
}

// Function to render applications
function renderApplications(applications) {
  if (!applications) return '';
  
  const applicationsArray = safeJSONParse(applications);
  if (!applicationsArray || !Array.isArray(applicationsArray) || applicationsArray.length === 0) return '';
  
  const applicationsHTML = applicationsArray.map(application => `
    <li>${application}</li>
  `).join('');
  
  return `
    <div class="product-info-section applications">
      <h4 class="section-title">
        <i class="fas fa-wrench"></i>
        Applications
      </h4>
      <ul class="applications-list">
        ${applicationsHTML}
      </ul>
    </div>
  `;
}

// Function to render product details
function renderProductDetails(product) {
  const productDetails = document.getElementById('product-details');
  
  if (!product) {
    productDetails.innerHTML = `
      <div class="col-12">
        <div class="product-not-found">
          <h3><i class="fas fa-exclamation-triangle"></i> Product Not Found</h3>
          <p>Sorry, the product you are looking for does not exist or may have been removed.</p>
          <a href="shop.html" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i> Back to Products
          </a>
        </div>
      </div>
    `;
    return;
  }

  // Update breadcrumb
  document.getElementById('breadcrumb-product').textContent = product['Product Name'] || 'Product Details';

  const productHTML = `
    <div class="col-12 col-lg-6 mb-5">
      <div class="product-image-container">
        <img src="${product['Image'] || 'images/default-product.png'}" 
             class="img-fluid product-thumbnail" 
             alt="${product['Product Name']}"
             onerror="this.src='images/default-product.png'">
      </div>
    </div>
    <div class="col-12 col-lg-6">
      <h1 class="product-title">${product['Product Name'] || 'Unnamed Product'}</h1>
      
      <div class="product-category">
        <i class="fas fa-tag"></i> ${product['Category'] || 'Uncategorized'}
      </div>
      
      <p class="product-price">
        <i class="fas fa-rupee-sign"></i> ${product['Price'] ? product['Price'].toLocaleString('en-IN') : 'Price on Request'}
      </p>
      
      <div class="product-info-section description">
        <h4 class="section-title">
          <i class="fas fa-info-circle"></i>
          Description
        </h4>
        <p>${product['Description'] || 'No description available.'}</p>
      </div>
      
      <div class="d-flex flex-wrap gap-3 mt-4">
        <a href="shop.html" class="btn back-button">
          <i class="fas fa-arrow-left"></i> Back to Products
        </a>
        <a href="#"
           onclick="sendEnquiry('${product['Product Name']}', '${product['Description'] || ''}', '${product['Image'] || 'images/default-product.png'}', '${product['Price'] || 'N/A'}')"
           class="btn enquiry-button">
          <i class="fas fa-phone"></i> Enquire Now
        </a>
      </div>
    </div>
    
    <div class="col-12 mt-5">
      ${renderSpecifications(product['Specifications'])}
      ${renderFeatures(product['Features'])}
      ${renderApplications(product['Applications'])}
    </div>
  `;
  
  productDetails.innerHTML = productHTML;
}