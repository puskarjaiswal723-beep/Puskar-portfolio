```javascript
/* ======================================================
   CONFIGURATION
====================================================== */

const LEETCODE_USERNAME = "Puskar_jaiswal_723";

const LEETCODE_API =
    `https://leetcode-api-pied.vercel.app/user/${LEETCODE_USERNAME}/calendar`;


/* ======================================================
   CURSOR GLOW
====================================================== */

const cursor = document.querySelector(".cursor-glow");

if (cursor) {

    window.addEventListener("pointermove", (e) => {

        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

    });

}


/* ======================================================
   SCROLL REVEAL
====================================================== */

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


document.querySelectorAll(".reveal").forEach((element) => {

    observer.observe(element);

});


/* ======================================================
   SKILL BAR ANIMATION
====================================================== */

const bars =
    document.querySelectorAll(".skill-row i span");


const barObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.transform =
                    "scaleX(1)";

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

    bar.style.transition =
        "transform 1.2s ease";

    barObserver.observe(bar);

});


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

        const response =
            await fetch(
                LEETCODE_API,
                {
                    method: "GET",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        /*
         * The API normally returns:
         *
         * {
         *   submissionCalendar: {
         *      "timestamp": count,
         *      ...
         *   },
         *   totalActiveDays: number,
         *   streak: number
         * }
         *
         */


        const calendar =
            extractCalendar(data);


        if (
            !calendar ||
            Object.keys(calendar).length === 0
        ) {

            throw new Error(
                "No submission calendar was returned."
            );

        }


        const activity =
            convertCalendar(calendar);


        renderHeatmap(activity);


        const active =
            activity.filter(
                day => day.count > 0
            ).length;


        const submissions =
            activity.reduce(
                (sum, day) =>
                    sum + day.count,
                0
            );


        const streak =
            Number(
                data.streak ??
                data.currentStreak ??
                calculateCurrentStreak(activity)
            );


        if (activeDays) {

            activeDays.textContent =
                data.totalActiveDays ??
                active;

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
                "Unable to load live LeetCode activity right now. " +
                "Please refresh the page in a few seconds.";

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


    /*
     * Different API versions may
     * wrap the calendar differently.
     */


    if (
        data.submissionCalendar &&
        typeof data.submissionCalendar ===
            "object"
    ) {

        return data.submissionCalendar;

    }


    if (
        data.data &&
        data.data.submissionCalendar
    ) {

        return data.data.submissionCalendar;

    }


    if (
        data.userCalendar &&
        data.userCalendar.submissionCalendar
    ) {

        return data.userCalendar
            .submissionCalendar;

    }


    if (
        data.data &&
        data.data.userCalendar &&
        data.data.userCalendar.submissionCalendar
    ) {

        return data.data.userCalendar
            .submissionCalendar;

    }


    return null;
}


/* ======================================================
   CONVERT CALENDAR
====================================================== */

function convertCalendar(calendar) {

    const today =
        new Date();


    /*
     * We display approximately
     * the latest 52 weeks.
     */

    const endDate =
        new Date(today);

    endDate.setHours(
        0, 0, 0, 0
    );


    const startDate =
        new Date(endDate);

    startDate.setDate(
        startDate.getDate() - 363
    );


    /*
     * Move start date backward
     * to Sunday.
     */

    startDate.setDate(
        startDate.getDate() -
        startDate.getDay()
    );


    const activity = [];


    const cursor =
        new Date(startDate);


    while (
        cursor <= endDate
    ) {

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

            date:
                new Date(cursor),

            count:
                Number(count) || 0

        });


        cursor.setDate(
            cursor.getDate() + 1
        );

    }


    return activity;
}


/* ======================================================
   FIND COUNT
====================================================== */

function findCalendarCount(
    calendar,
    date,
    timestamp
) {

    /*
     * Most LeetCode calendars
     * use Unix timestamps.
     */

    if (
        calendar[timestamp] !== undefined
    ) {

        return calendar[timestamp];

    }


    /*
     * Some APIs may return
     * string timestamps.
     */

    const key =
        String(timestamp);

    if (
        calendar[key] !== undefined
    ) {

        return calendar[key];

    }


    /*
     * Fallback:
     * compare dates in case
     * timestamps differ slightly.
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
     * Create tooltip once.
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
     * Group days into weeks.
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
     * Render each week.
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
                                weekday:
                                    "short",

                                month:
                                    "short",

                                day:
                                    "numeric",

                                year:
                                    "numeric"
                            }
                        );


                    cell.dataset.count =
                        day.count;

                    cell.dataset.date =
                        formattedDate;


                    cell.addEventListener(
                        "mouseenter",
                        (event) => {

                            const submissionText =
                                day.count === 1
                                    ? "submission"
                                    : "submissions";


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
             * Month labels.
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


    label.style.left =
        `${weekIndex * 18}px`;


    months.appendChild(
        label
    );

}


/* ======================================================
   CALCULATE CURRENT STREAK
====================================================== */

function calculateCurrentStreak(
    activity
) {

    let streak = 0;


    for (
        let i = activity.length - 1;
        i >= 0;
        i--
    ) {

        if (
            activity[i].count > 0
        ) {

            streak++;

        }
        else {

            /*
             * If today has no activity,
             * don't immediately break.
             */

            if (
                i === activity.length - 1
            ) {

                continue;

            }

            break;

        }

    }


    return streak;
}


/* ======================================================
   START LEETCODE
====================================================== */

loadLeetCodeActivity();
```
