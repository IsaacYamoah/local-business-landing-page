// Central Roofing - Ghana Landing Page Interactivity

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector(".contact-form");
    const navigationLinks = document.querySelectorAll(".nav-links a");

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (!targetSection) {
                return;
            }

            event.preventDefault();
            targetSection.scrollIntoView({ behavior: "smooth" });
        });
    });

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            // Prevent the default form submission reload
            event.preventDefault();

            // Grab input values
            const nameInput = document.getElementById("name").value.trim();
            const emailInput = document.getElementById("email").value.trim();
            const messageInput = document.getElementById("message").value.trim();

            // Simple validation check
            if (nameInput === "" || emailInput === "" || messageInput === "") {
                alert("Please fill in all required fields before submitting.");
                return;
            }

            // Check if a success message already exists to avoid duplicates
            let existingMsg = document.querySelector(".success-message");
            if (existingMsg) {
                existingMsg.remove();
            }

            // Create a success feedback banner
            const successDiv = document.createElement("div");
            successDiv.className = "success-message";
            successDiv.style.marginTop = "15px";
            successDiv.style.padding = "12px";
            successDiv.style.backgroundColor = "#d4edda";
            successDiv.style.color = "#155724";
            successDiv.style.border = "1px solid #c3e6cb";
            successDiv.style.borderRadius = "5px";
            successDiv.style.fontWeight = "bold";
            successDiv.style.textAlign = "center";
            successDiv.textContent = `Thank you, ${nameInput}! Your message has been received. We will get back to you shortly (Demo Mode).`;

            // Append the success message below the form button
            contactForm.appendChild(successDiv);

            // Clear the form fields
            contactForm.reset();
        });
    }
});