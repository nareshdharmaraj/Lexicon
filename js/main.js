/**
 * LexIcon - Enhanced UI Interactions
 * Comprehensive animations, counters, charts, and dynamic features
 */

class LexIconUI {
  constructor() {
    this.navbar = null;
    this.countersAnimated = false;
    this.init();
  }

  init() {
    this.initNavbar();
    this.initDropdowns();
    this.initCarousel();
    this.initAOS();
    this.initSmoothScroll();
    this.initForms();
    this.initCounters();
    this.initMobileMenu();
    this.initDynamicBackgrounds();
    this.initModals();
    this.initNotifications();
    this.initTabs();
    this.highlightActiveNav();
  }

  // Highlight active navigation item based on current page
  highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a[href]');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active-nav');
        // Add active styling
        link.style.color = '#4facfe';
        const underline = link.querySelector('span');
        if (underline) {
          underline.style.width = '100%';
        }
      }
    });
  }

  // Enhanced Navbar with scroll effects
  initNavbar() {
    this.navbar = document.querySelector('.navbar');

    if (this.navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          this.navbar.classList.add('scrolled');
        } else {
          this.navbar.classList.remove('scrolled');
        }
      });
    }
  }

  // Animated Dropdown Menus
  initDropdowns() {
    // Home Dropdown
    const homeLink = document.querySelector('#nav-home');
    if (homeLink && !homeLink.parentElement.classList.contains('dropdown-wrapper')) {
      const dropdown = this.createDropdown([
        { label: 'Home - Modern (Vanguard)', url: 'index.html', icon: 'fa-rocket' },
        { label: 'Home - Classic (Authority)', url: 'index2.html', icon: 'fa-building-columns' }
      ]);

      const homeWrapper = document.createElement('div');
      homeWrapper.className = 'relative dropdown-wrapper inline-block';
      homeLink.parentNode.insertBefore(homeWrapper, homeLink);
      homeWrapper.appendChild(homeLink);
      homeWrapper.appendChild(dropdown);

      let hideTimeout;

      const showDropdown = () => {
        clearTimeout(hideTimeout);
        dropdown.style.display = 'block';
        setTimeout(() => {
          dropdown.style.opacity = '1';
          dropdown.style.transform = 'translateY(0)';
        }, 10);
      };

      const hideDropdown = () => {
        hideTimeout = setTimeout(() => {
          dropdown.style.opacity = '0';
          dropdown.style.transform = 'translateY(-10px)';
          setTimeout(() => dropdown.style.display = 'none', 300);
        }, 100);
      };

      homeWrapper.addEventListener('mouseenter', showDropdown);
      homeWrapper.addEventListener('mouseleave', hideDropdown);
      dropdown.addEventListener('mouseenter', showDropdown);
      dropdown.addEventListener('mouseleave', hideDropdown);
    }

    // Login Dropdown
    const loginIcon = document.querySelector('#nav-login');
    if (loginIcon && loginIcon.parentElement && !loginIcon.parentElement.parentElement.classList.contains('dropdown-wrapper')) {
      const loginDropdown = this.createDropdown([
        { label: 'Client Portal', url: 'login.html?portal=client', icon: 'fa-user' },
        { label: 'Attorney Portal', url: 'login.html?portal=attorney', icon: 'fa-user-tie' }
      ]);

      const loginWrapper = document.createElement('div');
      loginWrapper.className = 'relative dropdown-wrapper inline-block';
      const loginLink = loginIcon.parentElement;
      loginLink.parentNode.insertBefore(loginWrapper, loginLink);
      loginWrapper.appendChild(loginLink);
      loginWrapper.appendChild(loginDropdown);

      let hideTimeout;

      const showDropdown = () => {
        clearTimeout(hideTimeout);
        loginDropdown.style.display = 'block';
        setTimeout(() => {
          loginDropdown.style.opacity = '1';
          loginDropdown.style.transform = 'translateY(0)';
        }, 10);
      };

      const hideDropdown = () => {
        hideTimeout = setTimeout(() => {
          loginDropdown.style.opacity = '0';
          loginDropdown.style.transform = 'translateY(-10px)';
          setTimeout(() => loginDropdown.style.display = 'none', 300);
        }, 100);
      };

      loginWrapper.addEventListener('mouseenter', showDropdown);
      loginWrapper.addEventListener('mouseleave', hideDropdown);
      loginDropdown.addEventListener('mouseenter', showDropdown);
      loginDropdown.addEventListener('mouseleave', hideDropdown);
    }
  }

  createDropdown(items) {
    const dropdown = document.createElement('div');
    dropdown.className = 'absolute top-full right-0 mt-2 bg-white rounded-xl overflow-hidden shadow-2xl dropdown-menu border border-slate-200';
    dropdown.style.cssText = `
      min-width: 220px;
      display: none;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      z-index: 1000;
    `;

    items.forEach((item, index) => {
      const link = document.createElement('a');
      link.href = item.url;
      link.className = 'block px-6 py-4 text-slate-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white transition-all duration-300 font-semibold';
      link.innerHTML = `<i class="fas ${item.icon} mr-3"></i>${item.label}`;
      dropdown.appendChild(link);
    });

    return dropdown;
  }

  // Enhanced Carousel with Infinite Loop
  initCarousel() {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const prevBtn = carousel.querySelector('.carousel-prev');
      const nextBtn = carousel.querySelector('.carousel-next');

      if (!track) return;

      const cards = Array.from(track.querySelectorAll('.carousel-card'));
      if (cards.length === 0) return;

      const cardWidth = cards[0].offsetWidth;
      const gap = 32;
      const itemWidth = cardWidth + gap;

      // Clone first and last cards for infinite effect
      const firstClone = cards[0].cloneNode(true);
      const lastClone = cards[cards.length - 1].cloneNode(true);

      // Mark clones
      firstClone.classList.add('clone');
      lastClone.classList.add('clone');

      track.appendChild(firstClone);
      track.insertBefore(lastClone, cards[0]);

      // We now have: [LastClone, Card1, Card2, ..., CardN, FirstClone]
      // Real Start is index 1.

      let currentIndex = 1;
      let isTransitioning = false;
      let autoPlayInterval;

      // Initial position (show Card 1)
      track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

      const updateCarousel = (withTransition = true) => {
        if (withTransition) {
          track.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
          isTransitioning = true;
        } else {
          track.style.transition = 'none';
          isTransitioning = false;
        }
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
      };

      // Handle transition end for seamless jumping
      track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex === 0) {
          track.style.transition = 'none';
          currentIndex = cards.length;
          track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        } else if (currentIndex === cards.length + 1) {
          track.style.transition = 'none';
          currentIndex = 1;
          track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }
      });

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (isTransitioning) return;
          currentIndex--;
          updateCarousel(true);
          resetAutoPlay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (isTransitioning) return;
          currentIndex++;
          updateCarousel(true);
          resetAutoPlay();
        });
      }

      const startAutoPlay = () => {
        autoPlayInterval = setInterval(() => {
          if (!isTransitioning) {
            currentIndex++;
            updateCarousel(true);
          }
        }, 5000);
      };

      const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
      };

      startAutoPlay();
    });
  }

  // Initialize AOS
  initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
      });
    }
  }

  // Smooth scroll
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  // Form validation
  initForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            this.showError(input, 'This field is required');
          } else {
            this.clearError(input);
          }
        });

        if (isValid) {
          this.showNotification('Form submitted successfully!', 'success');
          setTimeout(() => form.reset(), 1000);
        }
      });

      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          if (input.value.trim()) {
            this.clearError(input);
          }
        });
      });
    });
  }

  showError(input, message) {
    this.clearError(input);
    const error = document.createElement('div');
    error.className = 'text-red-500 text-sm mt-1 error-message animate-fade-in-up';
    error.textContent = message;
    input.parentNode.appendChild(error);
    input.classList.add('border-red-500');
  }

  clearError(input) {
    const error = input.parentNode.querySelector('.error-message');
    if (error) error.remove();
    input.classList.remove('border-red-500');
  }

  // Animated Counters
  initCounters() {
    const counters = document.querySelectorAll('[data-target]');

    if (counters.length === 0) return;

    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          this.animateCounter(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const suffix = element.getAttribute('data-suffix') || '+';
    const prefix = element.getAttribute('data-prefix') || '';

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = prefix + (target % 1 !== 0 ? current.toFixed(1) : Math.floor(current)) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = prefix + (target % 1 !== 0 ? target.toFixed(1) : target) + suffix;
      }
    };

    updateCounter();
  }

  // Mobile Menu
  initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');

    if (toggle && menu) {
      // Initialize menu state - ensure it starts closed
      menu.setAttribute('data-mobile-open', 'false');
      menu.classList.add('hidden');
      menu.classList.remove('show');

      // Ensure icon starts as hamburger
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }

      // Main toggle handler
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const icon = toggle.querySelector('i');
        // Use data attribute to reliably track menu state
        const isMenuOpen = menu.getAttribute('data-mobile-open') === 'true';

        if (isMenuOpen) {
          // Close menu
          this.closeMobileMenu(menu, icon);
        } else {
          // Open menu
          this.openMobileMenu(menu, icon);
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
          const icon = toggle.querySelector('i');
          this.closeMobileMenu(menu, icon);
        }
      });

      // Close menu when clicking menu items (except RTL toggle)
      const menuItems = menu.querySelectorAll('a:not(#mobile-language-toggle)');
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          const icon = toggle.querySelector('i');
          this.closeMobileMenu(menu, icon);
        });
      });
    }
  }

  openMobileMenu(menu, icon) {
    // Ensure menu is shown
    menu.classList.remove('hidden');
    menu.classList.add('show');

    // Set data attribute to track state
    menu.setAttribute('data-mobile-open', 'true');

    if (icon) {
      // Remove all possible icon classes first
      icon.classList.remove('fa-bars', 'fa-times');
      // Add the times/cross icon
      icon.classList.add('fa-times');
    }
  }

  closeMobileMenu(menu, icon) {
    // Ensure menu is hidden
    menu.classList.remove('show');
    menu.classList.add('hidden');

    // Set data attribute to track state
    menu.setAttribute('data-mobile-open', 'false');

    if (icon) {
      // Remove all possible icon classes first  
      icon.classList.remove('fa-bars', 'fa-times');
      // Add the hamburger icon
      icon.classList.add('fa-bars');
    }
  }

  // Dynamic Backgrounds
  initDynamicBackgrounds() {
    const heroSections = document.querySelectorAll('[data-bg-images]');

    heroSections.forEach(section => {
      try {
        const images = JSON.parse(section.getAttribute('data-bg-images'));
        let currentIndex = 0;

        const changeBackground = () => {
          currentIndex = (currentIndex + 1) % images.length;
          const img = section.querySelector('img');
          if (img) {
            img.style.transition = 'opacity 1s ease';
            img.style.opacity = '0';
            setTimeout(() => {
              img.src = images[currentIndex];
              img.style.opacity = '0.3';
            }, 1000);
          }
        };

        setInterval(changeBackground, 5000);
      } catch (e) {
        console.error('Error parsing bg-images:', e);
      }
    });
  }

  // Modal System
  initModals() {
    window.openModal = (modalId) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    };

    window.closeModal = (modalId) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    };

    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal-close');
        closeModal(modalId);
      });
    });
  }

  // Notification System
  initNotifications() {
    // Make showNotification globally available
  }

  showNotification(message, type = 'info') {
    const colors = {
      success: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
      error: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
      info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    };

    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-5 z-[10000] px-6 py-4 rounded-xl text-white shadow-2xl animate-fade-in-right max-w-md';
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'fadeOutRight 0.5s ease';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  // Tab System
  initTabs() {
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        const container = tab.closest('[data-tabs]');

        if (!container) return;

        // Remove active from all tabs
        container.querySelectorAll('[data-tab]').forEach(t => {
          t.classList.remove('active', 'border-purple-500', 'text-purple-600', 'bg-purple-50');
          t.classList.add('text-slate-600');
        });

        // Add active to clicked tab
        tab.classList.add('active', 'border-purple-500', 'text-purple-600', 'bg-purple-50');
        tab.classList.remove('text-slate-600');

        // Hide all contents
        container.querySelectorAll('[data-tab-content]').forEach(content => {
          content.classList.add('hidden');
        });

        // Show target content
        const targetContent = container.querySelector(`[data-tab-content="${tabName}"]`);
        if (targetContent) {
          targetContent.classList.remove('hidden');
          targetContent.style.animation = 'fadeInUp 0.5s ease';
        }
      });
    });
  }
}

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes fadeOutRight {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(50px); }
  }
  
  .animate-fade-in-right {
    animation: fadeInRight 0.5s ease;
  }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.lexiconUI = new LexIconUI();
});
