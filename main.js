(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealEls = document.querySelectorAll('.reveal-on-scroll');
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    var revealIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            revealIo.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.06 }
    );
    revealEls.forEach(function (el) {
      revealIo.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  var navLinks = document.querySelectorAll('.day-nav a[data-day]');
  var dayCards = document.querySelectorAll('.day-card[id^="day-"]');

  function pickActiveDay() {
    var y = window.innerHeight * 0.36;
    var active = null;
    dayCards.forEach(function (card) {
      var r = card.getBoundingClientRect();
      if (r.top <= y && r.bottom >= y) {
        active = card;
      }
    });
    if (!active) {
      var bestTop = -Infinity;
      dayCards.forEach(function (card) {
        var r = card.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight && r.top > bestTop) {
          bestTop = r.top;
          active = card;
        }
      });
    }
    if (active) {
      var num = active.id.replace('day-', '');
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.dataset.day === num);
      });
    }
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        pickActiveDay();
        ticking = false;
      });
      ticking = true;
    }
  }

  if (dayCards.length && navLinks.length) {
    pickActiveDay();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', pickActiveDay, { passive: true });
  }
})();
