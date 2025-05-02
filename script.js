document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const method = document.getElementById('method').value;
  
    try {
      // ✅ Replace with your deployed script URL
      const scriptUrl = 'https://script.google.com/macros/s/AKfycby0IjAh6GldBaOMw--H-SbtxdFWQc3fJLShlrwZ-lVp0w2QH0dOIsEOQ1iLm4hU1v6ipQ/exec';
  
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, method }),
        mode: 'cors'
      });
  
      const result = await response.json();
      
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Submission failed');
      }
  
      if (method === 'whatsapp') {
        const message = `Hi! We’ll contact you shortly!%0A%0AName: ${name}%0AEmail: ${email}%0APhone: ${phone}`;
        window.open(`https://wa.me/+917892119416?text=${message}`, '_blank');
      }
  
      document.getElementById('contactForm').reset();
      alert('Thank you! We’ll respond shortly.');
      
    } catch (error) {
      alert('Error submitting form. Please try again.');
      console.error('Submission error:', error);
    }
  });