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
        // FIXED: No space before URL, correct formatting
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbxHtHRpooz02t5sZhra5mYV-hazFxsvZQnkGuu5oSVWpxVnvZz-d_NJ7C4tvlOmSrJi/exec';
        
        // FIXED: Create a direct form submission - simpler approach
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('method', method);
        
        // FIXED: Simpler fetch with no-cors mode
        const response = await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', // This is critical for cross-domain requests
          body: formData
        });
        
        // Since we're using no-cors mode, we won't get a standard response
        // So we'll just assume success if no error was thrown
        showStatus("Form submitted successfully! We'll contact you shortly.");
        contactForm.reset();
        
        // Open WhatsApp chat if selected
        if (method === 'whatsapp') {
          const message = `Hi! I'm ${name}. I'd like to get in touch.`;
          window.open(`https://wa.me/7892119416?text=${encodeURIComponent(message)}`, '_blank');
        }
        
      } catch (error) {
        console.error('Submission error:', error);
        showStatus(`Error: Failed to submit form. Please try again later.`, true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });
  });