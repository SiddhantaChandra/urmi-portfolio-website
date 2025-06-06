// Motion variants for consistent animations across the site

export const fadeIn = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

export const slideInLeft = {
  hidden: { 
    opacity: 0, 
    x: -50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const slideInRight = {
  hidden: { 
    opacity: 0, 
    x: 50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const scaleIn = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const buttonHover = {
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: { 
    scale: 0.95 
  }
};

export const cardHover = {
  hover: { 
    y: -8,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}; 