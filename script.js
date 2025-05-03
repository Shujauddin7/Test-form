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
  
      if (!phone.startsWith('+')) {
        phone = `+91${phone}`;
      }
    
      try {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbx_bd0TQ7oicsnkUaa5BozQf8a63IdSFhjRoFhTFpuM79_M-MEelktqmoEjS1kC_UTZ/exec';
        const uniqueUrl = `${scriptUrl}?t=${Date.now()}`;
  
        const formData = {
          name: name,
          email: email,
          phone: phone,
          method: method
        };
    
        const response = await fetch(uniqueUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          redirect: 'follow'
        });
    
        const result = await response.json();
    
        if (result.error) {
          throw new Error(result.error || 'Unknown error occurred');
        }
    
        showStatus("Form submitted successfully! We'll contact you shortly.");
        contactForm.reset();
        
        if (method === 'whatsapp') {
          const message = `Hi! We'll contact you shortly!%0A%0AName: ${name}%0AEmail: ${email}%0APhone: ${phone}`;
          window.open(`https://wa.me/+917892119416?text=${message}`, '_blank');
        }
        
      } catch (error) {
        console.error('Submission error:', error);
        showStatus(`Error: ${error.message || 'Could not submit form. Please try again later.'}`, true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });
});