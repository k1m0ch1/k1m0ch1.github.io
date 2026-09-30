/* komen — blog comment widget.
 *
 * Flow
 * ----
 *  • reads the thread from the komen API — the site's own database, so a page
 *    view never spends a request against the metered X read provider,
 *  • every comment gets a "Reply on X" button that opens X with one pre-filled
 *    tweet containing that comment's deep link
 *    (`https://yggdrasil.id/<post>/?comment=<id>`); the click also tells the API
 *    to look for the reply in ~3 minutes,
 *  • the page itself never triggers an import — that is the click's job, and the
 *    scheduler's,
 *  • visiting `…?comment=<id>` scrolls to and highlights that comment,
 *  • replies written on X are pulled in by `komen --sync-all` on a timer, and
 *    show up here on the next load.
 *
 * Security notes for this file:
 *   - every value coming from the API is written with textContent (or set as an
 *     attribute after validation), never with innerHTML, so a comment
 *     containing markup is displayed as literal text,
 *   - href attributes are only ever built by the widget itself: X links must
 *     match a strict pattern, and composer URLs are assembled from the API's
 *     own deep-link base.
 */
(function () {
  "use strict";

  var root = document.getElementById("comments");
  if (!root || !root.classList.contains("komen")) return;

  var API = (root.getAttribute("data-api") || "").replace(/\/+$/, "");
  var POST = root.getAttribute("data-post") || "";
  var listEl = document.getElementById("komen-list");
  var countEl = document.getElementById("komen-count");
  var form = document.getElementById("komen-form");
  var bodyEl = document.getElementById("komen-body");
  var hpEl = document.getElementById("komen-website");
  var submitEl = document.getElementById("komen-submit");
  var statusEl = document.getElementById("komen-status");
  var loadedAt = Date.now();

  // Filled in from the API's reply payload.
  var deepLinkBase = null;

  if (!API) {
    listEl.textContent = "";
    listEl.appendChild(note("Comments are not configured for this site."));
    if (form) form.style.display = "none";
    return;
  }

  // --- helpers -------------------------------------------------------------

  function note(text) {
    var p = document.createElement("p");
    p.className = "komen-note";
    p.textContent = text;
    return p;
  }

  function status(text, isError) {
    if (!statusEl) return;
    statusEl.textContent = text || "";
    statusEl.className = "komen-status" + (isError ? " is-error" : "");
  }

  function timeAgo(seconds) {
    var diff = Math.floor(Date.now() / 1000) - seconds;
    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + " min ago";
    if (diff < 86400) return Math.floor(diff / 3600) + " h ago";
    if (diff < 2592000) return Math.floor(diff / 86400) + " d ago";
    return new Date(seconds * 1000).toLocaleDateString();
  }

  /// Only trust an X URL we could have produced ourselves.
  function safeXUrl(url) {
    if (typeof url !== "string") return null;
    if (!/^https:\/\/x\.com\/(i\/status|[A-Za-z0-9_]{1,15}\/status)\/\d{5,25}$/.test(url)) return null;
    return url;
  }

  /// Comment id from `?comment=<id>`, or null.
  function commentIdFromLocation() {
    var m = /(?:^|[?&])comment=(\d+)/.exec(window.location.search);
    return m ? parseInt(m[1], 10) : null;
  }

  /// X composer link holding one pre-filled tweet: this comment's deep link.
  ///
  /// Deliberately *not* a reply to the announcement tweet — that made X open a
  /// thread (the parent post plus the new one) when all we want is a single
  /// post carrying the link.
  function replyIntentUrl(commentId) {
    if (!deepLinkBase) return null;
    return "https://x.com/intent/post?text=" +
      encodeURIComponent(deepLinkBase + commentId);
  }

  /// Tell the API that somebody is on their way to reply, so it can ask X again
  /// in a few minutes. Deliberately fired from the *click*, never from a page
  /// load: it is a hint that costs nothing, and the page itself stays free.
  function hintUpcomingReply() {
    try {
      fetch(API + "/api/reply-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: POST }),
        keepalive: true
      }).catch(function () { /* best effort, nothing depends on it */ });
    } catch (e) { /* old browser: the daily sweep still catches it */ }
  }

  function openIntent(url) {
    hintUpcomingReply();
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // --- rendering -----------------------------------------------------------

  function render(comment) {
    var wrap = document.createElement("div");
    wrap.className = "komen-comment" +
      (comment.is_author ? " is-author" : "") +
      (comment.parent_id ? " is-reply" : "") +
      (comment.source === "x" ? " is-x" : "");
    wrap.setAttribute("data-comment-id", String(comment.id));
    wrap.id = "komen-c-" + comment.id;

    var meta = document.createElement("div");
    meta.className = "komen-meta";

    var xUrl = safeXUrl(comment.x_url);
    var name = document.createElement("span");
    name.className = "komen-name";

    if (comment.source === "x" && comment.x_username) {
      // Link the handle to the real X profile: the widget builds this URL, and
      // the handle has already been validated by the API.
      if (/^[A-Za-z0-9_]{1,15}$/.test(comment.x_username)) {
        var profile = document.createElement("a");
        profile.href = "https://x.com/" + comment.x_username;
        profile.target = "_blank";
        profile.rel = "noopener noreferrer nofollow";
        profile.textContent = "@" + comment.x_username;
        name.appendChild(profile);
      } else {
        name.textContent = "@" + comment.x_username;
      }
    } else {
      name.textContent = comment.name || "anonymous";
    }
    meta.appendChild(name);

    if (comment.is_author) {
      var badge = document.createElement("span");
      badge.className = "komen-badge";
      badge.textContent = "author";
      meta.appendChild(badge);
    }
    if (comment.source === "x") {
      var via = document.createElement("span");
      via.className = "komen-badge is-x";
      via.textContent = "via X";
      meta.appendChild(via);
    }

    var when = document.createElement("span");
    when.textContent = " · " + timeAgo(comment.created_at);
    meta.appendChild(when);

    wrap.appendChild(meta);

    if (comment.body) {
      var text = document.createElement("p");
      text.className = "komen-text";
      text.textContent = comment.body; // ← the whole XSS story
      wrap.appendChild(text);
    }

    var actions = document.createElement("div");
    actions.className = "komen-actions-row";

    var intent = replyIntentUrl(comment.id);
    if (intent) {
      var reply = document.createElement("button");
      reply.type = "button";
      reply.className = "komen-reply";
      reply.textContent = "Reply on X";
      reply.title = "Open X and reply with a link back to this comment";
      reply.addEventListener("click", function () { openIntent(intent); });
      actions.appendChild(reply);
    }

    if (xUrl) {
      var link = document.createElement("a");
      link.className = "komen-onx";
      link.href = xUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer nofollow";
      link.textContent = "on X ↗";
      actions.appendChild(link);
    }

    if (actions.childNodes.length) wrap.appendChild(actions);
    return wrap;
  }

  function thread(comments) {
    // Top-level comments in order, each followed by its replies.
    var byParent = {};
    comments.forEach(function (c) {
      if (!c.parent_id) return;
      (byParent[c.parent_id] = byParent[c.parent_id] || []).push(c);
    });

    var out = [];
    comments.forEach(function (c) {
      if (c.parent_id) return; // rendered under its parent
      out.push(c);
      (byParent[c.id] || []).forEach(function (r) { out.push(r); });
    });
    // Orphans (parent deleted) still get shown, at the end.
    comments.forEach(function (c) {
      if (c.parent_id && out.indexOf(c) === -1) out.push(c);
    });
    return out;
  }

  function draw(comments) {
    listEl.textContent = "";
    if (!comments.length) {
      listEl.appendChild(note("No comments yet. Be the first."));
    } else {
      thread(comments).forEach(function (c) { listEl.appendChild(render(c)); });
    }
    countEl.textContent = comments.length ? "(" + comments.length + ")" : "";
    scheduleHighlight();
  }

  /// `?comment=12` scrolls to that comment and flashes it.
  ///
  /// Retried a couple of times: the X embeds above the comments grow after
  /// load and push the target down, so a single scroll lands short.
  function highlightFromUrl(attempt) {
    attempt = attempt || 0;
    var id = commentIdFromLocation();
    if (!id) return;
    var target = document.getElementById("komen-c-" + id);
    if (!target) return;

    target.classList.add("is-target");

    var rect = target.getBoundingClientRect();
    var comfortablyVisible = rect.top >= 80 && rect.bottom <= window.innerHeight - 40;
    if (attempt > 0 && comfortablyVisible) return; // do not fight the reader

    var top = rect.top + window.pageYOffset - 90;
    if (attempt === 0) {
      window.scrollTo({ top: top, behavior: "smooth" });
    } else {
      window.scrollTo(0, top); // instant, so late layout shifts still land
    }
  }

  function scheduleHighlight() {
    highlightFromUrl(0);
    setTimeout(function () { highlightFromUrl(1); }, 800);
    setTimeout(function () { highlightFromUrl(2); }, 2200);
  }

  // --- network -------------------------------------------------------------

  function load() {
    fetch(API + "/api/comments?post=" + encodeURIComponent(POST), {
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        deepLinkBase = typeof data.deep_link_base === "string" ? data.deep_link_base : null;
        draw(data.comments || []);
      })
      .catch(function () {
        listEl.textContent = "";
        listEl.appendChild(note("Comments are unavailable right now."));
      });
  }

  // --- posting -------------------------------------------------------------

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var body = bodyEl.value.trim();
    if (!body) return;

    submitEl.disabled = true;
    status("posting…");

    fetch(API + "/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        post: POST,
        body: body,
        website: hpEl ? hpEl.value : "",
        elapsed_ms: Date.now() - loadedAt
      })
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) {
            throw new Error((data.error && data.error.message) || ("HTTP " + res.status));
          }
          return data;
        });
      })
      .then(function () {
        bodyEl.value = "";
        status("thanks!");
        load();
      })
      .catch(function (err) {
        status(/slow down/i.test(err.message)
          ? "you are commenting too fast — try again in a moment"
          : "could not post: " + err.message, true);
      })
      .finally(function () { submitEl.disabled = false; });
  });

  load();
})();
