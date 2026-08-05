"use strict";

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
