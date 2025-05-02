document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const method = document.getElementById('method').value;
  
    try {
      // ✅ Replace with YOUR DEPLOYED SCRIPT URL
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbwwrtcZV8fWyWB0rRloezsBiQmZD3Dy0ityJ2eBMuHsV4C0g5WVhIlVhN6rldFPwQXr1Q/exec';
      
      // Add cache-buster parameter
      const uniqueUrl = `${scriptUrl}?t=${Date.now()}`;
  
      const response = await fetch(uniqueUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, method }),
        redirect: 'follow',
        mode: 'cors'
      });
  
      // Handle Google Script redirect
      const result = await response.json();
      
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Server error');
      }
  
      // Success actions
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