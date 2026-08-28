/* ======================================================
   PORTFOLIO JAVASCRIPT
   Puskar Jaiswal
====================================================== */


/* ======================================================
   LEETCODE CONFIGURATION
====================================================== */

const LEETCODE_USERNAME = "Puskar_jaiswal_723";

const LEETCODE_API =
    `https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/calendar`;


/* ======================================================
   CURSOR GLOW
====================================================== */

const cursor = document.querySelector(".cursor-glow");

if (cursor) {

    window.addEventListener("pointermove", (event) => {

        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;

    });

}


/* ======================================================
   SCROLL REVEAL
====================================================== */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach((element) => {

        element.classList.add("visible");

    });

}


/* ======================================================
   SKILL BAR ANIMATION
====================================================== */

const skillBars =
    document.querySelectorAll(".skill-row i span");

if ("IntersectionObserver" in window) {

    const skillObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.style.transform = "scaleX(1)";

                    skillObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.3
        }
    );

    skillBars.forEach((bar) => {

        bar.style.transformOrigin = "left";
        bar.style.transform = "scaleX(0)";
        bar.style.transition =
            "transform 1.2s ease";

        skillObserver.observe(bar);

    });

} else {

    skillBars.forEach((bar) => {

        bar.style.transform = "scaleX(1)";

    });

}


/* ======================================================
   CERTIFICATE MODAL
====================================================== */

function openCertificate(imagePath) {

    const modal =
        document.getElementById("certificateModal");

    const preview =
        document.getElementById("certificatePreview");

    if (!modal || !preview) {
        return;
    }

    preview.src = imagePath;

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";
}


/* ======================================================
   CLOSE CERTIFICATE
====================================================== */

function closeCertificate() {

    const modal =
        document.getElementById("certificateModal");

    const preview =
        document.getElementById("certificatePreview");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

    if (preview) {

        preview.src = "";

    }

}


/* ======================================================
   CERTIFICATE OUTSIDE CLICK
====================================================== */

const certificateModal =
    document.getElementById("certificateModal");

if (certificateModal) {

    certificateModal.addEventListener(
        "click",
        (event) => {

            if (event.target === certificateModal) {

                closeCertificate();

            }

        }
    );

}


/* ======================================================
   ESCAPE KEY
====================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            closeCertificate();

        }

    }
);


/* ======================================================
   LEETCODE HELPERS
====================================================== */


/*
    Convert timestamp to YYYY-MM-DD.

    LeetCode's calendar timestamps represent
    dates at UTC midnight.
*/

function timestampToDateKey(timestamp) {

    const date =
        new Date(Number(timestamp) * 1000);

    return date.toISOString().slice(0, 10);
}


/*
    Convert Date object to YYYY-MM-DD.
*/

function dateToKey(date) {

    return date.toISOString().slice(0, 10);

}


/*
    Get activity level.

    0 = no submissions
    1 = 1-2
    2 = 3-5
    3 = 6-9
    4 = 10+
*/

function getActivityLevel(count) {

    count = Number(count) || 0;

    if (count === 0) {
        return 0;
    }

    if (count <= 2) {
        return 1;
    }

    if (count <= 5) {
        return 2;
    }

    if (count <= 9) {
        return 3;
    }

    return 4;

}


/*
    Extract submissionCalendar from
    different possible API response structures.
*/

