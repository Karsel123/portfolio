(function(){
  "use strict";

  /* ---------- CV download ---------- */
  var cvUrl = "https://docs.google.com/document/d/1V8jrC7ImblOl_HTVI7dwFn1uhzrEpahD/export?format=pdf";
  document.querySelectorAll('[data-cv-link]').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      fetch(cvUrl, {mode:'cors'})
        .then(function(res){
          if(!res.ok) throw new Error('bad response');
          return res.blob();
        })
        .then(function(blob){
          var blobUrl = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'Karsel_Dawa_CV.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function(){ URL.revokeObjectURL(blobUrl); }, 4000);
        })
        .catch(function(){
          /* Cross-origin fetch blocked (common on mobile browsers).
             Try a direct download-attribute click first — some mobile
             browsers (e.g. Chrome/Android) still honor the suggested
             filename this way even without a blob. If that silently
             does nothing, the browser will just open the file. */
          var a = document.createElement('a');
          a.href = cvUrl;
          a.download = 'Karsel_Dawa_CV.pdf';
          a.target = '_blank';
          a.rel = 'noopener';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    });
  });

  /* ---------- year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  var sunPath = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>';
  var moonPath = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

  function applyTheme(t){
    root.setAttribute('data-theme', t);
    themeIcon.innerHTML = t === 'dark' ? sunPath : moonPath;
    try{ localStorage.setItem('kd-theme', t); }catch(e){}
  }
  var savedTheme = 'dark';
  try{ savedTheme = localStorage.getItem('kd-theme') || 'dark'; }catch(e){}
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', function(){
    var current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- nav scroll state ---------- */
  var nav = document.getElementById('nav');
  function onScroll(){
    if(window.scrollY > 40){ nav.classList.add('scrolled'); }
    else{ nav.classList.remove('scrolled'); }
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuOpen = false;

  function setMenu(open){
    menuOpen = open;
    mobileMenu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    var l1 = burger.querySelector('.l1'), l2 = burger.querySelector('.l2'), l3 = burger.querySelector('.l3');
    if(open){
      l1.style.transform = 'translateY(6px) rotate(45deg)';
      l2.style.opacity = '0';
      l3.style.transform = 'translateY(-6px) rotate(-45deg)';
    } else {
      l1.style.transform = ''; l2.style.opacity = ''; l3.style.transform = '';
    }
  }

  burger.addEventListener('click', function(){ setMenu(!menuOpen); });
  mobileMenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setMenu(false); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && menuOpen){ setMenu(false); }
  });
  window.addEventListener('resize', function(){
    if(window.innerWidth > 860 && menuOpen){ setMenu(false); }
  });

  /* ---------- hero role typewriter (always letter-by-letter) ---------- */
  var roleEl = document.getElementById('heroRoleText');
  var roles = ["Software Developer", "SCRUM Master", "LLM Research Intern"];

  if(roleEl){
    var rIndex = 0, charIndex = 0, deleting = false;

    function typeTick(){
      var current = roles[rIndex];
      if(!deleting){
        charIndex++;
        roleEl.textContent = current.slice(0, charIndex);
        if(charIndex === current.length){
          deleting = true;
          setTimeout(typeTick, 1600);
          return;
        }
        setTimeout(typeTick, 55);
      } else {
        charIndex--;
        roleEl.textContent = current.slice(0, charIndex);
        if(charIndex === 0){
          deleting = false;
          rIndex = (rIndex + 1) % roles.length;
          setTimeout(typeTick, 300);
          return;
        }
        setTimeout(typeTick, 30);
      }
    }
    setTimeout(function(){
      charIndex = 0;
      typeTick();
    }, 950);
  }

  /* ---------- hero name staggered reveal ---------- */
  var heroName = document.getElementById('heroName');
  var fullName = "Karsel Dawa";
  var words = fullName.split(' ');
  var globalIndex = 0;
  words.forEach(function(word, wi){
    var wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    word.split('').forEach(function(ch){
      var letterSpan = document.createElement('span');
      letterSpan.className = 'letter';
      letterSpan.style.animationDelay = (0.15 + globalIndex * 0.045) + 's';
      letterSpan.textContent = ch;
      wordSpan.appendChild(letterSpan);
      globalIndex++;
    });
    heroName.appendChild(wordSpan);
  });

  /* ---------- generic scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  /* stagger children delay for reveal-stagger */
  document.querySelectorAll('.reveal-stagger').forEach(function(group){
    Array.prototype.forEach.call(group.children, function(child, i){
      child.style.transitionDelay = (i * 0.06) + 's';
    });
  });

  /* ---------- timeline progress + item reveal ---------- */
  var tlItems = document.querySelectorAll('.tl-item');
  var tlProgress = document.getElementById('tlProgress');
  var timelineEl = document.getElementById('timeline');

  var tlObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in'); }
    });
  }, {threshold:0.4});
  tlItems.forEach(function(item){ tlObserver.observe(item); });

  function updateTimelineProgress(){
    if(!timelineEl) return;
    var rect = timelineEl.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = rect.top;
    var total = rect.height;
    var visible = Math.min(Math.max(vh * 0.75 - start, 0), total);
    var pct = total > 0 ? (visible / total) * 100 : 0;
    tlProgress.style.height = pct + '%';
  }
  document.addEventListener('scroll', updateTimelineProgress, {passive:true});
  window.addEventListener('resize', updateTimelineProgress);
  updateTimelineProgress();

  /* ---------- skill chip in-view (subtle indicator fill) ---------- */
  var skillChips = document.querySelectorAll('.skill-chip');
  skillChips.forEach(function(chip, i){
    chip.style.setProperty('--w', (60 + (i % 5) * 8) + '%');
  });
  var chipObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        chipObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.3});
  skillChips.forEach(function(chip){ chipObserver.observe(chip); });

  /* ---------- active nav link highlight ---------- */
  var sections = document.querySelectorAll('section[id], header[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  var navObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function(link){
          link.style.color = (link.getAttribute('href') === '#' + id) ? 'var(--text)' : '';
        });
      }
    });
  }, {threshold:0.5});
  sections.forEach(function(s){ navObserver.observe(s); });

})();
