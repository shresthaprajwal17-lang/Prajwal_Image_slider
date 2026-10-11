
const slider = document.querySelector(".slider");
const track = slider.querySelector(".slider-track");
const dotsContainer = slider.querySelector(".slider-dots");
const previousButton = slider.querySelector(".previous");
const nextButton = slider.querySelector(".next");
const year = document.querySelector("#year");

const originalSlides = Array.from(
    track.querySelectorAll(".slide")
);

const totalSlides = originalSlides.length;

let currentIndex = 1;
let isAnimating = false;

// Display the current year.
year.textContent = new Date().getFullYear();

// Clone the first and last slides for infinite looping.
const firstClone = originalSlides[0].cloneNode(true);
const lastClone = originalSlides[totalSlides - 1].cloneNode(true);

firstClone.setAttribute("aria-hidden", "true");
lastClone.setAttribute("aria-hidden", "true");

track.prepend(lastClone);
track.append(firstClone);

const allSlides = Array.from(
    track.querySelectorAll(".slide")
);

// Create one dot for each original slide.
const dots = originalSlides.map((slide, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `Go to image ${index + 1}`);

    dot.addEventListener("click", () => {
        if (isAnimating) return;

        moveTo(index + 1);
    });

    dotsContainer.appendChild(dot);
    return dot;
});

// Move the track to the selected slide.
function updateSlider(animate = true) {
    track.style.transition = animate
        ? "transform 450ms ease-in-out"
        : "none";

    track.style.transform =
        `translateX(-${currentIndex * 100}%)`;

    const realIndex =
        (currentIndex - 1 + totalSlides) % totalSlides;

    dots.forEach((dot, index) => {
        const isActive = index === realIndex;

        dot.classList.toggle("active", isActive);

        if (isActive) {
            dot.setAttribute("aria-current", "true");
        } else {
            dot.removeAttribute("aria-current");
        }
    });
}

// Navigate to a particular slide position.
function moveTo(index) {
    if (isAnimating) return;

    isAnimating = true;
    currentIndex = index;

    updateSlider(true);
}

// Move to the next slide.
function nextSlide() {
    moveTo(currentIndex + 1);
}

// Move to the previous slide.
function previousSlide() {
    moveTo(currentIndex - 1);
}

nextButton.addEventListener("click", nextSlide);
previousButton.addEventListener("click", previousSlide);

// Reset the position after reaching a cloned slide.
track.addEventListener("transitionend", (event) => {
    if (event.target !== track ||
        event.propertyName !== "transform") {
        return;
    }

    if (currentIndex === totalSlides + 1) {
        currentIndex = 1;
        updateSlider(false);
    } else if (currentIndex === 0) {
        currentIndex = totalSlides;
        updateSlider(false);
    }

    isAnimating = false;
});

// Recalculate the track position if the window changes size.
window.addEventListener("resize", () => {
    updateSlider(false);
});

// Show the first real slide when the page loads.
updateSlider(false);
