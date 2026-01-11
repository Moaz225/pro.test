document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.menu-section');
  const buttons = document.querySelectorAll('.category-btn');
  const searchInput = document.getElementById('searchInput');
  const toTop = document.getElementById('toTop');

  function hideAllSections() {
    sections.forEach(s => s.style.display = 'none');
  }

  function showSection(target, doScroll = true) {
    hideAllSections();

    if (target && target.startsWith('meals-')) {
      const meals = document.getElementById('meals');
      if (meals) meals.style.display = 'block';
      const sub = document.getElementById(target);
      if (sub && doScroll) sub.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const sec = document.getElementById(target || 'coffee');
      if (sec) {
        sec.style.display = 'block';
        if (doScroll) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // الأزرار (تبديل الأقسام)
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.target || btn.dataset.category;

      // إعادة ضبط البحث
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('.menu-card, .meal-item').forEach(i => i.style.display = '');

      showSection(target);
    });
  });

  // العرض الافتراضي
  showSection('coffee', false);
  document.querySelector('.category-btn[data-target="coffee"], .category-btn[data-category="coffee"]')?.classList.add('active');

  // البحث
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const term = searchInput.value.trim().toLowerCase();
      const items = document.querySelectorAll('.menu-card, .meal-item');

      if (term) {
        // أثناء البحث نُظهر كل الأقسام
        sections.forEach(s => s.style.display = 'block');
        items.forEach(item => {
          const nameEl = item.querySelector('.item-name') || item.querySelector('.meal-name');
          const name = nameEl ? nameEl.textContent.toLowerCase() : '';
          item.style.display = name.includes(term) ? '' : 'none';
        });
      } else {
        // عند مسح البحث نرجع للقسم النشط
        items.forEach(i => i.style.display = '');
        const activeBtn = document.querySelector('.category-btn.active');
        const target = activeBtn ? (activeBtn.dataset.target || activeBtn.dataset.category) : 'coffee';
        showSection(target, false);
      }
    });
  }

  // زر الرجوع لأعلى — ظاهر دائمًا + يعمل على كل الحاويات
  if (toTop) {
    // إجبار الظهور فوق كل شيء حتى لو وُجد CSS سابق يخفيه
    try {
      toTop.style.setProperty('opacity', '1', 'important');
      toTop.style.setProperty('pointer-events', 'auto', 'important');
      toTop.style.setProperty('transform', 'translateY(0)', 'important');
      toTop.style.setProperty('z-index', '2147483647', 'important');
    } catch (e) { }

    function scrollToTop() {
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior = prefersReduced ? 'auto' : 'smooth';

      // نافذة المتصفح
      try {
        window.scrollTo({ top: 0, behavior });
      } catch (_) { }

      // جميع الحاويات القابلة للتمرير
      document.querySelectorAll('*').forEach(el => {
        const s = getComputedStyle(el);
        if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
          try {
            el.scrollTo({ top: 0, behavior });
          } catch (_) {
            el.scrollTop = 0;
          }
        }
      });

      // fallback لأنظمة قديمة
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollToTop();
    });
  }
});
