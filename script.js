/* ======================================================
   CURSOR GLOW
   ====================================================== */

const cursor = document.querySelector(".cursor-glow");

if (cursor) {

    window.addEventListener("pointermove", (e) => {

        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";

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


document.querySelectorAll(".reveal").forEach((el) => {

    observer.observe(el);

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
   LEETCODE HEATMAP
   ====================================================== */

/*
    This creates a GitHub/LeetCode-style contribution
    heatmap completely with HTML + CSS + JavaScript.

    It does NOT depend on an external image/API.

    52 weeks × 7 days = 364 cells.
*/


const heatmap =
    document.getElementById("leetcodeHeatmap");

const totalElement =
    document.getElementById("leetcodeTotal");


function createLeetCodeHeatmap() {

    if (!heatmap) return;


    heatmap.innerHTML = "";


    /*
        Generate 52 weeks.
    */

    const weeks = 52;

    const daysPerWeek = 7;


    let totalSubmissions = 0;


    /*
        Create a deterministic activity pattern.

        This gives the heatmap a natural-looking
        consistency rather than random changes
        every time the page reloads.
    */

    function activityValue(week, day) {

        /*
            Some weeks are more active.
        */

        let seed =
            Math.sin(
                week * 12.9898 +
                day * 78.233
            ) * 43758.5453;

        seed =
            seed - Math.floor(seed);


        /*
            More activity around certain weeks.
        */

        const consistency =
            Math.sin(week * 0.45) * 0.25 + 0.5;


        const value =
            seed * 0.7 +
            consistency * 0.3;


        /*
            Weekend activity is slightly lower.
        */

        let adjusted = value;

        if (day === 0 || day === 6) {

            adjusted *= 0.65;

        }


        /*
            Convert into heatmap levels.
        */

        if (adjusted < 0.38) {

            return 0;

        } else if (adjusted < 0.58) {

            return 1;

        } else if (adjusted < 0.75) {

            return 2;

        } else if (adjusted < 0.90) {

            return 3;

        } else {

            return 4;

        }

    }


    /*
        Create each cell.
    */

    for (let week = 0; week < weeks; week++) {

        for (let day = 0; day < daysPerWeek; day++) {

            const level =
                activityValue(week, day);


            /*
                Approximate submission count
                for the tooltip.
            */

            let submissions = 0;


            if (level === 1) {
                submissions = 1;
            }

            if (level === 2) {
                submissions = 2 + (week % 2);
            }

            if (level === 3) {
                submissions = 4 + (week % 4);
            }

            if (level === 4) {
                submissions = 7 + (week % 6);
            }


            totalSubmissions += submissions;


            /*
                Create cell.
            */

            const cell =
                document.createElement("div");


            cell.classList.add(
                "heat-cell",
                `level-${level}`
            );


            /*
                Calculate date.

                Start approximately 364 days ago.
            */

            const date =
                new Date();

            date.setDate(
                date.getDate() -
                (363 - (week * 7 + day))
            );


            const formattedDate =
                date.toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }
                );


            /*
                Tooltip data.
            */

            cell.dataset.date =
                formattedDate;

            cell.dataset.submissions =
                submissions;


            /*
                Mouse tooltip.
            */

            cell.addEventListener(
                "mouseenter",
                showHeatmapTooltip
            );


            cell.addEventListener(
                "mousemove",
                moveHeatmapTooltip
            );


            cell.addEventListener(
                "mouseleave",
                hideHeatmapTooltip
            );


            heatmap.appendChild(cell);

        }

    }


    /*
        Update top text.
    */

    if (totalElement) {

        totalElement.textContent =
            `${totalSubmissions} submissions in the last year`;

    }

}


/* ======================================================
   HEATMAP TOOLTIP
   ====================================================== */

let tooltip = null;


function createTooltip() {

    if (tooltip) return tooltip;


    tooltip =
        document.createElement("div");


    tooltip.className =
        "heat-tooltip";


    document.body.appendChild(tooltip);


    return tooltip;

}


function showHeatmapTooltip(e) {

    const cell = e.currentTarget;

    const date =
        cell.dataset.date;

    const submissions =
        cell.dataset.submissions;


    const tip =
        createTooltip();


    let text;


    if (submissions === "0") {

        text =
            `No submissions on ${date}`;

    } else if (submissions === "1") {

        text =
            `1 submission on ${date}`;

    } else {

        text =
            `${submissions} submissions on ${date}`;

    }


    tip.textContent = text;

    tip.style.opacity = "1";


    moveHeatmapTooltip(e);

}


function moveHeatmapTooltip(e) {

    if (!tooltip) return;


    tooltip.style.left =
        (e.clientX + 12) + "px";


    tooltip.style.top =
        (e.clientY - 35) + "px";

}


function hideHeatmapTooltip() {

    if (!tooltip) return;

    tooltip.style.opacity = "0";

}


/* ======================================================
   INITIALIZE HEATMAP
   ====================================================== */

createLeetCodeHeatmap();


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


    if (!modal || !preview) return;


    preview.src =
        imagePath;


    modal.classList.add("active");


    /*
        Prevent page scrolling while
        certificate is open.
    */

    document.body.style.overflow =
        "hidden";

}


function closeCertificate() {

    const modal =
        document.getElementById(
            "certificateModal"
        );


    if (!modal) return;


    modal.classList.remove("active");


    document.body.style.overflow =
        "";

}


/* ======================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ====================================================== */

const certificateModal =
    document.getElementById(
        "certificateModal"
    );


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


/* ======================================================
   ESCAPE KEY
   ====================================================== */

document.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Escape") {

            closeCertificate();

        }

    }
);


/* ======================================================
   SMOOTH NAVIGATION
   ====================================================== */

document.querySelectorAll(
    'a[href^="#"]'
).forEach((link) => {

    link.addEventListener(
        "click",
        function (e) {

            const targetId =
                this.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(
                    targetId
                );


            if (target) {

                e.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

});
