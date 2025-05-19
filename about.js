// Counter Animation Function
const counters = document.querySelectorAll('.stat-card h3');
const speed = 100; // Lower is faster

const animateCount = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const increment = target / speed;

        const updateCount = () => {
            const current = +counter.innerText;

            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });
};

// Trigger Animation on Scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCount();
            observer.disconnect();  // Stops observing after animation is triggered
        }
    });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.about-stats'));

function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
  }
  
  function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
  }