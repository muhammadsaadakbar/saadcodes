"use strict";

// Modernized Navigation System
class NavigationManager {
  constructor() {
    this.mobileNav = document.querySelector(".mobile-nav");
    this.menuBtn = document.querySelector(".toggle");
    this.mobileOverlay = document.querySelector(".mobile-overlay");
    this.mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupKeyboardNavigation();
  }

  bindEvents() {
    // Mobile menu toggle events
    this.menuBtn.addEventListener("click", () => this.toggleMobileNav());
    if (this.mobileOverlay.classList.contains("active")) {
      this.mobileOverlay?.addEventListener("click", () =>
        this.closeMobileNav()
      );
    }
    // Close mobile nav when clicking on nav links
    this.mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileNav();
        // Smooth scroll will be handled by the existing smooth scroll code
      });
    });

    // Close mobile nav on window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.closeMobileNav();
      }
    });
  }

  setupKeyboardNavigation() {
    // Close mobile nav with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.mobileNav?.classList.contains("active")) {
        this.closeMobileNav();
      }
    });

    // Trap focus within mobile nav when open
    this.mobileNav?.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        this.trapFocus(e);
      }
    });
  }

  toggleMobileNav() {
    const isActive = this.mobileNav?.classList.contains("active");

    if (isActive) {
      this.menuBtn.classList.remove("active");
      this.mobileOverlay.classList.remove("active");
      this.closeMobileNav();
    } else {
      this.menuBtn.classList.add("active");
      this.mobileOverlay.classList.add("active");

      this.openMobileNav();
    }
  }

  openMobileNav() {
    this.menuBtn.classList.add("active");

    this.mobileNav?.classList.add("active");
    this.mobileOverlay?.classList.add("active");
    document.body.style.overflow = "hidden";

    // Focus the close button for accessibility
    setTimeout(() => {
      this.navCloseBtn?.focus();
    }, 300);
  }

  closeMobileNav() {
    this.menuBtn.classList.remove("active");

    this.mobileNav?.classList.remove("active");
    this.mobileOverlay?.classList.remove("active");

    document.body.style.overflow = "";

    // Return focus to menu button
    this.navMenuBtn?.focus();
  }

  trapFocus(e) {
    const focusableElements = this.mobileNav?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
}

// Enhanced Theme Manager
class ThemeManager {
  constructor() {
    this.themeButtons = document.querySelectorAll(".theme-btn");
    this.themeCheckboxes = document.querySelectorAll("#theme-toggle");
    this.body = document.body;
    this.prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    this.currentThemeSpan = document.getElementById("current-theme");
    this.systemPreferenceSpan = document.getElementById("system-preference");

    this.init();
  }

  init() {
    this.updateSystemPreferenceDisplay();
    this.loadSavedTheme();
    this.bindEvents();
    this.watchSystemPreference();
  }

