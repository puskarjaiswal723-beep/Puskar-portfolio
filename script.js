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

const revealElements =
    document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
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

const bars =
    document.querySelectorAll(
        ".skill-row i span"
    );

if ("IntersectionObserver" in window) {

    const barObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.style.transform =
                            "scaleX(1)";

                        barObserver.unobserve(
                            entry.target
                        );
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

} else {

    bars.forEach((bar) => {
        bar.style.transform = "scaleX(1)";
    });

}


/* ======================================================
   CERTIFICATE MODAL
====================================================== */

function openCertificate(imagePath) {

    const modal =
        document.getElementById(
            "certificateModal"
        );

    const preview =
        document.getElementById(
            "certificatePreview"
        );

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
        document.getElementById(
            "certificateModal"
        );

    const preview =
        document.getElementById(
            "certificatePreview"
        );

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
    document.getElementById(
        "certificateModal"
    );

if (certificateModal) {

    certificateModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                certificateModal
            ) {
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
   LEETCODE
====================================================== */

async function loadLeetCodeActivity() {

    const heatmap =
        document.getElementById("leetcodeHeatmap");

    const totalText =
        document.getElementById("leetcodeTotal");

    const activeDays =
        document.getElementById("leetcodeActiveDays");

    const currentStreak =
        document.getElementById("leetcodeCurrentStreak");

    const totalSubmissions =
        document.getElementById("leetcodeTotalSubmissions");

    const errorBox =
        document.getElementById("leetcodeError");


    if (!heatmap) {
        return;
    }


    try {

        if (totalText) {
            totalText.textContent = "Loading activity...";
        }


        const response = await fetch(LEETCODE_API);

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }


        const data = await response.json();

        console.log("LeetCode API response:", data);


        /*
         * Alfa API returns calendar data.
         *
         * We support both possible structures:
         * data.calendar
         * data itself
         */

        const calendar =
            data.calendar ||
            data.data ||
            data;


        if (
            !calendar ||
            Object.keys(calendar).length === 0
        ) {

            throw new Error(
                "Submission calendar is empty."
            );
        }


        /*
         * Convert calendar object into
         * our heatmap format.
         */

        const activity = [];


        for (const [timestamp, count] of Object.entries(calendar)) {

            const date =
                new Date(
                    Number(timestamp) * 1000
                );


            activity.push({
                date: date,
                count: Number(count) || 0
            });

        }


        /*
         * Sort oldest → newest
         */

        activity.sort(
            (a, b) =>
                a.date - b.date
        );


        if (!activity.length) {
            throw new Error(
                "No activity data found."
            );
        }


        /*
         * Render heatmap
         */

        renderHeatmap(activity);


        /*
         * Calculate active days
         */

        const active =
            activity.filter(
                day => day.count > 0
            ).length;


        /*
         * Calculate total submissions
         */

        const submissions =
            activity.reduce(
                (sum, day) =>
                    sum + day.count,
                0
            );


        /*
         * Calculate current streak
         */

        const streak =
            calculateCurrentStreak(
                activity
            );


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
                "Unable to load LeetCode activity.";

        }

    }

}
/* ======================================================
   EXTRACT CALENDAR
====================================================== */

function extractCalendar(data) {

    if (!data) {
        return null;
    }


    if (
        data.submissionCalendar &&
        typeof data.submissionCalendar ===
            "object"
    ) {

        return data.submissionCalendar;
    }


    if (
        data.data?.submissionCalendar &&
        typeof data.data.submissionCalendar ===
            "object"
    ) {

        return data.data.submissionCalendar;
    }


    if (
        data.userCalendar?.submissionCalendar &&
        typeof data.userCalendar.submissionCalendar ===
            "object"
    ) {

        return data.userCalendar.submissionCalendar;
    }


    if (
        data.data?.userCalendar?.submissionCalendar &&
        typeof data.data.userCalendar.submissionCalendar ===
            "object"
    ) {

        return data.data.userCalendar.submissionCalendar;
    }


    /*
     * Some APIs directly return
     * the calendar object.
     */

    if (
        typeof data === "object" &&
        Object.values(data).some(
            value =>
                typeof value === "number"
        )
    ) {

        return data;
    }


    return null;
}


