// ===== Mobile menu toggle =====
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);

  // Tells screen readers whether the menu is open (accessibility)
  navToggle.setAttribute("aria-expanded", isOpen);
});

// ===== Auto-update the copyright year in the footer =====
const yearSpan = document.querySelector("#year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ===== Gallery filters (gallery page only) =====
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter; // "all", "mowing", etc.

    // Highlight the clicked button only
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Show photos that match, hide the rest
    galleryItems.forEach((item) => {
      const matches = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("hidden", !matches);
    });
  });
});

// ===== Lightbox: click a photo to see it bigger =====
const lightbox = document.querySelector(".lightbox");

if (lightbox) {
  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = item.querySelector("figcaption").textContent;
      lightbox.showModal(); // built-in: opens the <dialog> (Esc closes it)
    });
  });

  // Close with the X button, or by clicking the dark area outside the photo
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

// ===== Quote form (contact page only) =====
const quoteForm = document.querySelector("#quote-form");

if (quoteForm) {
  const status = quoteForm.querySelector(".form-status");
  const submitBtn = quoteForm.querySelector("button[type='submit']");

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop the page from reloading

    // Not connected to Formspree yet? Tell the user instead of failing silently.
    if (quoteForm.action.includes("YOUR_FORM_ID")) {
      status.textContent = "Form not connected yet. Add your Formspree ID to make it send.";
      status.className = "form-status error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    status.textContent = "";

    try {
      // Send the form data to Formspree in the background
      const response = await fetch(quoteForm.action, {
        method: "POST",
        body: new FormData(quoteForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        quoteForm.reset();
        status.textContent = "Thanks! We got your request and will reply within 24 hours.";
        status.className = "form-status success";
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      status.textContent = "Sorry, something went wrong. Please call us at (555) 555-1234.";
      status.className = "form-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send My Request";
    }
  });
}
