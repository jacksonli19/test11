const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.querySelectorAll(".nav__link");
const header = document.getElementById("header");
const sections = document.querySelectorAll("section[id]");
const homeSection = document.querySelector(".home");
const backgroundImages = document.querySelectorAll(".home-background__image");
const backgroundDots = document.querySelectorAll("[data-background-slide]");
const previousBackgroundButton = document.querySelector('[data-background-control="previous"]');
const nextBackgroundButton = document.querySelector('[data-background-control="next"]');
const typingTitles = document.querySelectorAll(".home .section__title, .resource-hero__title");

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("show-menu");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const updateHeader = () => {
  header.classList.toggle("shadow-header", window.scrollY >= 40);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const updateActiveLink = () => {
  if (sections.length === 0) {
    return;
  }

  let currentSection = sections[0];

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 180) {
      currentSection = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${currentSection.id}`);
  });
};

window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();

if (homeSection) {
  homeSection.addEventListener("pointermove", (event) => {
    const rect = homeSection.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    homeSection.style.setProperty("--mx", `${x}%`);
    homeSection.style.setProperty("--my", `${y}%`);
  });
}

if (backgroundImages.length > 0) {
  let activeBackground = 0;
  let backgroundTimer;

  const showBackground = (index) => {
    activeBackground = (index + backgroundImages.length) % backgroundImages.length;

    backgroundImages.forEach((image, imageIndex) => {
      image.classList.toggle("is-active", imageIndex === activeBackground);
    });

    backgroundDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeBackground;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  };

  const startBackgroundSlider = () => {
    window.clearInterval(backgroundTimer);
    backgroundTimer = window.setInterval(() => {
      showBackground(activeBackground + 1);
    }, 5000);
  };

  const moveBackground = (direction) => {
    showBackground(activeBackground + direction);
    startBackgroundSlider();
  };

  previousBackgroundButton?.addEventListener("click", () => moveBackground(-1));
  nextBackgroundButton?.addEventListener("click", () => moveBackground(1));

  backgroundDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showBackground(Number(dot.dataset.backgroundSlide));
      startBackgroundSlider();
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(backgroundTimer);
      return;
    }

    startBackgroundSlider();
  });

  showBackground(activeBackground);
  startBackgroundSlider();
}

const typeTitle = (title) => {
  if (title.dataset.typed === "true") {
    return;
  }

  const fullText = title.dataset.typingText;
  let index = 0;
  title.dataset.typed = "true";

  const typeNextCharacter = () => {
    index += 1;
    title.textContent = fullText.slice(0, index);

    if (index < fullText.length) {
      window.setTimeout(typeNextCharacter, 42);
    }
  };

  typeNextCharacter();
};

const typingObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        typeTitle(entry.target);
        typingObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px 10% 0px",
    threshold: 0.18,
  }
);

typingTitles.forEach((title) => {
  const fullText = title.textContent.trim();
  title.dataset.typingText = fullText;
  title.setAttribute("aria-label", fullText);
  title.style.minHeight = `${title.getBoundingClientRect().height}px`;
  title.textContent = "";
  title.classList.add("typing-title");
  typingObserver.observe(title);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px 12% 0px",
    threshold: 0.12,
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});
