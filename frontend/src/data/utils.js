// Helper functions for the mock API

// Helper function to simulate async behavior
export const asyncResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Generate a random ID
export const generateId = () => {
  return Math.floor(Math.random() * 10000);
};
