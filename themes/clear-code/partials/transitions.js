(function () {
  function q(root, selector) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function durationOf(root) {
    return Math.max(Number(root && root.dataset && root.dataset.duration) || 6, 3);
  }

  function stepDelay(root, count, maxDelay) {
    var d = durationOf(root);
    var available = Math.max(2.4, Math.min(7.2, d * 0.34));
    return Math.min(maxDelay || 1.05, available / Math.max(1, count));
  }

  function fromTo(tl, targets, fromVars, toVars, at) {
    if (!targets || !targets.length) return;
    gsap.set(targets, fromVars);
    tl.fromTo(targets, fromVars, toVars, at);
  }

  function cardInnerTargets(cards) {
    var targets = [];
    cards.forEach(function (card) {
      targets = targets.concat(q(card, ".obs-info-title, .obs-info-text, .obs-list-row, .obs-chip, .obs-number, h2, p, .obs-stat-value, .obs-stat-label, .obs-node-index, .obs-bullet, .obs-cta, .obs-quote, .cc-card-title, .cc-card-text, .cc-chip"));
    });
    return targets;
  }

  function revealCardText(tl, cards, at, cardStagger) {
    cards.forEach(function (card, index) {
      fromTo(tl, cardInnerTargets([card]), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.34, stagger: 0.035, ease: "power3.out", immediateRender: false }, at + index * (cardStagger || 0.18));
    });
  }

  function clearHeroReveal(tl, root, at) {
    var start = at || 0;
    var cards = q(root, ".cc-hero-circle, .cc-hero-card, .cc-hero-orb, .cc-hero-line, .obs-hero-visual, .obs-info-card, .obs-mini-card");
    fromTo(tl, q(root, ".cc-badge, .cc-brand, .obs-badge"), { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.58, stagger: 0.10, ease: "power3.out", immediateRender: false }, start + 0.16);
    fromTo(tl, q(root, ".cc-title"), { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.82, ease: "power3.out", immediateRender: false }, start + 0.58);
    fromTo(tl, q(root, ".cc-kicker, .cc-subtitle"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.70, stagger: 0.18, ease: "power3.out", immediateRender: false }, start + 1.36);
    fromTo(tl, q(root, ".obs-bottom-nav"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.58, ease: "power3.out", immediateRender: false }, start + 2.18);
    var delay = stepDelay(root, cards.length, 1.18);
    fromTo(tl, cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.72, stagger: delay, ease: "power3.out", immediateRender: false }, start + 2.88);
    revealCardText(tl, cards, start + 3.18, delay);
  }

  function cardsRiseIn(tl, root, at) {
    var start = at || 0;
    var cards = q(root, ".cc-card, .cc-panel, .cc-step, .cc-stat, .cc-note-card, .obs-info-card, .obs-mini-card, .obs-stat, .obs-node");
    fromTo(tl, q(root, ".cc-badge, .obs-badge"), { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.52, stagger: 0.08, ease: "power3.out", immediateRender: false }, start + 0.14);
    fromTo(tl, q(root, ".cc-title"), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.76, ease: "power3.out", immediateRender: false }, start + 0.48);
    fromTo(tl, q(root, ".cc-kicker, .cc-subtitle"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.66, stagger: 0.12, ease: "power3.out", immediateRender: false }, start + 1.20);
    fromTo(tl, q(root, ".obs-bottom-nav"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.54, ease: "power3.out", immediateRender: false }, start + 1.96);
    var delay = stepDelay(root, cards.length, 1.14);
    fromTo(tl, cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.70, stagger: delay, ease: "power3.out", immediateRender: false }, start + 2.62);
    revealCardText(tl, cards, start + 2.92, delay);
  }

  function workflowSequence(tl, root, at) {
    var start = at || 0;
    var steps = q(root, ".cc-step, .obs-step");
    fromTo(tl, q(root, ".cc-badge, .obs-badge"), { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.52, stagger: 0.08, ease: "power3.out", immediateRender: false }, start + 0.14);
    fromTo(tl, q(root, ".cc-title"), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.76, ease: "power3.out", immediateRender: false }, start + 0.48);
    fromTo(tl, q(root, ".cc-kicker, .cc-subtitle"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.66, stagger: 0.12, ease: "power3.out", immediateRender: false }, start + 1.20);
    fromTo(tl, q(root, ".obs-bottom-nav"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.54, ease: "power3.out", immediateRender: false }, start + 1.96);
    var delay = stepDelay(root, steps.length, 1.18);
    fromTo(tl, steps, { opacity: 0, x: -26 }, { opacity: 1, x: 0, duration: 0.68, stagger: delay, ease: "power3.out", immediateRender: false }, start + 2.62);
    revealCardText(tl, steps, start + 2.92, delay);
  }

  function diagramConnect(tl, root, at) {
    var start = at || 0;
    fromTo(tl, q(root, ".cc-hero-line, .cc-orbit-lines"), { opacity: 0, scaleX: 0.72 }, { opacity: 1, scaleX: 1, transformOrigin: "left center", duration: 0.70, ease: "power3.out", immediateRender: false }, start + 1.10);
    cardsRiseIn(tl, root, start);
  }

  window.clearCodeTransitions = {
    clear_hero_reveal: clearHeroReveal,
    cards_rise_in: cardsRiseIn,
    panels_step_in: cardsRiseIn,
    workflow_sequence: workflowSequence,
    stats_count_in: cardsRiseIn,
    note_console_reveal: cardsRiseIn,
    diagram_connect: diagramConnect,
    focus_note_pop: cardsRiseIn,
    quote_slide_focus: cardsRiseIn,
    two_column_compare: cardsRiseIn,
    cta_settle: cardsRiseIn
  };
})();
