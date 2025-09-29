/**
 * The main JavaScript file for Meg Wilson Psychology website
 * Handles mobile navigation, FAQ accordions, form validation, and accessibility features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initFAQAccordions();
    initFormValidation();
    initAccessibilityFeatures();
    initScrollToTop();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const hamburgerBars = document.querySelectorAll('.hamburger');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';

            // Toggle aria-expanded
            mobileToggle.setAttribute('aria-expanded', !isExpanded);

            // Toggle navigation menu
            navMenu.classList.toggle('active');

            // Animate hamburger bars
            hamburgerBars.forEach(bar => {
                bar.classList.toggle('active');
            });
        });

        // Close the mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                hamburgerBars.forEach(bar => {
                    bar.classList.remove('active');
                });
            });
        });

        // Close the mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                hamburgerBars.forEach(bar => {
                    bar.classList.remove('active');
                });
            }
        });

        // Handle escape key to close a menu
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                hamburgerBars.forEach(bar => {
                    bar.classList.remove('active');
                });
                mobileToggle.focus();
            }
        });
    }
}

/**
 * FAQ Accordion Functionality
 */
function initFAQAccordions() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');

            // Toggle this FAQ item
            this.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');
            if (icon) {
                icon.classList.toggle('active');
            }

            // Optional: Close other FAQ items (accordion behavior)
            // Uncomment the following lines if you want only one FAQ open at a time

            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('active');
                    const otherIcon = otherQuestion.querySelector('.faq-icon');
                    if (otherIcon) {
                        otherIcon.classList.remove('active');
                    }
                }
            });

        });

        // Handle keyboard navigation
        question.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Always prevent default to handle submission

            if (validateForm(this)) {
                handleFormSubmission(this);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                // Clear previous error state when user starts typing
                clearFieldError(this);
            });
        });
    });
}

/**
 * Handle form submission
 */
function handleFormSubmission(form) {
    const formId = form.id;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Check for honeypot spam
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
        // Spam detected, silently reject
        showFormMessage(form, 'error', 'There was an error submitting your form. Please try again.');
        resetSubmitButton(submitButton, originalText);
        return;
    }

    // Simulate form submission (replace with actual form handler)
    setTimeout(() => {
        showFormMessage(form, 'success', 'Thank you! Your ' + (formId === 'appointment-form' ? 'appointment request' : 'enquiry') + ' has been received. We\'ll get back to you as soon as possible.');
        form.reset();
        resetSubmitButton(submitButton, originalText);
    }, 1000);
}

/**
 * Show form message
 */
function showFormMessage(form, type, message) {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.style.cssText = `
        padding: var(--spacing-md);
        border-radius: var(--border-radius);
        margin-top: var(--spacing-md);
        font-weight: 600;
    `;

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#E8F5E9';
        messageDiv.style.color = '#2E7D32';
        messageDiv.style.border = '1px solid #4CAF50';
    } else {
        messageDiv.style.backgroundColor = '#FFEBEE';
        messageDiv.style.color = '#C62828';
        messageDiv.style.border = '1px solid #F44336';
    }

    messageDiv.textContent = message;
    form.appendChild(messageDiv);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Reset submit button
 */
function resetSubmitButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
}

/**
 * Validate the entire form
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // Special validation for appointment form
    if (form.id === 'appointment-form') {
        // Check if at least one funding option is selected
        const fundingCheckboxes = form.querySelectorAll('input[name="funding"]:checked');
        if (fundingCheckboxes.length === 0) {
            showFormMessage(form, 'error', 'Please select at least one funding option.');
            isValid = false;
        }
    }

    return isValid;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    // Phone validation (basic)
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }

    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    // Create or update an error message
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--error)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = 'var(--spacing-xs)';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.setAttribute('id', field.id + '-error');
    field.setAttribute('aria-describedby', field.id + '-error');
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');

    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Accessibility Features
 */
function initAccessibilityFeatures() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }

    // Announce page changes for screen readers
    announcePageLoad();

    // Enhanced focus management
    manageFocusIndicators();
}

/**
 * Announce page load for screen readers
 */
function announcePageLoad() {
    const pageTitle = document.querySelector('h1');
    if (pageTitle) {
        // Create a live region for announcements
        let liveRegion = document.querySelector('#live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }

        // Announce the page
        setTimeout(() => {
            liveRegion.textContent = `Page loaded: ${pageTitle.textContent}`;
        }, 1000);
    }
}

/**
 * Enhanced focus management
 */
function manageFocusIndicators() {
    // Improve focus visibility for keyboard users
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add CSS for enhanced focus indicators
    if (!document.querySelector('#focus-styles')) {
        const style = document.createElement('style');
        style.id = 'focus-styles';
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid var(--primary-sage) !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 5px rgba(74, 155, 155, 0.2) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Scroll to Top Functionality
 */
function initScrollToTop() {
    // Create scroll to the top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top of page');
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-sage);
        color: var(--text-light);
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(scrollButton);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });

    // Scroll to top when clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effects
    scrollButton.addEventListener('mouseenter', function() {
        this.style.background = 'var(--primary-sage-dark)';
        this.style.transform = 'translateY(-2px)';
    });

    scrollButton.addEventListener('mouseleave', function() {
        this.style.background = 'var(--primary-sage)';
        this.style.transform = 'translateY(0)';
    });
}

/**
 * Utility function to debounce events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Smooth scrolling for anchor links
 */
document.addEventListener('click', function(event) {
    if (event.target.matches('a[href^="#"]')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Focus on the target element for accessibility
            targetElement.focus();
        }
    }
});

/**
 * Handle responsive tables on small screens
 */
function initResponsiveTables() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        // Wrap table in scrollable container if not already wrapped
        if (!table.parentElement.classList.contains('table-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-container';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

// Initialize responsive tables
document.addEventListener('DOMContentLoaded', initResponsiveTables);