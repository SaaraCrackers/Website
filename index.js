// Sidebar Toggle Functions
function showSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'flex';
}

function hideSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'none';
}

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
  const sidebar = document.querySelector('.sidebar');
  const menuButton = document.querySelector('.menu-button');
  if (sidebar.style.display === 'flex' && !sidebar.contains(e.target) && !menuButton.contains(e.target)) {
    hideSidebar();
  }
});

// Product Slider Functionality
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentIndex = 0;
const totalSlides = slides.length;

function getVisibleSlides() {
  if (window.innerWidth <= 500) {
    return 1;
  } else if (window.innerWidth <= 768) {
    return 2;
  } else if (window.innerWidth <= 1024) {
    return 3;
  }
  return 4;
}

function updateSlider() {
  const visibleSlides = getVisibleSlides();
  const maxIndex = totalSlides - visibleSlides;
  const offset = -currentIndex * (100 / visibleSlides);
  slider.style.transform = `translateX(${offset}%)`;

  // Update button states
  prevBtn.style.opacity = currentIndex <= 0 ? "0.5" : "1";
  nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
}

nextBtn.addEventListener('click', () => {
  const visibleSlides = getVisibleSlides();
  const maxIndex = totalSlides - visibleSlides;
  
  if (currentIndex < maxIndex) {
    currentIndex++;
    slider.style.transition = 'transform 0.5s ease';
    updateSlider();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    slider.style.transition = 'transform 0.5s ease';
    updateSlider();
  }
});

// Testimonial Slider Functionality
const testimonialSlider = document.querySelector('.testimonial-slider');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialPrevBtn = document.querySelector('.testimonial-prev-btn');
const testimonialNextBtn = document.querySelector('.testimonial-next-btn');
let testimonialCurrentIndex = 0;
const testimonialTotalSlides = testimonialSlides.length;

function getTestimonialVisibleSlides() {
  if (window.innerWidth <= 500) {
    return 1;
  } else if (window.innerWidth <= 768) {
    return 2;
  }
  return 3;
}

function updateTestimonialSlider() {
  const visibleSlides = getTestimonialVisibleSlides();
  const maxIndex = testimonialTotalSlides - visibleSlides;
  const offset = -testimonialCurrentIndex * (100 / visibleSlides);
  testimonialSlider.style.transform = `translateX(${offset}%)`;

  // Update button states
  testimonialPrevBtn.style.opacity = testimonialCurrentIndex <= 0 ? "0.5" : "1";
  testimonialNextBtn.style.opacity = testimonialCurrentIndex >= maxIndex ? "0.5" : "1";
}

testimonialNextBtn.addEventListener('click', () => {
  const visibleSlides = getTestimonialVisibleSlides();
  const maxIndex = testimonialTotalSlides - visibleSlides;
  
  if (testimonialCurrentIndex < maxIndex) {
    testimonialCurrentIndex++;
    testimonialSlider.style.transition = 'transform 0.5s ease';
    updateTestimonialSlider();
  }
});

testimonialPrevBtn.addEventListener('click', () => {
  if (testimonialCurrentIndex > 0) {
    testimonialCurrentIndex--;
    testimonialSlider.style.transition = 'transform 0.5s ease';
    updateTestimonialSlider();
  }
});

// Initialize sliders
updateSlider();
updateTestimonialSlider();

// Ensure sliders adjust on window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Reset indices if they're beyond the new max
    const productMaxIndex = totalSlides - getVisibleSlides();
    const testimonialMaxIndex = testimonialTotalSlides - getTestimonialVisibleSlides();
    
    currentIndex = Math.min(currentIndex, productMaxIndex);
    testimonialCurrentIndex = Math.min(testimonialCurrentIndex, testimonialMaxIndex);
    
    updateSlider();
    updateTestimonialSlider();
  }, 250);
});

// Contact Form Submission
function sendEmail(event) {
    event.preventDefault();
    
    const form = event.target;
    const formMessage = document.getElementById('form-message');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Get form data
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const subject = form.subject.value;
    const message = form.message.value;
    
    // Create email body
    const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}
    `;
    
    // Create mailto link
    const mailtoLink = `mailto:jaiakashv*-----------------------*************2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    formMessage.className = 'form-message success';
    formMessage.textContent = 'Your email client will open with a pre-filled message. Please send the email to contact us.';
    
    // Reset form
    form.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.className = 'form-message';
        formMessage.textContent = '';
    }, 5000);
}
