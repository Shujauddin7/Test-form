document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const method = document.getElementById('method').value;
  
    try {
      // Replace with your Google Apps Script URL
      const scriptUrl = 'https://script.google.com/.../exec';
      
      // Send data to Google Sheets=
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, method })
      });
  
      if (!response.ok) throw new Error('Failed to submit');
  
      // Open WhatsApp or email
      if (method === 'whatsapp') {
        const message = `Hi! We’ll contact you shortly!%0A%0AName: ${name}%0AEmail: ${email}%0APhone: ${phone}`;
        window.open(`https://wa.me/91YOUR_WHATSAPP_NUMBER?text=${message}`, '_blank');
      }
  
      // Reset form
      document.getElementById('contactForm').reset();
      alert('Thank you! We’ll respond shortly.');
      
    } catch (error) {
      alert('Error submitting form. Please try again.');
      console.error(error);
    }
  });