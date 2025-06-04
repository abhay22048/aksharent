(function() {
	'use strict';

	var tinyslider = function() {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
				items: 1,
				axis: "horizontal",
				controlsContainer: "#testimonial-nav",
				swipeAngle: false,
				speed: 700,
				nav: true,
				controls: true,
				autoplay: true,
				autoplayHoverPause: true,
				autoplayTimeout: 3500,
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();

	
	document.querySelector('.close').addEventListener('click', () => {
		document.getElementById('description-modal').style.display = 'none';
	});
	
	window.addEventListener('click', (event) => {
		const modal = document.getElementById('description-modal');
		if (event.target === modal) {
			modal.style.display = 'none';
		}
	});
	

	var sitePlusMinus = function() {

		var value,
    		quantity = document.getElementsByClassName('quantity-container');

		function createBindings(quantityContainer) {
	      var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
	      var increase = quantityContainer.getElementsByClassName('increase')[0];
	      var decrease = quantityContainer.getElementsByClassName('decrease')[0];
	      increase.addEventListener('click', function (e) { increaseValue(e, quantityAmount); });
	      decrease.addEventListener('click', function (e) { decreaseValue(e, quantityAmount); });
	    }

	    function init() {
	        for (var i = 0; i < quantity.length; i++ ) {
						createBindings(quantity[i]);
	        }
	    };

	    function increaseValue(event, quantityAmount) {
	        value = parseInt(quantityAmount.value, 10);

	        console.log(quantityAmount, quantityAmount.value);

	        value = isNaN(value) ? 0 : value;
	        value++;
	        quantityAmount.value = value;
	    }

	    function decreaseValue(event, quantityAmount) {
	        value = parseInt(quantityAmount.value, 10);

	        value = isNaN(value) ? 0 : value;
	        if (value > 0) value--;

	        quantityAmount.value = value;
	    }
	    
	    init();
		
	};
	sitePlusMinus();


})()
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
	// Get all category buttons
	const categoryButtons = document.querySelectorAll('.category-btn');
	// Get all product items
	const productItems = document.querySelectorAll('.product-item');
	
	// Add click event listeners to each category button
	categoryButtons.forEach(button => {
	  button.addEventListener('click', function() {
		// Remove active class from all buttons
		categoryButtons.forEach(btn => btn.classList.remove('active'));
		
		// Add active class to clicked button
		this.classList.add('active');
		
		// Get the selected category
		const selectedCategory = this.getAttribute('data-category');
		
		// Filter products
		filterProducts(selectedCategory);
	  });
	});
	
	// Function to filter products
	function filterProducts(category) {
	  productItems.forEach(item => {
		// If category is 'all' or the item matches the selected category
		if (category === 'all' || item.getAttribute('data-category') === category) {
		  item.classList.remove('hide');
		} else {
		  item.classList.add('hide');
		}
	  });
	  
	  // Count visible items for each category to ensure at least 2 per category
	  if (category !== 'all') {
		let visibleCount = 0;
		
		productItems.forEach(item => {
		  if (item.getAttribute('data-category') === category) {
			visibleCount++;
		  }
		});
		
		// If less than 2 visible items, maybe show placeholder or message
		if (visibleCount < 2) {
		  console.log('Less than 2 items in this category. Consider adding more products.');
		}
	  }
	}
	
	// Optional: Initial filtering - show all products
	filterProducts('all');
  });