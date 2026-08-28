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
   LEETCODE HEATMAP
====================================================== */

function loadLeetCodeActivity() {

    const heatmap =
        document.getElementById("leetcodeHeatmap");

    const months =
        document.getElementById("heatmapMonths");

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
        console.error("leetcodeHeatmap element not found.");
        return;
    }


    if (totalText) {
        totalText.textContent = "Loading activity...";
    }


    fetch(LEETCODE_API, {
        method: "GET",
        cache: "no-store"
    })

    .then((response) => {

        if (!response.ok) {
            throw new Error(
                `LeetCode API returned ${response.status}`
            );
        }

        return response.json();
    })

    .then((data) => {

        console.log("LeetCode API:", data);


        /* ==============================================
           GET SUBMISSION CALENDAR
        ============================================== */

        let calendar = null;


        if (typeof data.submissionCalendar === "string") {

            calendar = JSON.parse(
                data.submissionCalendar
            );

        }

        else if (
            data.submissionCalendar &&
            typeof data.submissionCalendar === "object"
        ) {

            calendar = data.submissionCalendar;

        }

        else if (
            data.data &&
            data.data.submissionCalendar
        ) {

            if (
                typeof data.data.submissionCalendar === "string"
            ) {

                calendar = JSON.parse(
                    data.data.submissionCalendar
                );

            } else {

                calendar =
                    data.data.submissionCalendar;
            }
        }


        if (!calendar) {

            throw new Error(
                "submissionCalendar not found."
            );
        }


        console.log(
            "Parsed calendar:",
            calendar
        );


        /* ==============================================
           CREATE LAST 365 DAYS
        ============================================== */

        const today = new Date();

        today.setHours(
            23,
            59,
            59,
            999
        );


        const startDate = new Date(today);

        startDate.setDate(
            startDate.getDate() - 364
        );


        /* ==============================================
           FIND COUNT FOR DATE
        ============================================== */

        function getCountForDate(date) {

            const year = date.getFullYear();
            const month =
                String(date.getMonth() + 1).padStart(2, "0");
            const day =
                String(date.getDate()).padStart(2, "0");

            const dateString =
                `${year}-${month}-${day}`;


            for (const timestamp in calendar) {

                const timestampDate =
                    new Date(
                        Number(timestamp) * 1000
                    );


                const tYear =
                    timestampDate.getUTCFullYear();

                const tMonth =
                    String(
                        timestampDate.getUTCMonth() + 1
                    ).padStart(2, "0");

                const tDay =
                    String(
                        timestampDate.getUTCDate()
                    ).padStart(2, "0");


                const apiDate =
                    `${tYear}-${tMonth}-${tDay}`;


                if (apiDate === dateString) {

                    return Number(
                        calendar[timestamp]
                    ) || 0;
                }
            }


            return 0;
        }


        /* ==============================================
           CREATE ACTIVITY ARRAY
        ============================================== */

        const activity = [];

        const currentDate =
            new Date(startDate);


        while (currentDate <= today) {

            const date =
                new Date(currentDate);


            activity.push({
                date: date,
                count: getCountForDate(date)
            });


            currentDate.setDate(
                currentDate.getDate() + 1
            );
        }


        console.log(
            "Activity generated:",
            activity
        );


        /* ==============================================
           CLEAR OLD HEATMAP
        ============================================== */

        heatmap.innerHTML = "";


        if (months) {
            months.innerHTML = "";
        }


        /* ==============================================
           CREATE TOOLTIP
        ============================================== */

        let tooltip =
            document.querySelector(".heat-tooltip");


        if (!tooltip) {

            tooltip =
                document.createElement("div");

            tooltip.className =
                "heat-tooltip";

            document.body.appendChild(
                tooltip
            );
        }


        /* ==============================================
           ACTIVITY LEVEL
        ============================================== */

        function getLevel(count) {

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


        /* ==============================================
           START HEATMAP ON SUNDAY
        ============================================== */

        const firstDate =
            activity[0].date;

        const firstDay =
            firstDate.getDay();


        for (let i = 0; i < firstDay; i++) {

            const emptyCell =
                document.createElement("div");

            emptyCell.className =
                "heat-cell heat-empty";

            heatmap.appendChild(
                emptyCell
            );
        }


        /* ==============================================
           RENDER CELLS
        ============================================== */

        activity.forEach((day) => {

            const cell =
                document.createElement("div");


            const level =
                getLevel(day.count);


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
                "title",
                `${formattedDate}: ${day.count} ${submissionText}`
            );


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


            heatmap.appendChild(
                cell
            );

        });


        /* ==============================================
           MONTH LABELS
        ============================================== */

        if (months) {

            let previousMonth = -1;

            activity.forEach(
                (day, index) => {

                    const month =
                        day.date.getMonth();


                    if (
                        month !== previousMonth &&
                        day.date.getDate() <= 7
                    ) {

                        const label =
                            document.createElement("span");


                        label.className =
                            "heatmap-month";


                        label.textContent =
                            day.date.toLocaleDateString(
                                "en-US",
                                {
                                    month: "short"
                                }
                            );


                        const week =
                            Math.floor(
                                (index + firstDay) / 7
                            );


                        label.style.left =
                            `${week * 18}px`;


                        months.appendChild(
                            label
                        );


                        previousMonth =
                            month;
                    }

                }
            );
        }


        /* ==============================================
           STATISTICS
        ============================================== */

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


        /* ==============================================
           CURRENT STREAK
        ============================================== */

        let streak = 0;


        for (
            let i = activity.length - 1;
            i >= 0;
            i--
        ) {

            if (
                activity[i].date > new Date()
            ) {
                continue;
            }


            if (
                activity[i].count > 0
            ) {

                streak++;

            } else {

                break;
            }
        }


        /* ==============================================
           UPDATE STATISTICS
        ============================================== */

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

    })

    .catch((error) => {

        console.error(
            "LeetCode heatmap error:",
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

    });
}


/* ======================================================
   TOOLTIP POSITION
====================================================== */

function moveHeatmapTooltip(
    event,
    tooltip
) {

    tooltip.style.left =
        `${event.clientX + 12}px`;

    tooltip.style.top =
        `${event.clientY - 35}px`;
}


/* ======================================================
   START
====================================================== */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadLeetCodeActivity
    );

} else {

    loadLeetCodeActivity();
}
