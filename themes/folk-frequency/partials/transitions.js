(function () {
  function q(root, selector) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function reveal(tl, targets, fromVars, toVars, at) {
    if (!targets.length) return;
    gsap.set(targets, Object.assign({ opacity: 0 }, fromVars));
    tl.to(targets, Object.assign({ opacity: 1, duration: 0.42, ease: "power3.out" }, toVars), at);
  }

  function folkSequence(tl, root, selector, at, config) {
    const start = at || 0;
    const main = q(root, selector || config?.main || ".ff-card");
    const title = q(root, config?.title || ".ff-eyebrow, .ff-title, .ff-subtitle");
    const items = q(root, config?.items || ".ff-item, .ff-note, .ff-chip, .ff-step-number, .ff-code-line");
    const deco = q(root, ".ff-deco");

    reveal(tl, title, { y: 18 }, { y: 0, duration: 0.48, stagger: 0.06 }, start + 0.12);
    reveal(tl, main, { y: 30, rotation: -0.6, scale: 0.99 }, { y: 0, rotation: 0, scale: 1, duration: 0.54, stagger: 0.10, ease: "back.out(1.15)" }, start + 0.72);
    reveal(tl, items, { y: 16 }, { y: 0, duration: 0.32, stagger: 0.06 }, start + 1.04);
    reveal(tl, deco, { scale: 0.82, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.34, stagger: 0.06 }, start + 1.22);
  }

  window.FolkFrequencyTransitions = {
    poster_reveal(tl, root, selector, at) {
      folkSequence(tl, root, selector, at);
    },
    stamp_pop(tl, root, selector, at) {
      folkSequence(tl, root, selector, at, { main: ".ff-metric", items: ".ff-chip, .ff-note" });
    },
    paint_wipe(tl, root, selector, at) {
      folkSequence(tl, root, selector, at);
    },
    ornament_bloom(tl, root, selector, at) {
      folkSequence(tl, root, selector, at, { main: ".ff-item" });
    },
    program_step_stamp(tl, root, selector, at) {
      folkSequence(tl, root, selector, at, { main: ".ff-step", items: ".ff-step-number, .ff-note, .ff-chip" });
    },
    handbill_type(tl, root, selector, at) {
      folkSequence(tl, root, selector, at, { main: ".ff-card", items: ".ff-code-line" });
    },
    process_path_reveal(tl, root, selector, at) {
      folkSequence(tl, root, selector, at, { main: ".ff-item" });
    },
    coral_notice_snap(tl, root, selector, at) {
      folkSequence(tl, root, selector, at);
    },
    indigo_quote_focus(tl, root, selector, at) {
      folkSequence(tl, root, selector, at);
    },
    twin_poster_compare(tl, root, selector, at) {
      folkSequence(tl, root, selector, at, { main: ".ff-item" });
    },
    poster_image_reveal(tl, root, selector, at) {
      folkSequence(tl, root, selector, at, { main: ".ff-source-media, .ff-media-copy", items: ".ff-media-caption, .ff-media-meta" });
    },
    festival_cta_settle(tl, root, selector, at) {
      folkSequence(tl, root, selector, at);
    }
  };
})();
