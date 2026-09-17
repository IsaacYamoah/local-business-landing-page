// Central Roofing - Ghana Landing Page Interactivity

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector(".contact-form");
    const navigationLinks = document.querySelectorAll(".nav-links a");
    const navToggle = document.querySelector(".nav-toggle");
    const navbar = document.querySelector(".navbar");
    const searchBtn = document.querySelector(".search-btn");
    const animatedHighlights = document.querySelectorAll(".animated-highlight");

    function animateHighlightCount(highlight) {
        const counter = highlight.querySelector("[data-count]");
        const target = Number(counter.dataset.count);
        const suffix = counter.dataset.suffix || "";
        const duration = 1000;
        const startTime = performance.now();

        function updateCount(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(target * easedProgress);
            counter.textContent = target === 1500 && value >= 1000
                ? `${(value / 1000).toFixed(1)}${suffix}`
                : `${value}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        }

        requestAnimationFrame(updateCount);
    }

    if (animatedHighlights.length && "IntersectionObserver" in window) {
        const highlightObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                animateHighlightCount(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.35 });

        animatedHighlights.forEach(function (highlight) {
            highlightObserver.observe(highlight);
        });
    } else {
        animatedHighlights.forEach(function (highlight) {
            highlight.classList.add("is-visible");
            animateHighlightCount(highlight);
        });
    }

    const serviceVideos = document.querySelectorAll(".service-video-card iframe[data-youtube-id]");
    const loadServiceVideo = function (iframe) {
        const videoId = iframe.dataset.youtubeId;
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;
    };

    if (serviceVideos.length && "IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                loadServiceVideo(entry.target);
                observer.unobserve(entry.target);
            });
        }, { rootMargin: "300px 0px", threshold: 0.01 });

        serviceVideos.forEach(function (iframe) {
            videoObserver.observe(iframe);
        });
    } else {
        serviceVideos.forEach(loadServiceVideo);
    }

    function getTargetSection(targetId) {
        if (!targetId || targetId === "#") {
            return null;
        }

        return document.querySelector(targetId);
    }

    function closeMobileMenu() {
        if (!navbar || !navToggle) {
            return;
        }

        navbar.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
    }

    navToggle?.addEventListener("click", function () {
        const isOpen = navbar.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");
            const targetSection = getTargetSection(targetId);

            if (!targetSection) {
                return;
            }

            event.preventDefault();
            targetSection.scrollIntoView({ behavior: "smooth" });

            navigationLinks.forEach(function (navLink) {
                navLink.classList.remove("active");
            });
            link.classList.add("active");

            closeMobileMenu();
        });
    });

    const searchPanel = document.createElement("div");
    searchPanel.className = "search-panel";
    searchPanel.innerHTML = `
        <div class="search-panel-inner">
            <input type="text" id="site-search-input" placeholder="Search this page..." aria-label="Search this page" />
            <ul class="search-results"></ul>
        </div>
    `;
    document.body.appendChild(searchPanel);

    const searchInput = document.getElementById("site-search-input");
    const searchResults = searchPanel.querySelector(".search-results");
    const searchableLinks = Array.from(document.querySelectorAll('a[href^="#"]'))
        .map(function (link) {
            return {
                text: link.textContent.trim(),
                href: link.getAttribute("href")
            };
        })
        .filter(function (item) {
            return item.href && item.href !== "#" && item.text;
        })
        .filter(function (item, index, items) {
            return items.findIndex(function (candidate) {
                return candidate.href === item.href;
            }) === index;
        });

    function renderSearchResults(query) {
        const cleanQuery = query.trim().toLowerCase();
        let items = searchableLinks;

        if (cleanQuery) {
            items = searchableLinks.filter(function (item) {
                return item.text.toLowerCase().includes(cleanQuery);
            });
        }

        searchResults.innerHTML = "";

        if (!items.length) {
            const emptyItem = document.createElement("li");
            emptyItem.innerHTML = "<span>No matching section found.</span>";
            searchResults.appendChild(emptyItem);
            return;
        }

        items.slice(0, 8).forEach(function (item) {
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.href = item.href;
            link.textContent = item.text;
            link.addEventListener("click", function (event) {
                const targetSection = getTargetSection(item.href);
                if (!targetSection) {
                    return;
                }
                event.preventDefault();
                targetSection.scrollIntoView({ behavior: "smooth" });
                searchPanel.classList.remove("open");
                document.body.style.overflow = "";
                searchInput.value = "";
                renderSearchResults("");
            });
            li.appendChild(link);
            searchResults.appendChild(li);
        });
    }

    searchBtn?.addEventListener("click", function () {
        searchPanel.classList.toggle("open");
        document.body.style.overflow = searchPanel.classList.contains("open") ? "hidden" : "";
        if (searchPanel.classList.contains("open")) {
            searchInput.focus();
            renderSearchResults("");
        }
    });

    searchInput?.addEventListener("input", function (event) {
        renderSearchResults(event.target.value);
    });

    searchPanel.addEventListener("click", function (event) {
        if (event.target === searchPanel) {
            searchPanel.classList.remove("open");
            document.body.style.overflow = "";
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") {
            return;
        }

        searchPanel.classList.remove("open");
        document.body.style.overflow = "";
        closeMobileMenu();
    });

    searchPanel.addEventListener("transitionend", function () {
        if (!searchPanel.classList.contains("open")) {
            document.body.style.overflow = "";
        }
    });

    const pageSections = Array.from(document.querySelectorAll("main section[id]"));
    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
                return;
            }

            navigationLinks.forEach(function (link) {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: "-35% 0px -55%", threshold: 0 });

    pageSections.forEach(function (section) {
        sectionObserver.observe(section);
    });

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nameInput = document.getElementById("name").value.trim();
            const emailInput = document.getElementById("email").value.trim();
            const messageInput = document.getElementById("message").value.trim();

            if (nameInput === "" || emailInput === "" || messageInput === "") {
                alert("Please fill in all required fields before submitting.");
                return;
            }

            let existingMsg = document.querySelector(".success-message");
            if (existingMsg) {
                existingMsg.remove();
            }

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

            contactForm.appendChild(successDiv);
            contactForm.reset();
        });
    }
});