function extractCalendar(data) {

    let calendar = null;


    /* ----------------------------------------------
       Direct submissionCalendar
    ---------------------------------------------- */

    if (data && data.submissionCalendar) {

        calendar = data.submissionCalendar;

    }


    /* ----------------------------------------------
       data.data.submissionCalendar
    ---------------------------------------------- */

    else if (
        data &&
        data.data &&
        data.data.submissionCalendar
    ) {

        calendar =
            data.data.submissionCalendar;

    }


    /* ----------------------------------------------
       data.data.matchedUser.userCalendar
    ---------------------------------------------- */

    else if (
        data &&
        data.data &&
        data.data.matchedUser &&
        data.data.matchedUser.userCalendar
    ) {

        calendar =
            data.data.matchedUser.userCalendar
                .submissionCalendar;

    }


    /* ----------------------------------------------
       data.matchedUser.userCalendar
    ---------------------------------------------- */

    else if (
        data &&
        data.matchedUser &&
        data.matchedUser.userCalendar
    ) {

        calendar =
            data.matchedUser.userCalendar
                .submissionCalendar;

    }


    if (!calendar) {

        return null;

    }


    /* ----------------------------------------------
       Calendar may be JSON string
    ---------------------------------------------- */

    if (typeof calendar === "string") {

        try {

            return JSON.parse(calendar);

        } catch (error) {

            console.error(
                "Could not parse submissionCalendar:",
                error
            );

            return null;

        }

    }


    /* ----------------------------------------------
       Calendar may already be an object
    ---------------------------------------------- */

    if (
        typeof calendar === "object"
    ) {

        return calendar;

    }


    return null;

}


/* ======================================================
   CREATE LAST 365 DAYS
====================================================== */

function createLast365Days() {

    const days = [];

    const today = new Date();

    /*
        Normalize to UTC.
    */

    const todayUTC =
        new Date(
            Date.UTC(
                today.getUTCFullYear(),
                today.getUTCMonth(),
                today.getUTCDate()
            )
        );


    /*
        364 days before today
        + today = 365 days
    */

    const startDate =
        new Date(todayUTC);

    startDate.setUTCDate(
        startDate.getUTCDate() - 364
    );


    const current =
        new Date(startDate);


    while (current <= todayUTC) {

        days.push(
            new Date(current)
        );

        current.setUTCDate(
            current.getUTCDate() + 1
        );

    }


    return days;

}


/* ======================================================
   CREATE HEATMAP
====================================================== */

function renderHeatmap(calendar) {

    const heatmap =
        document.getElementById(
            "leetcodeHeatmap"
        );

    const months =
        document.getElementById(
            "heatmapMonths"
        );

    if (!heatmap) {

        console.error(
            "LeetCode heatmap element not found."
        );

        return;

    }


    /*
        Clear previous content.
    */

    heatmap.innerHTML = "";

    if (months) {

        months.innerHTML = "";

    }


    /*
        Convert API timestamps into
        an efficient date -> count map.
    */

    const activityMap =
        new Map();


    Object.entries(calendar).forEach(
        ([timestamp, count]) => {

            const key =
                timestampToDateKey(timestamp);

            activityMap.set(
                key,
                Number(count) || 0
            );

        }
    );


    /*
        Generate 365 days.
    */

    const days =
        createLast365Days();


    /*
        Make first day Sunday.

        JS:
        Sunday = 0
        Monday = 1
        ...
        Saturday = 6
    */

    const firstDay =
        days[0].getUTCDay();


    /*
        Empty cells before first day.
    */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "heat-cell heat-empty";

        heatmap.appendChild(empty);

    }


    /*
        Tooltip.
    */

    let tooltip =
        document.querySelector(
            ".heat-tooltip"
        );


    if (!tooltip) {

        tooltip =
            document.createElement("div");

        tooltip.className =
            "heat-tooltip";

        document.body.appendChild(
            tooltip
        );

    }


    /*
        Render every day.
    */

    days.forEach((date) => {

        const key =
            dateToKey(date);

        const count =
            activityMap.get(key) || 0;

        const level =
            getActivityLevel(count);


        const cell =
            document.createElement("div");


        cell.className =
            `heat-cell level-${level}`;


        /*
            Human-readable date.
        */

        const formattedDate =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC"
                }
            );


        const submissionWord =
            count === 1
                ? "submission"
                : "submissions";


        const tooltipText =
            `${formattedDate} • ${count} ${submissionWord}`;


        cell.setAttribute(
            "title",
            tooltipText
        );


        cell.setAttribute(
            "aria-label",
            tooltipText
        );


        /*
            Tooltip events.
        */

        cell.addEventListener(
            "mouseenter",
            (event) => {

                tooltip.textContent =
                    tooltipText;

                tooltip.classList.add(
                    "visible"
                );

                moveHeatmapTooltip(
                    event,
                    tooltip
                );

            }
        );


        cell.addEventListener(
            "mousemove",
            (event) => {

                moveHeatmapTooltip(
                    event,
                    tooltip
                );

            }
        );


        cell.addEventListener(
            "mouseleave",
            () => {

                tooltip.classList.remove(
                    "visible"
                );

            }
        );


        heatmap.appendChild(cell);

    });


    /*
        Render month labels.
    */

    renderMonthLabels(
        days,
        firstDay,
        months
    );


    /*
        Return activity information
        for statistics.
    */

    return {
        days,
        activityMap
    };

}


