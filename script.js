document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('status');
  
    function showStatus(message, isError = false) {
      statusDiv.textContent = message;
      statusDiv.className = 'status-message ' + (isError ? 'error' : 'success');
      statusDiv.style.display = 'block';
      if (!isError) {
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 5000);
      }
    }
  
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      statusDiv.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      let phone = document.getElementById('phone').value.trim();
      const method = document.getElementById('method').value;
    
      // Form validation
      if (!name || !email || !phone) {
        showStatus('All fields are required', true);
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        return;
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address', true);
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        return;
      }
  
      // Format phone number
      if (!phone.startsWith('+')) {
        phone = `+91${phone}`;
      }
    
      try {
        // FIXED: Use the correct Apps Script URL and deployment ID
        // Replace this URL with your actual deployment URL from Google Apps Script
        const scriptUrl = 'AKfycbxHtHRpooz02t5sZhra5mYV-hazFxsvZQnkGuu5oSVWpxVnvZz-d_NJ7C4tvlOmSrJi';
        
        // Add a cache-busting parameter
        const uniqueUrl = `${scriptUrl}?t=${Date.now()}`;
  
        const formData = {
          name: name,
          email: email,
          phone: phone,
          method: method
        };
        
        // SOLUTION 1: Using JSONP approach (for CORS bypass)
        // Create a form element to submit as JSONP-like approach
        const formToSubmit = document.createElement('form');
        formToSubmit.method = 'POST';
        formToSubmit.action = uniqueUrl;
        formToSubmit.target = 'hiddenFrame';
        
        // Add form fields
        for (const key in formData) {
          const hiddenField = document.createElement('input');
          hiddenField.type = 'hidden';
          hiddenField.name = key;
          hiddenField.value = formData[key];
          formToSubmit.appendChild(hiddenField);
        }
        
        // Create hidden iframe to receive response
        const hiddenFrame = document.createElement('iframe');
        hiddenFrame.name = 'hiddenFrame';
        hiddenFrame.style.display = 'none';
        document.body.appendChild(hiddenFrame);
        document.body.appendChild(formToSubmit);
        
        // Set up message event listener to receive response from iframe
        window.addEventListener('message', function(event) {
          if (event.data.status === 'success') {
            showStatus("Form submitted successfully! We'll contact you shortly.");
            contactForm.reset();
            
            // Open WhatsApp chat if selected
            if (method === 'whatsapp') {
              const message = `Hi! I'm ${name}. I'd like to get in touch.`;
              window.open(`https://wa.me/7892119416?text=${encodeURIComponent(message)}`, '_blank');
            }
          } else if (event.data.error) {
            showStatus(`Error: ${event.data.error}`, true);
          }
          
          // Clean up
          if (document.body.contains(formToSubmit)) {
            document.body.removeChild(formToSubmit);
          }
          if (document.body.contains(hiddenFrame)) {
            document.body.removeChild(hiddenFrame);
          }
          
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
        }, false);
        
        // Submit the form
        formToSubmit.submit();
        
        // Set a timeout in case we don't get a response
        setTimeout(() => {
          if (submitBtn.disabled) {
            showStatus("Form submitted! If you don't hear back, please try again or contact us directly.", true);
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
          }
        }, 5000);
        
      } catch (error) {
        console.error('Submission error:', error);
        showStatus(`Error: Failed to fetch. Please try again later.`, true);
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });
  });