export const fadeInAndUp = `
  @keyframes fade-in-and-up {
    0%   { opacity: 0; padding-top: 20px; }
    100% { opacity: 1; padding-top: 10px; }
  }
`;

export const fadeOut = `
  @keyframes fade-out {
    0%   { opacity: 1 }
    100% { opacity: 0 }
  }
`;

export const fadeIn = `
  @keyframes fade-in {
    0%   { opacity: 0 }
    100% { opacity: 1 }
  }
`;

export const slideOut = `
  @keyframes slide-out {
    0%   { right: 0px }
    100% { right: -500px }
  }
`;

export const slideIn = `
  @keyframes slide-in {
    0%   { right: -500px }
    100% { right: 0px }
  }
`;
