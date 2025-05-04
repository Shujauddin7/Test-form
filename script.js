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
    
    // Debug info
    console.log('Preparing to submit form with data:', {
      name, email, phone, method
    });
  
    try {
      // Your deployed Apps Script URL - MAKE SURE THIS IS CORRECT AND UPDATED
      // You'll need to replace this with your new deployment URL from step 2
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbwmO23gVLa85ZLNDZt2_w7e1hNj6HDSBMnkWkLmkoHKAJza7jzJeokuCI_D-ox_Mnn6hA/exec';
      console.log('Submitting to URL:', scriptUrl);
      
      // Create form data
      const formData = new URLSearchParams();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('method', method);
      formData.append('timestamp', new Date().toISOString()); // Add timestamp to avoid caching issues
      
      console.log('Form data prepared:', formData.toString());
      
      let successFlag = false;
      let responseText = '';
      
      // First try with CORS mode
      try {
        console.log('Attempting fetch with CORS mode');
        const response = await fetch(scriptUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
          },
          body: formData.toString()
        });
        
        console.log('Response received:', response);
        responseText = await response.text();
        console.log('Response text:', responseText);
        
        if (response.ok) {
          successFlag = true;
        } else {
          console.warn('Response not OK:', response.status);
        }
      } catch (corsError) {
        console.log('CORS fetch failed, trying no-cors mode:', corsError);
        
        // Fallback to no-cors if CORS fails
        try {
          await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Cache-Control': 'no-cache'
            },
            body: formData.toString()
          });
          
          console.log('no-cors fetch completed');
          successFlag = true; // Assume success since no-cors doesn't return response details
        } catch (noCorsError) {
          console.error('no-cors fetch also failed:', noCorsError);
          throw noCorsError;
        }
      }
      
      if (successFlag) {
        showStatus("Form submitted successfully! We'll contact you shortly.");
        contactForm.reset();
        
        // Open WhatsApp chat if selected
        if (method === 'whatsapp') {
          const message = `Hi! I'm ${name}. I'd like to get in touch.`;
          window.open(`https://wa.me/7892119416?text=${encodeURIComponent(message)}`, '_blank');
        }
      } else {
        // If we got a response but it wasn't successful
        showStatus(`Error: Form submission failed. ${responseText || 'Please try again.'}`, true);
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      showStatus(`Error: Failed to submit form. Please try again later. (${error.message})`, true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });
});