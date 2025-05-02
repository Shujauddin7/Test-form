document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('status');
  
    // Function to show status message
    function showStatus(message, isError = false) {
      statusDiv.textContent = message;
      statusDiv.className = 'status-message ' + (isError ? 'error' : 'success');
      statusDiv.style.display = 'block';
      
      // Auto-hide successful messages after 5 seconds
      if (!isError) {
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 5000);
      }
    }
  
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Reset status
      statusDiv.style.display = 'none';
      
      // Disable submit button and show loading state
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      
      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      let phone = document.getElementById('phone').value.trim();
      const method = document.getElementById('method').value;
    
      // Basic validation
      if (!name || !email || !phone) {
        showStatus('All fields are required', true);
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        return;
      }
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address', true);
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        return;
      }
  
      // Format phone number
      if (!phone.startsWith('+')) {
        phone = `+91${phone}`; // Prepend country code if missing
      }
    
      try {
        // Google Apps Script URL
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbz3M1X1oz6my41-8HIPAVljIwfL8C2AOryg3V87S90qsTayFDoUiMukNNpVlQFXAarHew/exec';
        
        // Add cache-buster to URL to prevent caching issues
        const uniqueUrl = `${scriptUrl}?t=${Date.now()}`;
  
        // Prepare form data
        const formData = {
          name: name,
          email: email,
          phone: phone,
          method: method
        };
    
        // Use fetch with JSONP-like approach for CORS issues
        const response = await fetch(uniqueUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          redirect: 'follow'
        });
    
        // Parse the response
        const result = await response.json();
    
        if (result.error) {
          throw new Error(result.error || 'Unknown error occurred');
        }
    
        // Success actions
        showStatus("Form submitted successfully! We'll contact you shortly.");
        contactForm.reset();
        
        // Open WhatsApp if that method was selected
        if (method === 'whatsapp') {
          const message = `Hi! We'll contact you shortly!%0A%0AName: ${name}%0AEmail: ${email}%0APhone: ${phone}`;
          window.open(`https://wa.me/+917892119416?text=${message}`, '_blank');
        }
        
      } catch (error) {
        console.error('Submission error:', error);
        showStatus(`Error: ${error.message || 'Could not submit form. Please try again later.'}`, true);
      } finally {
        // Re-enable the submit button and remove loading state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });
  });