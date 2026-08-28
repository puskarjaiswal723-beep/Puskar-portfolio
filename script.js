
/* ======================================================
   CONFIGURATION
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

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });

} else {

    revealElements.forEach((element) => {
        element.classList.add("visible");
    });

}


/* ======================================================
   SKILL BAR ANIMATION
====================================================== */

const bars = document.querySelectorAll(".skill-row i span");

if ("IntersectionObserver" in window) {

    const barObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.style.transform = "scaleX(1)";

                    barObserver.unobserve(entry.target);
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

} else {

    bars.forEach((bar) => {
        bar.style.transform = "scaleX(1)";
    });

}


/* ======================================================
   CERTIFICATE MODAL
====================================================== */

function openCertificate(imagePath) {

    const modal = document.getElementById("certificateModal");
    const preview = document.getElementById("certificatePreview");

    if (!modal || !preview) {
        return;
    }

    preview.src = imagePath;

    modal.classList.add("active");

    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}


/* ======================================================
   CLOSE CERTIFICATE
====================================================== */

function closeCertificate() {

    const modal = document.getElementById("certificateModal");
    const preview = document.getElementById("certificatePreview");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.setAttribute("aria-hidden", "true");

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

    certificateModal.addEventListener("click", (event) => {

        if (event.target === certificateModal) {
            closeCertificate();
        }

    });

}


/* ======================================================
   ESCAPE KEY
====================================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeCertificate();
    }

});


/* ======================================================
   EXTRACT LEETCODE CALENDAR
====================================================== */


/* ======================================================
   EXTRACT LEETCODE CALENDAR
====================================================== */

function extractCalendar(data) {

    if (!data) {
        return null;
    }


    /*
     * The Alfa API returns submissionCalendar
     * as a JSON STRING.
     *
     * Example:
     *
     * "submissionCalendar":
     * "{\"1770076800\":9,\"1770422400\":4}"
     *
     * Therefore we must JSON.parse() it.
     */

    if (
        typeof data.submissionCalendar === "string"
    ) {

        try {

            return JSON.parse(
                data.submissionCalendar
            );

        } catch (error) {

            console.error(
                "Failed to parse submissionCalendar:",
                error
            );

            return null;
        }
    }


    /*
     * In case API returns it as an object.
     */

    if (
        data.submissionCalendar &&
        typeof data.submissionCalendar === "object"
    ) {

        return data.submissionCalendar;
    }


    /*
     * data.data.submissionCalendar
     */

    if (
        data.data &&
        typeof data.data.submissionCalendar === "string"
    ) {

        try {

            return JSON.parse(
                data.data.submissionCalendar
            );

        } catch (error) {

            console.error(
                "Failed to parse nested submissionCalendar:",
                error
            );

            return null;
        }
    }


    if (
        data.data &&
        data.data.submissionCalendar &&
        typeof data.data.submissionCalendar === "object"
    ) {

        return data.data.submissionCalendar;
    }


    /*
     * Direct calendar object fallback.
     */

    if (
        typeof data === "object"
    ) {

        const values =
            Object.values(data);

        if (
            values.length > 0 &&
            values.some(
                value =>
                    typeof value === "number"
            )
        ) {

            return data;
        }
    }


    return null;
}



/* ======================================================
   GET COUNT FOR DATE
====================================================== */

function findCalendarCount(calendar, date) {

    if (!calendar) {
        return 0;
    }


    /*
     * LeetCode calendar timestamps are Unix timestamps.
     *
     * We compare using UTC date to avoid timezone issues.
     */

    const targetDate =
        date.toISOString().slice(0, 10);


    for (const [key, value] of Object.entries(calendar)) {

        const timestamp = Number(key);

        if (Number.isNaN(timestamp)) {
            continue;
        }


        const calendarDate =
            new Date(timestamp * 1000)
                .toISOString()
                .slice(0, 10);


        if (calendarDate === targetDate) {
            return Number(value) || 0;
        }

    }


    return 0;
}


/* ======================================================
   CONVERT CALENDAR TO LAST 365 DAYS
====================================================== */

function convertCalendar(calendar) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const startDate = new Date(today);

    startDate.setDate(
        startDate.getDate() - 364
    );


    /*
     * Move start to Sunday.
     */

    startDate.setDate(
        startDate.getDate() -
        startDate.getDay()
    );


    const activity = [];

    const current = new Date(startDate);


    /*
     * Generate daily cells.
     */

    while (current <= today) {

        const date = new Date(current);

        activity.push({

            date: date,

            count:
                findCalendarCount(
                    calendar,
                    date
                )

        });


        current.setDate(
            current.getDate() + 1
        );

    }


    /*
     * Complete final week.
     */

    while (activity.length % 7 !== 0) {

        const lastDate =
            activity[
                activity.length - 1
            ].date;


        const nextDate =
            new Date(lastDate);


        nextDate.setDate(
            nextDate.getDate() + 1
        );


        activity.push({

            date: nextDate,

            count: 0

        });

    }


    return activity;
}


/* ======================================================
   ACTIVITY LEVEL
====================================================== */

