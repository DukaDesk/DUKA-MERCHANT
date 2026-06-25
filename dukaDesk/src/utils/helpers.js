/**
 * Utility functions for the DukaDesk Merchant Portal
 */

/**
 * Format currency values
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
};

/**
 * Format date to readable format
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type (short, long, full)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = "short") => {
  const options = {
    short: { month: "short", day: "numeric", year: "numeric" },
    long: { month: "long", day: "numeric", year: "numeric" },
    full: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  };

  return new Intl.DateTimeFormat("en-US", options[format]).format(
    new Date(date)
  );
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

/**
 * Debounce function for performance optimization
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Get color based on status
 * @param {string} status - Status value
 * @returns {string} Color code
 */
export const getStatusColor = (status) => {
  const colors = {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  };
  return colors[status] || "#6b7280";
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
