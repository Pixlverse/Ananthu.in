// ananthu.in — redesign interactions (no dependencies)
(function () {
  // ---------- mobile menu ----------
  var menuBtn = document.querySelector('.menu-btn');
  var mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    function setMenu(open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mobileNav.classList.toggle('is-open', open);
    }
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  // ---------- the observer: sit in a chair, look from the other ----------
  var wheel = document.querySelector('.wheel');
  var grid = document.querySelector('.chair-grid');
  if (wheel && grid) {
    var PTS = [[320,70],[481,129],[566,277],[537,445],[406,555],[234,555],[103,445],[74,277],[159,129]];
    var COLS = ['#0E9AA7','#F4B22D','#F45D5D','#8E78C7','#92B67E','#0E9AA7','#F4B22D','#F45D5D','#8E78C7'];
    var R = [
      ['Founder', 'Customer', 'I think about how the customer actually experiences the business.'],
      ['Employer', 'Employee', 'I think about how a decision is experienced by an employee.'],
      ['Manager', 'Employee', 'I think about how a decision lands with the people who have to live with it.'],
      ['Employee', 'Employer', 'I think about what the employer is actually trying to achieve.'],
      ['Recruiter', 'Candidate', 'I think about what the candidate is experiencing.'],
      ['Consultant', 'Founder', 'I think about what the founder may have stopped seeing — and why.'],
      ['Freelancer', 'Founder', 'I think about what the client actually needed, not just what the brief said.'],
      ['Candidate', 'Recruiter', 'I think about what the recruiter or employer is actually seeing.'],
      ['Customer', 'Founder', 'I notice what the business itself may have stopped noticing.']
    ];
    var idx = function (n) { for (var i = 0; i < R.length; i++) if (R[i][0] === n) return i; return -1; };
    var sel = null;

    var link = wheel.querySelector('.wheel__link');
    var halo = wheel.querySelector('.wheel__halo');
    var idle = document.querySelector('.readout__idle');
    var picked = document.querySelector('.readout__sel');
    var sName = document.querySelector('[data-sname]');
    var pName = document.querySelector('[data-pname]');
    var sLine = document.querySelector('[data-sline]');
    var swap = document.querySelector('[data-swap]');

    function makeBtn(i, onWheel) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chair';
      b.textContent = R[i][0];
      b.style.setProperty('--c', COLS[i]);
      if (onWheel) { b.style.left = PTS[i][0] + 'px'; b.style.top = PTS[i][1] + 'px'; }
      b.addEventListener('click', function () { render(sel === i ? null : i); });
      return b;
    }
    var wheelBtns = R.map(function (_, i) { var b = makeBtn(i, true); wheel.appendChild(b); return b; });
    var gridBtns = R.map(function (_, i) { var b = makeBtn(i, false); grid.appendChild(b); return b; });

    function render(next) {
      sel = next;
      var pair = sel === null ? null : idx(R[sel][1]);
      [wheelBtns, gridBtns].forEach(function (set) {
        set.forEach(function (b, i) {
          b.classList.toggle('is-on', sel === i);
          b.classList.toggle('is-pair', pair === i && sel !== i);
          b.setAttribute('aria-pressed', String(sel === i));
        });
      });
      idle.hidden = sel !== null;
      picked.hidden = sel === null;
      link.style.display = halo.style.display = sel === null ? 'none' : '';
      if (sel === null) return;
      sName.textContent = R[sel][0];
      sName.style.background = COLS[sel];
      pName.textContent = R[sel][1];
      sLine.textContent = R[sel][2];
      link.setAttribute('x1', PTS[sel][0]); link.setAttribute('y1', PTS[sel][1]);
      link.setAttribute('x2', PTS[pair][0]); link.setAttribute('y2', PTS[pair][1]);
      link.setAttribute('stroke', COLS[sel]);
      halo.setAttribute('cx', PTS[sel][0]); halo.setAttribute('cy', PTS[sel][1]);
      halo.setAttribute('stroke', COLS[sel]);
    }
    swap.addEventListener('click', function () {
      if (sel !== null) render(idx(R[sel][1]));
    });
    render(null);
  }

  // ---------- blog filter ----------
  var filters = document.querySelectorAll('.filter');
  if (filters.length) {
    var rows = document.querySelectorAll('.row[data-cat]');
    var empty = document.querySelector('.empty');
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        var cat = f.dataset.cat;
        filters.forEach(function (o) {
          var on = o === f;
          o.classList.toggle('is-on', on);
          o.setAttribute('aria-pressed', String(on));
        });
        var shown = 0;
        rows.forEach(function (r) {
          var show = cat === 'All' || r.dataset.cat === cat;
          r.hidden = !show;
          if (show) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  // ---------- gentle reveal on scroll ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