/* ======================================================
   MONTH LABELS
====================================================== */

function renderMonthLabels(
    days,
    firstDay,
    months
) {

    if (!months) {
        return;
    }


    let lastMonth =
        null;


    days.forEach(
        (date, index) => {

            const month =
                date.getUTCMonth();

            const year =
                date.getUTCFullYear();


            const monthKey =
                `${year}-${month}`;


            /*
                Only add label when month changes.
            */

            if (
                monthKey !== lastMonth
            ) {

                const label =
                    document.createElement("span");


                label.className =
                    "heatmap-month";


                label.textContent =
                    date.toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            timeZone: "UTC"
                        }
                    );


                /*
                    Determine column.

                    7 rows per column.
                */

                const column =
                    Math.floor(
                        (index + firstDay) / 7
                    );


                /*
                    18px = cell width + gap
                */

                label.style.left =
                    `${column * 18}px`;


                months.appendChild(
                    label
                );


                lastMonth =
                    monthKey;

            }

        }
    );

}


/* ======================================================
   CALCULATE STATISTICS
====================================================== */

function calculateStatistics(
    days,
    activityMap
) {

    /*
        Active days.
    */

    const activeDays =
        days.filter(
            (date) => {

                const count =
                    activityMap.get(
                        dateToKey(date)
                    ) || 0;

                return count > 0;

            }
        ).length;


    /*
        Total submissions.
    */

    const totalSubmissions =
        days.reduce(
            (total, date) => {

                const count =
                    activityMap.get(
                        dateToKey(date)
                    ) || 0;

                return total + count;

            },
            0
        );


    /*
        Current streak.

        Start from today and move backwards.
    */

    let currentStreak = 0;


    for (
        let i = days.length - 1;
        i >= 0;
        i--
    ) {

        const date =
            days[i];


        const count =
            activityMap.get(
                dateToKey(date)
            ) || 0;


        if (count > 0) {

            currentStreak++;

        } else {

            break;

        }

    }


    return {
        activeDays,
        totalSubmissions,
        currentStreak
    };

}


/* ======================================================
   UPDATE LEETCODE STATISTICS
====================================================== */

function updateLeetCodeStats(
    statistics
) {

    const totalText =
        document.getElementById(
            "leetcodeTotal"
        );

    const activeDays =
        document.getElementById(
            "leetcodeActiveDays"
        );

    const currentStreak =
        document.getElementById(
            "leetcodeCurrentStreak"
        );

    const totalSubmissions =
        document.getElementById(
            "leetcodeTotalSubmissions"
        );


    if (totalText) {

        totalText.textContent =
            `${statistics.totalSubmissions.toLocaleString()} submissions`;

    }


    if (activeDays) {

        activeDays.textContent =
            statistics.activeDays.toLocaleString();

    }


    if (currentStreak) {

        currentStreak.textContent =
            statistics.currentStreak.toLocaleString();

    }


    if (totalSubmissions) {

        totalSubmissions.textContent =
            statistics.totalSubmissions.toLocaleString();

    }

}


/* ======================================================
   TOOLTIP POSITION
====================================================== */

function moveHeatmapTooltip(
    event,
    tooltip
) {

    const offset = 14;


    let left =
        event.clientX + offset;

    let top =
        event.clientY - 40;


    /*
        Prevent tooltip from leaving
        right side of screen.
    */

    const tooltipWidth =
        tooltip.offsetWidth;


    if (
        left + tooltipWidth >
        window.innerWidth - 10
    ) {

        left =
            event.clientX -
            tooltipWidth -
            offset;

    }


    /*
        Prevent tooltip from leaving
        top of screen.
    */

    if (top < 10) {

        top =
            event.clientY + offset;

    }


    tooltip.style.left =
        `${left}px`;

    tooltip.style.top =
        `${top}px`;

}


