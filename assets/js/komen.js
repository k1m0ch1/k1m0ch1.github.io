/* komen — blog comment widget.
 *
 * Security notes for this file:
 *   - every value coming from the API is written with textContent (or set as
 *     an attribute after validation), never with innerHTML, so a comment
 *     containing markup is displayed as literal text,
 *   - href attributes are only ever built by the widget itself from a URL the
 *     server already validated as an x.com permalink,
 *   - the honeypot + elapsed-time fields piggyback on the POST so trivial
 *     bots get filtered server-side.
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

  // Only trust a URL we could have produced ourselves.
  function safeTweetUrl(url) {
    if (typeof url !== "string") return null;
    if (!/^https:\/\/x\.com\/[A-Za-z0-9_]{1,20}\/status\/\d{5,25}$/.test(url)) return null;
    return url;
  }

  function render(comment) {
    var wrap = document.createElement("div");
    wrap.className = "komen-comment" +
      (comment.is_author ? " is-author" : "") +
      (comment.parent_id ? " is-reply" : "");

    var meta = document.createElement("div");
    meta.className = "komen-meta";

    var name = document.createElement("span");
    name.className = "komen-name";
    name.textContent = comment.name || "anonymous";
    meta.appendChild(name);

    if (comment.is_author) {
      var badge = document.createElement("span");
      badge.className = "komen-badge";
      badge.textContent = "author";
      meta.appendChild(badge);
    }

    var when = document.createElement("span");
    when.textContent = " · " + timeAgo(comment.created_at);
    meta.appendChild(when);

    wrap.appendChild(meta);

    var text = document.createElement("p");
    text.className = "komen-text";
    text.textContent = comment.body; // ← the whole XSS story
    wrap.appendChild(text);

    var tweet = safeTweetUrl(comment.quote_tweet_url);
    if (tweet) {
      var link = document.createElement("a");
      link.className = "komen-onx";
      link.href = tweet;
      link.target = "_blank";
      link.rel = "noopener noreferrer nofollow";
      link.textContent = "replied on X ↗";
      wrap.appendChild(link);
    }

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
      .then(function (data) { draw(data.comments || []); })
      .catch(function () {
        listEl.textContent = "";
        listEl.appendChild(note("Comments are unavailable right now."));
      });
  }

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
        status(err.message === "rate_limited" || /slow down/i.test(err.message)
          ? "you are commenting too fast — try again in a moment"
          : "could not post: " + err.message, true);
      })
      .finally(function () { submitEl.disabled = false; });
  });

  load();
})();
