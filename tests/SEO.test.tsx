import '@testing-library/jest-dom';

// jsdom doesn't implement IntersectionObserver which our components rely on.
// Provide a minimal polyfill for tests.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error jsdom does not define this property
if (!window.IntersectionObserver) {
  // @ts-expect-error define missing API for tests
  window.IntersectionObserver = MockObserver;
}