  bindEvents() {
    // Listen to checkbox change events instead of button clicks
    this.themeCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => this.handleThemeChange(e));
    });
  }

  handleThemeChange(e) {
    const isChecked = e.target.checked;

    if (isChecked) {
      this.setDarkTheme();
      this.saveThemePreference("dark");
    } else {
      this.setLightTheme();
      this.saveThemePreference("light");
    }

    this.updateThemeDisplay();
  }

  setLightTheme() {
    this.body.classList.remove("dark-theme");
    this.body.classList.add("light-theme");
  }

  setDarkTheme() {
    this.body.classList.remove("light-theme");
    this.body.classList.add("dark-theme");
  }

  updateCheckboxStates(isDark) {
    this.themeCheckboxes.forEach((checkbox) => {
      checkbox.checked = isDark;
      checkbox.setAttribute(
        "aria-label",
        `Switch to ${isDark ? "light" : "dark"} theme`
      );
    });
  }

  updateThemeDisplay() {
    const isDark = this.body.classList.contains("dark-theme");
    if (this.currentThemeSpan) {
      this.currentThemeSpan.textContent = isDark ? "Dark" : "Light";
    }
  }

  updateSystemPreferenceDisplay() {
    if (this.systemPreferenceSpan) {
      this.systemPreferenceSpan.textContent = this.prefersDark.matches
        ? "Dark"
        : "Light";
    }
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    let shouldUseDark = false;

    if (savedTheme) {
      shouldUseDark = savedTheme === "dark";
    } else {
      // Use system preference if no saved theme
      shouldUseDark = this.prefersDark.matches;
    }

    if (shouldUseDark) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }

    this.updateCheckboxStates(shouldUseDark);
    this.updateThemeDisplay();
  }

  saveThemePreference(theme) {
    localStorage.setItem("theme", theme);
  }

  watchSystemPreference() {
    this.prefersDark.addEventListener("change", (e) => {
      this.updateSystemPreferenceDisplay();

      // Only auto-switch if user hasn't set a preference
      if (!localStorage.getItem("theme")) {
        const shouldUseDark = e.matches;

        if (shouldUseDark) {
          this.setDarkTheme();
        } else {
          this.setLightTheme();
        }

        this.updateCheckboxStates(shouldUseDark);
        this.updateThemeDisplay();
      }
    });
  }
}
// Enhanced Animation Manager
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupCounterAnimations();
    this.setupParallaxEffects();
    this.setupHeaderEffects();
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, this.observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el);
    });
  }

  setupCounterAnimations() {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector(".stats");
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }

  animateCounters() {
    const counters = [
      { element: document.getElementById("projectCount"), target: 10 },
      { element: document.getElementById("clientCount"), target: 9 },
      { element: document.getElementById("experienceCount"), target: 1 },
      { element: document.getElementById("techCount"), target: 15 },
    ];

    counters.forEach(({ element, target }) => {
      if (element) {
        this.animateCounter(element, target);
      }
    });
  }

  animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
      start += increment;
      if (start < target) {
        element.textContent = Math.ceil(start) + "+";
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + "+";
      }
    };

    updateCounter();
  }

  setupParallaxEffects() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const heroBg = document.querySelector(".hero-bg");

      if (heroBg) {
        const speed = scrolled * 0.5;
        heroBg.style.transform = `translateY(${speed}px) rotate(${
          scrolled * 0.1
        }deg)`;
      }

      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  setupHeaderEffects() {
    const header = document.querySelector("header");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.background = document.body.classList.contains("dark-theme")
          ? "rgba(15, 23, 42, 0.95)"
          : "rgba(255, 255, 255, 0.95)";
        header.style.backdropFilter = "blur(20px)";
      } else {
        header.style.background = document.body.classList.contains("dark-theme")
          ? "rgba(15, 23, 42, 0.8)"
          : "rgba(255, 255, 255, 0.8)";
        header.style.backdropFilter = "blur(20px)";
      }
      lastScroll = currentScroll;
    });
  }
}

// Enhanced Smooth Scroll Manager
class SmoothScrollManager {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        const target = document.querySelector(targetId);

        if (target) {
          this.smoothScrollTo(target);
        }
      });
    });
  }

  smoothScrollTo(target) {
    const headerHeight = document.querySelector("header").offsetHeight;
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
}

// Performance Optimizer
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeImages();
    this.preloadCriticalResources();
    this.handlePageVisibility();
  }

  optimizeImages() {
    // Lazy load images if supported
    if ("loading" in HTMLImageElement.prototype) {
      const images = document.querySelectorAll("img[data-src]");
      images.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      });
    }
  }

  preloadCriticalResources() {
    // Preload critical fonts or resources if needed
    const criticalResources = [
      // Add critical resource URLs here
    ];

    criticalResources.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = url.includes(".woff") ? "font" : "image";
      if (link.as === "font") {
        link.crossOrigin = "anonymous";
      }
      document.head.appendChild(link);
    });
  }

  handlePageVisibility() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Pause animations or reduce activity when page is hidden
        document.body.classList.add("page-hidden");
      } else {
        // Resume normal activity when page is visible
        document.body.classList.remove("page-hidden");
      }
    });
  }
}

// Initialize all managers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all systems
  const navigation = new NavigationManager();
  const themeManager = new ThemeManager();
  const animationManager = new AnimationManager();
  const smoothScrollManager = new SmoothScrollManager();
  const performanceOptimizer = new PerformanceOptimizer();

  // Add smooth reveal animation on page load
  document.body.style.opacity = "1";

  // Add loading complete class for final animations
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });

  // Error handling for failed resources
  window.addEventListener("error", (e) => {
    console.warn("Resource failed to load:", e.target.src || e.target.href);
  });
});