/* ======================================================
   CONVERT CALENDAR
====================================================== */

function convertCalendar(calendar) {

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    /*
     * Last 365 days.
     */

    const endDate =
        new Date(today);


    const startDate =
        new Date(endDate);


    startDate.setDate(
        startDate.getDate() - 364
    );


    /*
     * Start from Sunday.
     */

    startDate.setDate(
        startDate.getDate() -
        startDate.getDay()
    );


    const activity = [];


    const cursor =
        new Date(startDate);


    while (cursor <= endDate) {

        const timestamp =
            Math.floor(
                cursor.getTime() / 1000
            );


        const count =
            findCalendarCount(
                calendar,
                cursor,
                timestamp
            );


        activity.push({

            date: new Date(cursor),

            count:
                Number(count) || 0

        });


        cursor.setDate(
            cursor.getDate() + 1
        );

    }


    /*
     * Complete final week with empty
     * cells so the 7-row grid remains correct.
     */

    while (
        activity.length % 7 !== 0
    ) {

        const last =
            activity[
                activity.length - 1
            ].date;


        const next =
            new Date(last);


        next.setDate(
            next.getDate() + 1
        );


        activity.push({

            date: next,

            count: 0

        });

    }


    return activity;
}


/* ======================================================
   FIND CALENDAR COUNT
====================================================== */

function findCalendarCount(
    calendar,
    date,
    timestamp
) {

    /*
     * Exact Unix timestamp.
     */

    if (
        calendar[timestamp] !== undefined
    ) {

        return calendar[timestamp];
    }


    const stringKey =
        String(timestamp);


    if (
        calendar[stringKey] !== undefined
    ) {

        return calendar[stringKey];
    }


    /*
     * Compare calendar dates.
     */

    const target =
        date.toISOString()
            .slice(0, 10);


    for (
        const [key, value]
        of Object.entries(calendar)
    ) {

        const numeric =
            Number(key);


        if (
            !Number.isNaN(numeric)
        ) {

            const calendarDate =
                new Date(
                    numeric * 1000
                );


            const calendarDay =
                calendarDate
                    .toISOString()
                    .slice(0, 10);


            if (
                calendarDay === target
            ) {

                return value;
            }

        }

    }


    return 0;
}


/* ======================================================
   ACTIVITY LEVEL
====================================================== */

function getActivityLevel(count) {

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
     * Create tooltip.
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
     * Number of weeks.
     */

    const weeks = [];


    for (
        let i = 0;
        i < activity.length;
        i += 7
    ) {

        weeks.push(
            activity.slice(
                i,
                i + 7
            )
        );

    }


    /*
     * Render cells.
     */

    weeks.forEach(
        (week, weekIndex) => {

            week.forEach(
                (day) => {

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

                }
            );


            /*
             * Add month labels.
             */

            const firstDay =
                week[0];


            if (
                firstDay &&
                firstDay.date.getDate() <= 7
            ) {

                addMonthLabel(
                    firstDay.date,
                    weekIndex,
                    months
                );

            }

        }
    );

}


/* ======================================================
   MOVE TOOLTIP
====================================================== */

function moveTooltip(
    event,
    tooltip
) {

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


    /*
     * Each week:
     * 13px cell + 5px gap = 18px.
     */

    label.style.left =
        `${weekIndex * 18}px`;


    months.appendChild(
        label
    );
}


/* ======================================================
   CURRENT STREAK
====================================================== */

function calculateCurrentStreak(
    activity
) {

    if (!activity.length) {
        return 0;
    }


    let index =
        activity.length - 1;


    /*
     * If today has no submission,
     * start from yesterday.
     */

    if (
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
   START
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadLeetCodeActivity();

    }
);
