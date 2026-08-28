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
    bar.style.transition = "transform 1.2s ease";

    barObserver.observe(bar);
});


// ======================================================
// CERTIFICATE MODAL
// ======================================================

function openCertificate(imagePath) {

    const modal = document.getElementById("certificateModal");
    const preview = document.getElementById("certificatePreview");

    if (!modal || !preview) return;

    preview.src = imagePath;

    modal.classList.add("active");
}


function closeCertificate() {

    const modal = document.getElementById("certificateModal");

    if (!modal) return;

    modal.classList.remove("active");
}


// Close when clicking outside certificate

const certificateModal =
    document.getElementById("certificateModal");

if (certificateModal) {

    certificateModal.addEventListener("click", function (e) {

        if (e.target === this) {
            closeCertificate();
        }

    });

}


// Close with Escape

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {
        closeCertificate();
    }

});


// ======================================================
// LEETCODE HEATMAP
// ======================================================

async function loadLeetCodeHeatmap() {

    const heatmap =
        document.getElementById("leetcodeHeatmap");

    const total =
        document.getElementById("leetcodeTotal");


    // Make sure HTML elements exist

    if (!heatmap || !total) {

        console.error(
            "LeetCode heatmap elements were not found."
        );

        return;
    }


    try {

        total.textContent = "Loading activity...";


        // ==================================================
        // CALL YOUR EXPRESS API
        // ==================================================

        const response =
            await fetch("/api/leetcode");


        console.log(
            "LeetCode API status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "API returned status " +
                response.status
            );

        }


        // ==================================================
        // CONVERT RESPONSE TO JSON
        // ==================================================

        const result =
            await response.json();


        console.log(
            "LeetCode API response:",
            result
        );


        // ==================================================
        // CHECK USER
        // ==================================================

        const user =
            result?.data?.matchedUser;


        if (!user) {

            throw new Error(
                "LeetCode user not found"
            );

        }


        // ==================================================
        // GET SUBMISSION CALENDAR
        // ==================================================

        let calendar =
            user.submissionCalendar;


        console.log(
            "Raw submission calendar:",
            calendar
        );


        // LeetCode sends this as a STRING

        if (typeof calendar === "string") {

            calendar =
                JSON.parse(calendar);

        }


        console.log(
            "Parsed calendar:",
            calendar
        );


        // ==================================================
        // CREATE HEATMAP
        // ==================================================

        createLeetCodeHeatmap(
            calendar,
            heatmap,
            total
        );

    }

    catch (error) {

        console.error(
            "LeetCode Heatmap Error:",
            error
        );


        total.textContent =
            "Unable to load LeetCode activity";


        heatmap.innerHTML = `
            <div class="leetcode-error">
                Unable to load LeetCode activity
            </div>
        `;

    }

}


// ======================================================
// CREATE LEETCODE HEATMAP
// ======================================================

function createLeetCodeHeatmap(
    calendar,
    heatmap,
    total
) {

    // Clear old cells

    heatmap.innerHTML = "";


    // ==================================================
    // CALCULATE TOTAL SUBMISSIONS
    // ==================================================

    let totalSubmissions = 0;


    Object.values(calendar).forEach((count) => {

        totalSubmissions += Number(count);

    });


    total.textContent =
        `${totalSubmissions} submissions`;


    // ==================================================
    // DATE RANGE
    // ==================================================

    const today = new Date();


    // Normalize today to UTC

    const todayUTC = new Date(
        Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate()
        )
    );


    // Last 365 days

    const startDate = new Date(todayUTC);

    startDate.setUTCDate(
        startDate.getUTCDate() - 364
    );


    // Move backwards to Sunday

    startDate.setUTCDate(
        startDate.getUTCDate() -
        startDate.getUTCDay()
    );


    // ==================================================
    // CREATE CELLS
    // ==================================================

    const fragment =
        document.createDocumentFragment();


    let currentDate =
        new Date(startDate);


    while (currentDate <= todayUTC) {


        // ==============================================
        // CREATE CELL
        // ==============================================

        const cell =
            document.createElement("div");


        // ==============================================
        // GENERATE UTC TIMESTAMP
        // ==============================================

        const timestamp =
            Math.floor(
                currentDate.getTime() / 1000
            );


        // ==============================================
        // GET SUBMISSION COUNT
        // ==============================================

        const count =
            Number(
                calendar[String(timestamp)] || 0
            );


        // ==============================================
        // DETERMINE ACTIVITY LEVEL
        // ==============================================

        let level = 0;


        if (count === 0) {

            level = 0;

        }

        else if (count <= 2) {

            level = 1;

        }

        else if (count <= 5) {

            level = 2;

        }

        else if (count <= 9) {

            level = 3;

        }

        else {

            level = 4;

        }


        // ==============================================
        // APPLY CSS CLASS
        // ==============================================

        cell.className =
            `heat-cell level-${level}`;


        // ==============================================
        // FORMAT DATE
        // ==============================================

        const formattedDate =
            currentDate.toLocaleDateString(
                "en-US",
                {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC"
                }
            );


        // ==============================================
        // TOOLTIP
        // ==============================================

        cell.title =
            `${count} submission${count !== 1 ? "s" : ""} • ${formattedDate}`;


        // ==============================================
        // ADD CELL
        // ==============================================

        fragment.appendChild(cell);


        // ==============================================
        // NEXT DAY
        // ==============================================

        currentDate.setUTCDate(
            currentDate.getUTCDate() + 1
        );

    }


    // ==================================================
    // ADD ALL CELLS TO HEATMAP
    // ==================================================

    heatmap.appendChild(fragment);


    console.log(
        "Heatmap created successfully!"
    );

}


// ======================================================
// IMPORTANT: LOAD HEATMAP
// ======================================================

// This was missing from your previous code.

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadLeetCodeHeatmap();

    }
);
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(__dirname));

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});