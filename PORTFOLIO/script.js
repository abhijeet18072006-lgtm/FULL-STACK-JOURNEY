const navbar = document.querySelector("#navbar");
const menuButton = navbar?.querySelector("button");
const menu = navbar?.querySelector("#navbar-menu");
const navigationLinks = navbar ? [...navbar.querySelectorAll("#navbar-menu a[href^='#']")] : [];
const sections = [...document.querySelectorAll("main > section[id]")];
const mobileQuery = window.matchMedia("(max-width: 760px)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (menuButton && menu) {
	menuButton.setAttribute("aria-controls", "navbar-menu");

	const syncMenuState = () => {
		const isMobile = mobileQuery.matches;
		menu.hidden = isMobile;
		menuButton.setAttribute("aria-expanded", String(!isMobile));
		menuButton.setAttribute("aria-label", isMobile ? "Open navigation menu" : "Navigation menu");
	};

	const toggleMenu = () => {
		const isOpen = menuButton.getAttribute("aria-expanded") === "true";
		menu.hidden = isOpen;
		menuButton.setAttribute("aria-expanded", String(!isOpen));
		menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
	};

	menuButton.addEventListener("click", toggleMenu);
	mobileQuery.addEventListener("change", syncMenuState);
	syncMenuState();

	// Close the mobile menu after choosing a section.
	navigationLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (mobileQuery.matches) {
				menu.hidden = true;
				menuButton.setAttribute("aria-expanded", "false");
				menuButton.setAttribute("aria-label", "Open navigation menu");
			}
		});
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && mobileQuery.matches && !menu.hidden) {
			menu.hidden = true;
			menuButton.setAttribute("aria-expanded", "false");
			menuButton.setAttribute("aria-label", "Open navigation menu");
			menuButton.focus();
		}
	});
}

const setActiveLink = (sectionId) => {
	navigationLinks.forEach((link) => {
		const isActive = link.getAttribute("href") === `#${sectionId}`;
		link.toggleAttribute("aria-current", isActive);
	});
};

// Reveal sections once as they enter the viewport, keeping them visible afterward.
if ("IntersectionObserver" in window) {
	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				return;
			}

			const section = entry.target;
			section.style.transition = reducedMotionQuery.matches ? "none" : "opacity 500ms ease, transform 500ms ease";
			section.style.opacity = "1";
			section.style.transform = "translateY(0)";
			revealObserver.unobserve(section);
		});
	}, { threshold: [0, 0.25, 0.5, 0.75], rootMargin: "-15% 0px -55%" });

	sections.forEach((section) => {
		if (!reducedMotionQuery.matches) {
			section.style.opacity = "0";
			section.style.transform = "translateY(14px)";
		}
		revealObserver.observe(section);
	});
} else {
	sections.forEach((section) => {
		section.style.opacity = "1";
		section.style.transform = "none";
	});
}

if ("IntersectionObserver" in window) {
	const activeSectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				setActiveLink(entry.target.id);
			}
		});
	}, { threshold: 0.55, rootMargin: "-10% 0px -35%" });

	sections.forEach((section) => activeSectionObserver.observe(section));
}

setActiveLink("home");
