"use strict";

/**
 * Chapter navigation.
 *
 * The contents menu is a <details> element, so it opens, closes, and handles
 * keyboard focus on its own with no JavaScript. Everything below is additive:
 * scroll progress, which chapter you are in, and the small courtesies people
 * expect from a menu — Escape to close, click outside to dismiss.
 */

const header = document.querySelector("[data-header]");
const progressBar = document.querySelector("[data-progress]");
const contents = document.querySelector("[data-contents]");
const positionLabel = document.querySelector("[data-position]");

const chapterLinks = Array.from(
    document.querySelectorAll("[data-chapter-link]"),
);

const chapters = chapterLinks
    .map((link) => ({
        link,
        section: document.querySelector(link.getAttribute("href")),
    }))
    .filter((chapter) => chapter.section);

let activeChapter = -1;

function setActiveChapter(index) {
    if (index === activeChapter) {
        return;
    }

    activeChapter = index;

    chapters.forEach((chapter, i) => {
        if (i === index) {
            chapter.link.setAttribute("aria-current", "true");
        } else {
            chapter.link.removeAttribute("aria-current");
        }
    });

    if (positionLabel) {
        const number = String(index + 1).padStart(2, "0");
        const total = String(chapters.length).padStart(2, "0");
        positionLabel.textContent = `${number} / ${total}`;
    }
}

function syncToScroll() {
    const scrolled = window.scrollY;

    if (header) {
        // Transparent over the hero, solid once the reader has moved on.
        header.toggleAttribute("data-top", scrolled < 80);
    }

    if (progressBar) {
        const scrollable =
            document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? Math.min(scrolled / scrollable, 1) : 0;
        progressBar.style.width = `${(ratio * 100).toFixed(2)}%`;
    }

    // The current chapter is the last one whose top has passed the header.
    let current = 0;

    chapters.forEach((chapter, i) => {
        if (chapter.section.getBoundingClientRect().top <= 120) {
            current = i;
        }
    });

    setActiveChapter(current);
}

if (chapters.length > 0) {
    let queued = false;

    const onScroll = () => {
        if (queued) {
            return;
        }

        queued = true;

        requestAnimationFrame(() => {
            queued = false;
            syncToScroll();
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    syncToScroll();
}

if (contents) {
    // Jumping to a chapter should not leave the menu hanging open behind you.
    contents.addEventListener("click", (event) => {
        if (event.target.closest("[data-chapter-link]")) {
            contents.open = false;
        }
    });

    document.addEventListener("click", (event) => {
        if (contents.open && !contents.contains(event.target)) {
            contents.open = false;
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && contents.open) {
            contents.open = false;
            contents.querySelector("summary")?.focus();
        }
    });
}

/**
 * Live build log.
 *
 * The log in index.html is the source of truth. It renders with JavaScript
 * disabled, offline, and while this repository is still private.
 *
 * If GitHub is reachable, we swap in the live list so the page stays honest
 * as more work ships. If anything goes wrong — rate limit, private repo, no
 * network, unexpected payload — we keep the markup that shipped in the HTML.
 *
 * A log that is slightly stale but true beats an empty one that failed loudly.
 */

const REPO = "JoshuaBallard/built-in-a-day";

const PULLS_ENDPOINT =
    `https://api.github.com/repos/${REPO}/pulls` +
    "?state=closed&per_page=100&sort=updated&direction=desc";

/**
 * Timestamps are pinned to the timezone this was built in rather than the
 * reader's. The claim on the page is "a Wednesday afternoon" — that stops
 * being true if the log re-renders itself into another timezone.
 */
const BUILD_TIMEZONE = "America/New_York";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BUILD_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
});

function buildLogEntry(pull) {
    const item = document.createElement("li");

    const time = document.createElement("p");
    time.className = "log-time";
    time.textContent = timeFormatter.format(new Date(pull.merged_at));

    const body = document.createElement("div");
    body.className = "log-body";

    const title = document.createElement("h3");
    title.textContent = pull.title;

    const branch = document.createElement("p");
    const branchName = document.createElement("code");
    branchName.textContent = pull.head.ref;
    branch.append(branchName);

    body.append(title, branch);

    const meta = document.createElement("p");
    meta.className = "log-meta";

    const link = document.createElement("a");
    link.href = pull.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `#${pull.number}`;
    meta.append(link);

    item.append(time, body, meta);

    return item;
}

async function renderLiveBuildLog() {
    const log = document.querySelector("[data-build-log]");
    const status = document.querySelector("[data-log-status]");
    const prCount = document.querySelector('[data-stat="prs"]');

    if (!log) {
        return;
    }

    const response = await fetch(PULLS_ENDPOINT, {
        headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) {
        throw new Error(`GitHub responded ${response.status}`);
    }

    const merged = (await response.json())
        .filter((pull) => pull.merged_at)
        .sort((a, b) => new Date(a.merged_at) - new Date(b.merged_at));

    // Never trade a good static log for an empty live one.
    if (merged.length === 0) {
        throw new Error("No merged pull requests returned");
    }

    log.replaceChildren(...merged.map(buildLogEntry));

    if (prCount) {
        prCount.textContent = String(merged.length);
    }

    if (status) {
        status.dataset.live = "true";
        status.textContent =
            `Loaded live from the GitHub API just now — ${merged.length} ` +
            "merged pull requests. With JavaScript off, the same log is " +
            "written into the HTML.";
    }
}

renderLiveBuildLog().catch(() => {
    // Intentionally quiet. The static log in the markup is already correct.
});
