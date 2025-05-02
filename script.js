document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const method = document.getElementById('method').value;
  
    try {
      // ✅ Replace with YOUR Google Apps Script URL
      const scriptUrl = 'https://script.google.com/macros/s/AKfycby5BQ5i1pzhpO8AKpM6QhjkZKbUZDzHL3nIorSWiapNL8sfZqHo7hizKwH-EJQtWcOpYg/exec';
  
      // Send data to Google Sheets
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, method })
      });
  
      if (!response.ok) throw new Error('Submission failed');
  
      // Open WhatsApp or reset form
      if (method === 'whatsapp') {
        const message = `Hi! We’ll contact you shortly!%0A%0AName: ${name}%0AEmail: ${email}%0APhone: ${phone}`;
        window.open(`https://wa.me/+917892119416?text=${message}`, '_blank'); // ✅ Replace with your WhatsApp number
      }
  
      document.getElementById('contactForm').reset();
      alert('Thank you! We’ll respond shortly.');
      
    } catch (error) {
      alert('Error submitting form. Please try again.');
      console.error(error);
    }
  });