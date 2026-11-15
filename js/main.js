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
