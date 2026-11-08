/* ============================================================
   Memdex — main.js
   Логика сайта: мобильное меню, случайный мем, форма подписки.
   Структура — в index.html, оформление — в style.css
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Мобильное меню ---------- */
  function initMobileMenu() {
    var burger = document.getElementById('burger');
    var menu = document.getElementById('mobileMenu');
    if (!burger || !menu) return;

    var desktop = window.matchMedia('(min-width: 1024px)');

    function openMenu() {
      menu.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Закрыть меню');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
        // фокус на первый пункт меню
        var firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Закрытие по Escape с возвратом фокуса на кнопку-бургер
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        burger.focus();
      }
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Сброс меню и разблокировка скролла при переходе на десктопную раскладку
    function handleDesktop(e) {
      if (e.matches) closeMenu();
    }

    if (desktop.addEventListener) {
      desktop.addEventListener('change', handleDesktop);
    } else if (desktop.addListener) {
      desktop.addListener(handleDesktop); // поддержка старых Safari
    }
  }

  /* ---------- Случайный мем ---------- */
  function initRandomMeme() {
    var randomBtn = document.getElementById('randomMemeBtn');
    if (!randomBtn) return;

    randomBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var cards = document.querySelectorAll('.meme-card');
      if (!cards.length) return;

      var el = cards[Math.floor(Math.random() * cards.length)];

      // сброс подсветки у всех, затем подсветка выбранного
      cards.forEach(function (card) {
        card.classList.remove('flash-highlight');
      });
      void el.offsetWidth; // принудительный перезапуск CSS-анимации
      el.classList.add('flash-highlight');

      var headerOffset = 90;
      var top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ---------- Форма подписки ---------- */
  function initSubscribeForm() {
    var form = document.getElementById('subscribeForm');
    if (!form) return;

    var emailInput = document.getElementById('email');
    var message = document.getElementById('formMessage');
    var submitBtn = document.getElementById('subscribeBtn');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setMessage(text, type) {
      if (!message) return;
      message.textContent = text;
      message.className = 'form-message' + (type ? ' is-' + type : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = emailInput.value.trim();

      if (!emailRe.test(value)) {
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
        setMessage('Пожалуйста, введи корректный email.', 'error');
        return;
      }

      emailInput.removeAttribute('aria-invalid');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем…';
      setMessage('', '');

      // Имитация отправки — здесь можно подключить Formspree или свой бэкенд
      setTimeout(function () {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Подписаться';
        setMessage('Готово! Лучшие мемы уже летят на почту 🚀', 'success');
      }, 800);
    });

    emailInput.addEventListener('input', function () {
      emailInput.removeAttribute('aria-invalid');
      setMessage('', '');
    });
  }

  /* ---------- Инициализация ---------- */
  function init() {
    initMobileMenu();
    initRandomMeme();
    initSubscribeForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
