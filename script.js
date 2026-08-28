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


// ======================================================
// CLOSE CERTIFICATE MODAL WHEN CLICKING OUTSIDE
// ======================================================

const certificateModal =
    document.getElementById("certificateModal");

if (certificateModal) {

    certificateModal.addEventListener("click", function (e) {

        if (e.target === this) {
            closeCertificate();
        }

    });

}


// ======================================================
// CLOSE CERTIFICATE MODAL WITH ESCAPE
// ======================================================

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {
        closeCertificate();
    }

});


// ======================================================
// LEETCODE HEATMAP
// ======================================================

// Your LeetCode username
const LEETCODE_USERNAME = "Puskar_jaiswal_723";

// Public LeetCode API
const LEETCODE_API =
    `https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/calendar`;


// ======================================================
// LOAD LEETCODE HEATMAP
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

        // Show loading message

        total.textContent =
            "Loading activity...";


        heatmap.innerHTML = `
            <div class="leetcode-loading">
                Loading LeetCode activity...
            </div>
        `;


        // ==================================================
        // CALL PUBLIC LEETCODE API
        // ==================================================

        console.log(
            "Fetching LeetCode data from:",
            LEETCODE_API
        );


        const response =
            await fetch(LEETCODE_API);


        console.log(
            "LeetCode API status:",
            response.status
        );


        // Check response

        if (!response.ok) {

            throw new Error(
                "LeetCode API returned status " +
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
        // GET CALENDAR
        // ==================================================

        let calendar = null;


        /*
         * The API normally returns:
         *
         * {
         *     "data": {
         *         ...
         *     }
         * }
         *
         * We handle multiple possible response formats
         * so the heatmap is more robust.
         */


        if (result?.data?.matchedUser?.submissionCalendar) {

            calendar =
                result.data.matchedUser.submissionCalendar;

        }

        else if (result?.submissionCalendar) {

            calendar =
                result.submissionCalendar;

        }

        else if (result?.data?.submissionCalendar) {

            calendar =
                result.data.submissionCalendar;

        }

        else if (result?.calendar) {

            calendar =
                result.calendar;

        }


        // ==================================================
        // CHECK CALENDAR
        // ==================================================

        if (!calendar) {

            console.error(
                "Could not find submission calendar.",
                result
            );

            throw new Error(
                "Submission calendar not found"
            );

        }


        // LeetCode may return the calendar as a string

        if (typeof calendar === "string") {

            calendar =
                JSON.parse(calendar);

        }


        console.log(
            "Parsed LeetCode calendar:",
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


    // ==================================================
    // LAST 365 DAYS
    // ==================================================

    const startDate =
        new Date(todayUTC);


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
        "LeetCode heatmap created successfully!"
    );

}


// ======================================================
// LOAD HEATMAP WHEN PAGE LOADS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadLeetCodeHeatmap();

    }
);
