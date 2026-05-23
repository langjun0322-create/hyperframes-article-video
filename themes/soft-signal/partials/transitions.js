(function () {
  function q(root, selector) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function reveal(tl, targets, fromVars, toVars, at) {
    if (!targets.length) return;
    gsap.set(targets, Object.assign({ opacity: 0 }, fromVars));
    tl.to(targets, Object.assign({ opacity: 1, duration: 0.42, ease: "power3.out" }, toVars), at);
  }

  function softSequence(tl, root, at, config) {
    const start = at || 0;
    const title = q(root, config.title || ".ss-title");
    const subtitle = q(root, config.subtitle || ".ss-subtitle, .ss-note");
    const cards = q(root, config.cards || ".ss-card");
    const items = q(root, config.items || ".ss-item, .ss-metric, .ss-code-line, .ss-chip, .ss-item-title");

    reveal(tl, title, { y: 24 }, { y: 0, duration: 0.56, stagger: 0.07 }, start + 0.12);
    reveal(tl, subtitle, { y: 18 }, { y: 0, duration: 0.42, stagger: 0.08 }, start + 0.58);
    reveal(tl, cards, { y: 28, scale: 0.99 }, { y: 0, scale: 1, duration: 0.54, stagger: 0.10 }, start + 1.04);
    reveal(tl, items, { y: 16 }, { y: 0, duration: 0.32, stagger: 0.06 }, start + 1.34);
  }

  window.SoftSignalTransitions = {
    warm_paper_reveal(tl, root, at) {
      softSequence(tl, root, at, {});
    },
    soft_evidence_rise(tl, root, at) {
      softSequence(tl, root, at, {});
    },
    botanical_notes_unfold(tl, root, at) {
      softSequence(tl, root, at, {});
    },
    gentle_checklist_draw(tl, root, at) {
      softSequence(tl, root, at, { cards: ".ss-card", items: ".ss-item, .ss-item-title" });
    },
    soft_number_bloom(tl, root, at) {
      softSequence(tl, root, at, { cards: ".ss-card", items: ".ss-metric" });
    },
    paper_console_type(tl, root, at) {
      softSequence(tl, root, at, { cards: ".ss-card", items: ".ss-code-line" });
    },
    soft_blocks_flow(tl, root, at) {
      softSequence(tl, root, at, {});
    },
    gentle_note_focus(tl, root, at) {
      softSequence(tl, root, at, {});
    },
    editorial_arch_focus(tl, root, at) {
      softSequence(tl, root, at, {});
    },
    soft_grid_compare(tl, root, at) {
      softSequence(tl, root, at, { cards: ".ss-grid > *", items: ".ss-item, .ss-chip" });
    },
    soft_image_reveal(tl, root, at) {
      softSequence(tl, root, at, { cards: ".ss-source-media, .ss-media-copy", items: ".ss-media-caption, .ss-media-meta" });
    },
    warm_cta_settle(tl, root, at) {
      softSequence(tl, root, at, {});
    }
  };
})();