function getActivityLevel(count) {

    count = Number(count) || 0;


    if (count <= 0) {
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


/* ======================================================
   RENDER HEATMAP
====================================================== */

function renderHeatmap(activity) {

    const container =
        document.getElementById(
            "leetcodeHeatmap"
        );

    const months =
        document.getElementById(
            "heatmapMonths"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (months) {
        months.innerHTML = "";
    }


    /*
     * Tooltip
     */

    let tooltip =
        document.querySelector(
            ".heat-tooltip"
        );


    if (!tooltip) {

        tooltip =
            document.createElement(
                "div"
            );

        tooltip.className =
            "heat-tooltip";

        document.body.appendChild(
            tooltip
        );
    }


    /*
     * Render each day.
     *
     * Important:
     * Your CSS uses grid-auto-flow: column
     * with 7 rows, so the cells must be
     * inserted week-by-week.
     */

    for (
        let i = 0;
        i < activity.length;
        i += 7
    ) {

        const week =
            activity.slice(
                i,
                i + 7
            );


        week.forEach((day) => {

            const cell =
                document.createElement(
                    "div"
                );


            const level =
                getActivityLevel(
                    day.count
                );


            cell.className =
                `heat-cell level-${level}`;


            const formattedDate =
                day.date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }
                );


            const submissionText =
                day.count === 1
                    ? "submission"
                    : "submissions";


            cell.setAttribute(
                "aria-label",
                `${formattedDate}: ${day.count} ${submissionText}`
            );


            cell.addEventListener(
                "mouseenter",
                (event) => {

                    tooltip.textContent =
                        `${formattedDate} • ${day.count} ${submissionText}`;

                    tooltip.classList.add(
                        "visible"
                    );

                    moveTooltip(
                        event,
                        tooltip
                    );

                }
            );


            cell.addEventListener(
                "mousemove",
                (event) => {

                    moveTooltip(
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


            container.appendChild(
                cell
            );

        });


        /*
         * Month labels
         */

        const firstDay = week[0];

        if (
            firstDay &&
            firstDay.date.getDate() <= 7
        ) {

            addMonthLabel(
                firstDay.date,
                i / 7,
                months
            );

        }

    }

}


/* ======================================================
   TOOLTIP POSITION
====================================================== */

function moveTooltip(event, tooltip) {

    tooltip.style.left =
        `${event.clientX}px`;

    tooltip.style.top =
        `${event.clientY - 10}px`;
}


/* ======================================================
   MONTH LABEL
====================================================== */

function addMonthLabel(
    date,
    weekIndex,
    months
) {

    if (!months) {
        return;
    }


    const label =
        document.createElement(
            "span"
        );


    label.className =
        "heatmap-month";


    label.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                month: "short"
            }
        );


    label.style.left =
        `${weekIndex * 18}px`;


    months.appendChild(
        label
    );
}


/* ======================================================
   CURRENT STREAK
====================================================== */

function calculateCurrentStreak(activity) {

    if (!activity.length) {
        return 0;
    }


    let index =
        activity.length - 1;


    /*
     * Ignore future empty cells.
     */

    while (
        index >= 0 &&
        activity[index].date > new Date()
    ) {

        index--;
    }


    /*
     * If today has no submission,
     * start from yesterday.
     */

    if (
        index >= 0 &&
        activity[index].count === 0
    ) {

        index--;
    }


    let streak = 0;


    while (
        index >= 0 &&
        activity[index].count > 0
    ) {

        streak++;

        index--;
    }


    return streak;
}


/* ======================================================
   LOAD LEETCODE ACTIVITY
====================================================== */

async function loadLeetCodeActivity() {

    const heatmap =
        document.getElementById(
            "leetcodeHeatmap"
        );

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

    const errorBox =
        document.getElementById(
            "leetcodeError"
        );


    if (!heatmap) {
        return;
    }


    try {

        if (totalText) {
            totalText.textContent =
                "Loading activity...";
        }


        /*
         * Request API
         */

        const response =
            await fetch(
                LEETCODE_API,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    },
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
         * Extract actual calendar.
         */

        const calendar =
            extractCalendar(data);


        if (
            !calendar ||
            Object.keys(calendar).length === 0
        ) {

            throw new Error(
                "No submission calendar found in API response."
            );

        }


        console.log(
            "Extracted LeetCode calendar:",
            calendar
        );


        /*
         * Convert API data into
         * 365-day heatmap.
         */

        const activity =
            convertCalendar(
                calendar
            );


        if (!activity.length) {

            throw new Error(
                "No activity data available."
            );

        }


        /*
         * Render.
         */

        renderHeatmap(
            activity
        );


        /*
         * Active days.
         */

        const active =
            activity.filter(
                day => day.count > 0
            ).length;


        /*
         * Total submissions.
         */

        const submissions =
            activity.reduce(
                (sum, day) =>
                    sum + day.count,
                0
            );


        /*
         * Current streak.
         */

        const streak =
            calculateCurrentStreak(
                activity
            );


        /*
         * Update UI.
         */

        if (activeDays) {

            activeDays.textContent =
                active.toLocaleString();

        }


        if (currentStreak) {

            currentStreak.textContent =
                streak;

        }


        if (totalSubmissions) {

            totalSubmissions.textContent =
                submissions.toLocaleString();

        }


        if (totalText) {

            totalText.textContent =
                `${submissions.toLocaleString()} submissions`;

        }


        if (errorBox) {
            errorBox.hidden = true;
        }


        console.log(
            "LeetCode heatmap loaded successfully."
        );

    }

    catch (error) {

        console.error(
            "LeetCode activity error:",
            error
        );


        if (totalText) {

            totalText.textContent =
                "Unable to load activity";

        }


        if (errorBox) {

            errorBox.hidden = false;

            errorBox.textContent =
                "Unable to load LeetCode activity. Check the browser console for details.";

        }

    }

}


/* ======================================================
   START
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadLeetCodeActivity();

    }
);
```
