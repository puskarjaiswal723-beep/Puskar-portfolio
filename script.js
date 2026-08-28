// ======================================================
// CURSOR GLOW
// ======================================================

const cursor = document.querySelector(".cursor-glow");

if (cursor) {
    window.addEventListener("pointermove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });
}


// ======================================================
// SCROLL REVEAL
// ======================================================

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    {
        threshold: 0.12
    }
);

document.querySelectorAll(".reveal").forEach((el) => {
    observer.observe(el);
});


// ======================================================
// SKILL BAR ANIMATION
// ======================================================

const bars = document.querySelectorAll(".skill-row i span");

const barObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.transform = "scaleX(1)";
            }
        });
    },
    {
        threshold: 0.3
    }
);

bars.forEach((bar) => {

    bar.style.transformOrigin = "left";

    bar.style.transform = "scaleX(0)";

    bar.style.transition =
        "transform 1.2s ease";

    barObserver.observe(bar);
});


// ======================================================
// CERTIFICATE MODAL
// ======================================================

function openCertificate(imagePath) {

    const modal =
        document.getElementById("certificateModal");

    const preview =
        document.getElementById("certificatePreview");

    if (!modal || !preview) return;

    preview.src = imagePath;

    modal.classList.add("active");
}


// ======================================================
// CLOSE CERTIFICATE MODAL
// ======================================================

function closeCertificate() {

    const modal =
        document.getElementById("certificateModal");

    if (!modal) return;

    modal.classList.remove("active");
}


// ======================================================
// CLOSE CERTIFICATE WHEN CLICKING OUTSIDE
// ======================================================

const certificateModal =
    document.getElementById("certificateModal");

if (certificateModal) {

    certificateModal.addEventListener(
        "click",
        function (e) {

            if (e.target === this) {
                closeCertificate();
            }

        }
    );

}


// ======================================================
// CLOSE CERTIFICATE WITH ESCAPE
// ======================================================

document.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Escape") {
            closeCertificate();
        }

    }
);


