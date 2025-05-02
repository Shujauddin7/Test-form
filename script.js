document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    let phone = document.getElementById('phone').value.trim();
    const method = document.getElementById('method').value;
  
    // Validate phone number format
    if (!phone.startsWith('+')) {
      phone = `+91${phone}`; // Prepend country code if missing
    }
  
    try {
      // ✅ REPLACE THIS WITH YOUR ACTUAL SCRIPT URL
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbxge16e3cuiXDczjqvHSWenO7x3JPEIQldQHpBdQB_CD07rt5z9MvttRwtefUR5Qrbw/exec';
      
      // Add cache-buster to URL
      const uniqueUrl = `${scriptUrl}?t=${Date.now()}`;
  
      const response = await fetch(uniqueUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, method }),
        mode: 'cors',
        redirect: 'follow'
      });
  
      // Handle Google Script's redirect
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
      alert('Submitted successfully! We’ll respond shortly.');
      
    } catch (error) {
      alert(`Error: ${error.message}`);
     
    }
  });