/* ======================================================
   LOAD LEETCODE ACTIVITY
====================================================== */
/* ======================================================
   LOAD LEETCODE SOLVED PROGRESS
====================================================== */

async function loadLeetCodeSolvedProgress() {

    const solvedCount =
        document.getElementById(
            "leetcodeSolvedCount"
        );

    const totalQuestions =
        document.getElementById(
            "leetcodeTotalQuestions"
        );

    const progressCircle =
        document.getElementById(
            "leetcodeProgressCircle"
        );


    if (
        !solvedCount ||
        !totalQuestions ||
        !progressCircle
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                LEETCODE_SOLVED_API,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Solved API returned HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "LeetCode solved response:",
            data
        );


        /*
           The API normally returns
           total solved questions and
           difficulty-wise solved counts.
        */

        const solved =
            Number(
                data.solvedProblem ||
                data.solved ||
                data.totalSolved ||
                data.totalSolvedQuestions ||
                0
            );


        /*
           Current approximate total number
           of LeetCode problems.

           This can be updated later without
           touching the heatmap.
        */

        const total =
            3000;


        solvedCount.textContent =
            solved.toLocaleString();


        totalQuestions.textContent =
            total.toLocaleString();


        /*
           Calculate progress percentage.
        */

        const percentage =
            Math.min(
                (solved / total) * 100,
                100
            );


        /*
           Circle circumference:
           2 × π × 50 = 314.16
        */

        const circumference =
            314.16;


        const offset =
            circumference -
            (
                percentage / 100
            ) * circumference;


        progressCircle.style.strokeDashoffset =
            offset;


    } catch (error) {

        console.error(
            "LeetCode solved progress error:",
            error
        );

        solvedCount.textContent = "--";

        totalQuestions.textContent = "--";

        progressCircle.style.strokeDashoffset =
            314.16;

    }

}
async function loadLeetCodeActivity() {

    const heatmap =
        document.getElementById(
            "leetcodeHeatmap"
        );

    const totalText =
        document.getElementById(
            "leetcodeTotal"
        );

    const errorBox =
        document.getElementById(
            "leetcodeError"
        );


    if (!heatmap) {

        return;

    }


    /*
        Loading state.
    */

    if (totalText) {

        totalText.textContent =
            "Loading activity...";

    }


    if (errorBox) {

        errorBox.hidden = true;

    }


    try {

        /*
            Request API.
        */

        const response =
            await fetch(
                LEETCODE_API,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `API returned HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "LeetCode API response:",
            data
        );


        /*
            Extract calendar.
        */

        const calendar =
            extractCalendar(data);


        if (!calendar) {

            throw new Error(
                "submissionCalendar was not found in API response."
            );

        }


        console.log(
            "Parsed LeetCode calendar:",
            calendar
        );


        /*
            Render heatmap.
        */

        const result =
            renderHeatmap(calendar);


        if (!result) {

            throw new Error(
                "Unable to render heatmap."
            );

        }


        /*
            Calculate statistics.
        */

        const statistics =
            calculateStatistics(
                result.days,
                result.activityMap
            );


        /*
            Update UI.
        */

        updateLeetCodeStats(
            statistics
        );


        /*
            Hide error.
        */

        if (errorBox) {

            errorBox.hidden = true;

        }


        console.log(
            "LeetCode heatmap loaded successfully."
        );

    } catch (error) {

        console.error(
            "LeetCode heatmap error:",
            error
        );


        /*
            Show fallback UI.
        */

        if (totalText) {

            totalText.textContent =
                "Unable to load activity";

        }


        if (errorBox) {

            errorBox.hidden = false;

            errorBox.textContent =
                "Unable to load LeetCode activity. Please try again later.";

        }

    }

}


/* ======================================================
   START LEETCODE
====================================================== */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            loadLeetCodeActivity();

            loadLeetCodeSolvedProgress();

        }
    );

} else {

    loadLeetCodeActivity();

    loadLeetCodeSolvedProgress();

}
