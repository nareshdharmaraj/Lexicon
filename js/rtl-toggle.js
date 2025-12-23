/**
 * LexIcon - RTL/LTR Alignment Toggle
 * Handles comprehensive text direction switching with proper alignment changes
 */

class AlignmentManager {
  constructor() {
    this.currentDir = localStorage.getItem('textDirection') || 'ltr';
    this.isToggling = false;
    this.init();
  }

  init() {
    // Set initial direction
    document.documentElement.setAttribute('dir', this.currentDir);

    // Apply initial alignment
    setTimeout(() => this.applyFullAlignment(), 100);

    // Bind toggle button
    this.bindToggleButton();

    // Initialize mobile menu handlers
    this.initMobileMenu();
  }

  initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        this.updateMobileMenuDirection();
      });
    }
  }

  updateMobileMenuDirection() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      const isRTL = this.currentDir === 'rtl';

      // Update menu positioning and animation
      if (isRTL) {
        mobileMenu.style.transformOrigin = 'left top';
        mobileMenu.style.animation = 'slideInFromLeft 0.3s ease';
        mobileMenu.style.left = '0';
        mobileMenu.style.right = 'auto';
      } else {
        mobileMenu.style.transformOrigin = 'right top';
        mobileMenu.style.animation = 'slideInFromRight 0.3s ease';
        mobileMenu.style.right = '0';
        mobileMenu.style.left = 'auto';
      }

      // Update all menu items alignment
      const menuItems = mobileMenu.querySelectorAll('a, button');
      menuItems.forEach(item => {
        if (isRTL) {
          item.style.textAlign = 'right';
          item.style.direction = 'rtl';
        } else {
          item.style.textAlign = 'left';
          item.style.direction = 'ltr';
        }
      });
    }
  }

  applyFullAlignment() {
    const isRTL = this.currentDir === 'rtl';

    // Apply body-level direction
    document.body.setAttribute('dir', this.currentDir);
    document.documentElement.setAttribute('dir', this.currentDir);

    // Ensure no horizontal overflow
    document.body.style.overflowX = 'hidden';
    document.body.style.maxWidth = '100vw';
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.maxWidth = '100vw';

    // Text alignment for all text elements
    this.applyTextAlignment(isRTL);

    // Layout alignment for flex containers
    this.applyLayoutAlignment(isRTL);

    // Dashboard-specific alignments
    this.applyDashboardAlignment(isRTL);

    // Form elements alignment
    this.applyFormAlignment(isRTL);

    // Navigation alignment
    this.applyNavigationAlignment(isRTL);
  }

  applyTextAlignment(isRTL) {
    const textElements = document.querySelectorAll(`
      p, h1, h2, h3, h4, h5, h6, span, a, button, label, 
      td, th, div:not(.no-rtl), li
    `);

    textElements.forEach(el => {
      if (el.closest('.no-rtl')) return;

      if (isRTL) {
        el.style.textAlign = 'right';
        el.style.direction = 'rtl';
      } else {
        el.style.textAlign = '';
        el.style.direction = '';
      }
    });
  }

  applyLayoutAlignment(isRTL) {
    // Flex containers
    const flexContainers = document.querySelectorAll(`
      .flex, [class*="flex-"], .grid,
      header .flex, .sidebar nav,
      .tab-button, .settings-tab-button
    `);

    flexContainers.forEach(el => {
      if (el.closest('.no-rtl')) return;

      if (isRTL) {
        el.style.direction = 'rtl';
      } else {
        el.style.direction = '';
        el.style.flexDirection = ''; // Reset flex-direction in case it was set previously
      }
    });
  }

  applyDashboardAlignment(isRTL) {
    // Sidebar navigation items
    document.querySelectorAll('#sidebar nav a').forEach(el => {
      if (isRTL) {
        el.style.paddingRight = '1rem';
        el.style.paddingLeft = '1rem';
      } else {
        el.style.paddingRight = '';
        el.style.paddingLeft = '';
      }
    });

    // Header elements and top navigation
    document.querySelectorAll('header .flex').forEach(el => {
      // Natural RTL handling involves swapping start/end visually
      // In flex-row RTL: Start is Right, End is Left.
      // So 'justify-between' puts first item on Right, last item on Left. 
      // This is the desired RTL behavior (flipping positions).
      // No explicit style needed unless we want to PREVENT this.
    });

    // Horizontal tab navigation bars
    document.querySelectorAll('.border-b.border-slate-200, .flex.gap-8.border-b, [role="tablist"]').forEach(tabBar => {
      // Natural RTL handling
    });

    // Individual tab buttons and highlights
    document.querySelectorAll('[role="tab"], .tab-btn').forEach(tab => {
      if (isRTL) {
        tab.style.textAlign = 'right';
      } else {
        tab.style.textAlign = '';
      }
    });

    // Main tab container
    document.querySelectorAll('.flex.gap-2').forEach(tabContainer => {
      if (!tabContainer.closest('#sidebar')) {
        if (isRTL) {
          tabContainer.style.flexDirection = 'row-reverse';
        } else {
          tabContainer.style.flexDirection = '';
        }
      }
    });

    // Stats cards and premium cards
    document.querySelectorAll('.glass, .premium-card, .glass-dark').forEach(card => {
      const flexElements = card.querySelectorAll('.flex');
      flexElements.forEach(el => {
        if (el.closest('.no-rtl')) return;

        if (isRTL) {
          el.style.flexDirection = 'row-reverse';
        } else {
          el.style.flexDirection = '';
        }
      });
    });

    // Admin dashboard main container and sidebar positioning
    const adminContainer = document.getElementById('main-container');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('main');

    if (adminContainer && sidebar && mainContent) {
      if (isRTL) {
        adminContainer.style.flexDirection = 'row-reverse';
        sidebar.style.borderRight = 'none';
        sidebar.style.borderLeft = '1px solid #1e293b';
      } else {
        adminContainer.style.flexDirection = '';
        sidebar.style.borderRight = '1px solid #1e293b';
        sidebar.style.borderLeft = 'none';
      }
    }



    // Sidebar navigation items (both admin and user dashboard)
    document.querySelectorAll('#sidebar nav a, .tab-nav-btn').forEach(el => {
      if (isRTL) {
        el.style.flexDirection = 'row-reverse';
        el.style.textAlign = 'right';
      } else {
        el.style.flexDirection = '';
        el.style.textAlign = '';
      }
    });

    // Admin dashboard tab buttons
    document.querySelectorAll('.tab-button').forEach(tab => {
      if (isRTL) {
        tab.style.textAlign = 'right';
      } else {
        tab.style.textAlign = '';
      }
    });

    // All gap containers (admin dashboard)
    document.querySelectorAll('.flex.gap-3, .flex.gap-4, .flex.gap-6, .flex.gap-8').forEach(container => {
      if (!container.closest('#sidebar')) {
        if (isRTL) {
          container.style.flexDirection = 'row-reverse';
        } else {
          container.style.flexDirection = '';
        }
      }
    });

    // Tables
    document.querySelectorAll('table').forEach(table => {
      if (isRTL) {
        table.style.direction = 'rtl';
      } else {
        table.style.direction = '';
      }
    });

    // Notification badges and absolute positioned elements
    document.querySelectorAll('.absolute').forEach(el => {
      if (el.closest('.no-rtl')) return;

      const hasRight = el.style.right || el.classList.toString().includes('right');
      const hasLeft = el.style.left || el.classList.toString().includes('left');

      if (isRTL) {
        if (hasRight) {
          el.style.left = el.style.right;
          el.style.right = 'auto';
        }
      } else {
        if (hasLeft && el.style.left !== 'auto') {
          el.style.right = el.style.left;
          el.style.left = 'auto';
        }
      }
    });
  }

  applyFormAlignment(isRTL) {
    document.querySelectorAll('input, textarea, select').forEach(el => {
      if (el.closest('.no-rtl')) return;

      if (isRTL) {
        el.style.textAlign = 'right';
        el.style.direction = 'rtl';
      } else {
        el.style.textAlign = '';
        el.style.direction = '';
      }
    });
  }

  applyNavigationAlignment(isRTL) {
    // Main website navigation
    const mainNavbar = document.getElementById('main-navbar');
    const navbarContent = document.getElementById('navbar-content');

    if (navbarContent) {
      // Natural RTL handling
    }

    // Handle mobile menu - ensure no overflow
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.style.maxWidth = '100vw';
      mobileMenu.style.overflowX = 'hidden';
      mobileMenu.style.left = '0';
      mobileMenu.style.right = '0';
    }

    // Handle mobile menu items
    const mobileMenuItems = document.querySelectorAll('#mobile-menu a');
    mobileMenuItems.forEach(item => {
      if (isRTL) {
        item.style.textAlign = 'right';
        item.style.direction = 'rtl';
      } else {
        item.style.textAlign = 'left';
        item.style.direction = 'ltr';
      }
    });

    // Update mobile menu direction if open
    this.updateMobileMenuDirection();

    // Desktop navigation links container
    document.querySelectorAll('.hidden.md\\:flex.items-center.space-x-8').forEach(navLinks => {
      if (isRTL) {
        navLinks.style.gap = '2rem';
        navLinks.classList.remove('space-x-8');
        navLinks.classList.add('space-x-reverse', 'space-x-8');
      } else {
        navLinks.style.gap = '';
        navLinks.classList.remove('space-x-reverse');
        navLinks.classList.add('space-x-8');
      }
    });

    // Action buttons container
    document.querySelectorAll('.hidden.md\\:flex.items-center.space-x-4').forEach(actionBtns => {
      if (isRTL) {
        actionBtns.style.gap = '1rem';
        actionBtns.classList.remove('space-x-4');
        actionBtns.classList.add('space-x-reverse', 'space-x-4');
      } else {
        actionBtns.style.gap = '';
        actionBtns.classList.remove('space-x-reverse');
        actionBtns.classList.add('space-x-4');
      }
    });

    // Logo container alignment
    document.querySelectorAll('.flex.items-center').forEach(logoContainer => {
      // Natural RTL handling
    });

    // Dashboard sidebar (if present)
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('main');
    const container = document.querySelector('.flex.h-screen');

    if (sidebar && mainContent && container) {
      if (isRTL) {
        container.style.flexDirection = 'row-reverse';
        sidebar.style.borderRight = 'none';
        sidebar.style.borderLeft = '1px solid #e2e8f0';
        sidebar.style.order = '2';
        mainContent.style.order = '1';
      } else {
        container.style.flexDirection = '';
        sidebar.style.borderRight = '1px solid #e2e8f0';
        sidebar.style.borderLeft = 'none';
        sidebar.style.order = '';
        mainContent.style.order = '';
      }
    }

    // Sidebar navigation items (dashboard)
    document.querySelectorAll('#sidebar nav a').forEach(el => {
      if (isRTL) {
        el.style.flexDirection = 'row-reverse';
        el.style.textAlign = 'right';
      } else {
        el.style.flexDirection = '';
        el.style.textAlign = '';
      }
    });

    // Tab containers
    document.querySelectorAll('.flex.gap-2').forEach(el => {
      if (isRTL) {
        el.style.flexDirection = 'row-reverse';
      } else {
        el.style.flexDirection = '';
      }
    });
  }

  bindToggleButton() {
    // Robust event delegation for all toggle buttons (mobile & desktop)
    document.body.addEventListener('click', (e) => {
      // Find closest toggle button
      const target = e.target.closest('#rtl-toggle-btn, #rtl-toggle-btn-mobile, #language-toggle, [data-toggle="rtl"]');

      if (target) {
        e.preventDefault();
        e.stopPropagation(); // Prevent conflicts
        this.toggleDirection();

        // Force update all icons immediately
        const allBtns = document.querySelectorAll('#rtl-toggle-btn, #rtl-toggle-btn-mobile, #language-toggle, [data-toggle="rtl"]');
        allBtns.forEach(btn => this.updateToggleIcon(btn));
      }
    });

    // Initial icon update for any buttons found on load
    const allBtns = document.querySelectorAll('#rtl-toggle-btn, #rtl-toggle-btn-mobile, #language-toggle, [data-toggle="rtl"]');
    allBtns.forEach(btn => this.updateToggleIcon(btn));
  }

  updateToggleIcon(btn) {
    if (!btn) return;
    // Method added to prevent crash. 
    // Logic can be added here if icon needs explicit switching (e.g. icon class toggle)
  }

  toggleDirection() {
    if (this.isToggling) return;

    this.isToggling = true;

    // Toggle direction
    this.currentDir = this.currentDir === 'ltr' ? 'rtl' : 'ltr';

    // Save to localStorage
    localStorage.setItem('textDirection', this.currentDir);

    // Add transition for smooth change
    document.body.style.transition = 'all 0.3s ease';

    // Apply direction changes
    this.applyFullAlignment();

    // Visual feedback
    this.showDirectionChange();

    // Reset transition after change
    setTimeout(() => {
      document.body.style.transition = '';
      this.isToggling = false;
    }, 300);
  }

  // Navigation Order Update Function removed as CSS flex-direction handles it correctly

  // Alias method for dashboard compatibility
  toggleAlignment() {
    this.toggleDirection();
  }

  showDirectionChange() {
    const direction = this.currentDir.toUpperCase();

    // Create temporary notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-size: 14px;
        font-weight: 600;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
      ">
        Direction: ${direction}
      </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.firstElementChild.style.opacity = '1';
      notification.firstElementChild.style.transform = 'translateX(0)';
    }, 10);

    // Hide and remove notification
    setTimeout(() => {
      notification.firstElementChild.style.opacity = '0';
      notification.firstElementChild.style.transform = 'translateX(100px)';

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
  window.AlignmentManager = AlignmentManager;
}

// Auto-initialize
function initAlignmentManager() {
  if (typeof AlignmentManager !== 'undefined') {
    new AlignmentManager();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAlignmentManager);
} else {
  initAlignmentManager();
}
