document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const method = document.getElementById('method').value;
  
    try {
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbxHsWD2m2j8fsZjzQMzi6P4llvHc-QDU2gyeZOr9oW4X4oJ2GJxTqWnX89Anw8ciajkwA/exec';
      
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
      
      form.reset();
      alert('Thank you! We’ll respond shortly.');
      
    } catch (error) {
      alert(error.message);
      console.error('Submission error:', error);
    }
  });