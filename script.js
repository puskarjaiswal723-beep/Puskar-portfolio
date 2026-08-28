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


// ======================================================
// LEETCODE HEATMAP
// ======================================================

// Your LeetCode username

const LEETCODE_USERNAME =
    "Puskar_jaiswal_723";


// ======================================================
// LOAD LEETCODE HEATMAP
// ======================================================

function loadLeetCodeHeatmap() {

    const heatmap =
        document.getElementById(
            "leetcodeHeatmap"
        );

    const total =
        document.getElementById(
            "leetcodeTotal"
        );


    // Check whether HTML elements exist

    if (!heatmap) {

        console.error(
            "leetcodeHeatmap element not found."
        );

        return;
    }


    // ==================================================
    // CLEAR OLD CONTENT
    // ==================================================

    heatmap.innerHTML = "";


    // ==================================================
    // CREATE HEATMAP IMAGE
    // ==================================================

    const heatmapImage =
        document.createElement("img");


    /*
     * LeetCode Stats Card provides a
     * heatmap extension showing the
     * user's activity for the past
     * 52 weeks.
     */

    heatmapImage.src =
        `https://leetcard.jacoblin.cool/${LEETCODE_USERNAME}?ext=heatmap&theme=dark&cache=0`;


    heatmapImage.alt =
        "LeetCode submission heatmap";


    // ==================================================
    // IMAGE STYLING
    // ==================================================

    heatmapImage.style.display =
        "block";

    heatmapImage.style.width =
        "100%";

    heatmapImage.style.maxWidth =
        "900px";

    heatmapImage.style.height =
        "auto";

    heatmapImage.style.margin =
        "0 auto";


    // ==================================================
    // LOADING MESSAGE
    // ==================================================

    if (total) {

        total.textContent =
            "LeetCode Activity";

    }


    // ==================================================
    // ERROR HANDLING
    // ==================================================

    heatmapImage.onerror =
        function () {

            console.error(
                "Unable to load LeetCode heatmap."
            );


            heatmap.innerHTML = `
                <div class="leetcode-error">
                    Unable to load LeetCode activity.
                </div>
            `;


            if (total) {

                total.textContent =
                    "Unable to load LeetCode activity";

            }

        };


    // ==================================================
    // SUCCESS
    // ==================================================

    heatmapImage.onload =
        function () {

            console.log(
                "LeetCode heatmap loaded successfully!"
            );

        };


    // ==================================================
    // ADD IMAGE TO PAGE
    // ==================================================

    heatmap.appendChild(
        heatmapImage
    );

}


// ======================================================
// LOAD EVERYTHING AFTER DOM IS READY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadLeetCodeHeatmap();

    }
);
