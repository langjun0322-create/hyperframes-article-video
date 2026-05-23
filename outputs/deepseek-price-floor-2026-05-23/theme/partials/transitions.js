(function () {
  function q(root, selector) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function reveal(tl, targets, fromVars, toVars, at) {
    if (!targets.length) return;
    gsap.set(targets, Object.assign({ opacity: 0 }, fromVars));
    tl.to(targets, Object.assign({ opacity: 1, duration: 0.42, ease: "power3.out" }, toVars), at);
  }

  function articleSequence(tl, root, at, config) {
    const start = at || 0;
    const title = q(root, config.title || ".ts-title, .hook-title-block, .points-head, .summary-claim");
    const subtitle = q(root, config.subtitle || ".ts-subtitle, .release-chip, .proof-box");
    const cards = q(root, config.cards || ".ts-card, .point-card, .quote-frame, .compare-left, .compare-right");
    const items = q(root, config.items || ".ts-item, .ts-metric, .ts-code-line, .step-node, .layer-tower span");
    const accents = q(root, config.accents || ".planet-arc, .step-link, .compare-vs, .quote-mark, .quote-copy");

    reveal(tl, title, { y: 28 }, { y: 0, duration: 0.58, stagger: 0.07 }, start + 0.12);
    reveal(tl, subtitle, { y: 18 }, { y: 0, duration: 0.42, stagger: 0.08 }, start + 0.62);
    reveal(tl, accents, { y: 18, scale: 0.92 }, { y: 0, scale: 1, duration: 0.46, stagger: 0.07 }, start + 0.94);
    reveal(tl, cards, { y: 30, scale: 0.985 }, { y: 0, scale: 1, duration: 0.52, stagger: 0.10 }, start + 1.22);
    reveal(tl, items, { y: 18 }, { y: 0, duration: 0.34, stagger: 0.06 }, start + 1.56);
  }

  window.TechSignalTransitions = {
    orbital_thesis_reveal(tl, root, at) {
      articleSequence(tl, root, at, {
        title: ".hook-title-block",
        subtitle: ".release-chip",
        accents: ".planet-arc",
        cards: ".ts-card",
        items: ".ts-item, .ts-metric"
      });
    },
    evidence_ladder_reveal(tl, root, at) {
      articleSequence(tl, root, at, {
        title: ".summary-claim",
        cards: ".proof-box",
        items: ".ts-item, .ts-metric"
      });
    },
    layered_points_stack(tl, root, at) {
      articleSequence(tl, root, at, {
        title: ".points-head",
        cards: ".point-card",
        items: ".layer-tower span, .ts-item"
      });
    },
    timeline_nodes_draw(tl, root, at) {
      articleSequence(tl, root, at, {
        cards: ".step-node",
        accents: ".step-link",
        items: ".ts-item"
      });
    },
    quote_frame_focus(tl, root, at) {
      articleSequence(tl, root, at, {
        cards: ".quote-frame",
        items: ".quote-mark, .quote-copy"
      });
    },
    comparison_split_reveal(tl, root, at) {
      articleSequence(tl, root, at, {
        cards: ".compare-left, .compare-right",
        accents: ".compare-vs",
        items: ".ts-item"
      });
    },
    hud_aperture_open(tl, root, at) {
      articleSequence(tl, root, at, {});
    },
    data_sweep_reveal(tl, root, at) {
      articleSequence(tl, root, at, {});
    },
    interface_stack_slide(tl, root, at) {
      articleSequence(tl, root, at, {});
    },
    blueprint_draw_on(tl, root, at) {
      articleSequence(tl, root, at, {});
    },
    metric_counter_pulse(tl, root, at) {
      articleSequence(tl, root, at, {
        cards: ".ts-card",
        items: ".ts-metric"
      });
    },
    terminal_parse_in(tl, root, at) {
      articleSequence(tl, root, at, {
        cards: ".ts-card",
        items: ".ts-code-line"
      });
    },
    neural_node_morph(tl, root, at) {
      articleSequence(tl, root, at, {
        items: ".ts-item"
      });
    },
    system_alert_shift(tl, root, at) {
      articleSequence(tl, root, at, {});
    },
    source_image_reveal(tl, root, at) {
      articleSequence(tl, root, at, {
        cards: ".ts-source-media, .ts-media-copy",
        items: ".ts-media-caption, .ts-media-meta"
      });
    },
    glass_panel_focus(tl, root, at) {
      articleSequence(tl, root, at, {});
    }
  };
})();
