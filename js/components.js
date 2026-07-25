/* =========================================================
   components.js — 컴포넌트 인터랙션 (이벤트 위임)
   document 레벨 위임이라 showcase가 innerHTML을 재렌더해도 동작한다.
   전역 window.UI 로 theme/toast 헬퍼 노출.
   ========================================================= */
(function () {
  "use strict";

  /* ---- Theme (light/dark) ---- */
  var root = document.documentElement;
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.textContent = t === "dark" ? "라이트 모드" : "다크 모드";
    });
  }
  function initTheme() {
    var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    var manual = false;
    setTheme(mq && mq.matches ? "dark" : "light");
    if (mq && mq.addEventListener) {
      mq.addEventListener("change", function (e) {
        if (!manual) setTheme(e.matches ? "dark" : "light");
      });
    }
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-theme-toggle]");
      if (!btn) return;
      manual = true;
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---- Toast ---- */
  var toastTimer = null;
  function showToast(message, variant) {
    var host = document.getElementById("toast-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "toast-host";
      host.style.cssText =
        "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;";
      document.body.appendChild(host);
    }
    host.innerHTML =
      '<div class="toast' +
      (variant === "danger" ? " toast--danger" : "") +
      '"><span class="toast__text">' +
      message +
      "</span></div>";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      host.innerHTML = "";
    }, 2400);
  }

  /* ---- Delegated interactions ---- */
  document.addEventListener("click", function (e) {
    // Dropdown trigger
    var trig = e.target.closest(".dropdown__trigger");
    if (trig) {
      var dd = trig.closest(".dropdown");
      var open = dd.classList.contains("is-open");
      closeDropdowns();
      if (!open && !dd.classList.contains("is-disabled")) dd.classList.add("is-open");
      return;
    }
    // Dropdown item select
    var item = e.target.closest(".dropdown__item");
    if (item) {
      var box = item.closest(".dropdown");
      box.querySelectorAll(".dropdown__item").forEach(function (i) {
        i.classList.remove("dropdown__item--selected");
      });
      item.classList.add("dropdown__item--selected");
      var label = box.querySelector(".dropdown__label");
      if (label) label.textContent = item.dataset.label || item.textContent.trim();
      box.classList.remove("is-open");
      return;
    }
    // Tab select
    var tab = e.target.closest(".tabs__tab");
    if (tab && !tab.disabled) {
      var list = tab.closest(".tabs__list");
      list.querySelectorAll(".tabs__tab").forEach(function (t) {
        t.classList.remove("tabs__tab--selected");
      });
      tab.classList.add("tabs__tab--selected");
      return;
    }
    // Stepper
    var sbtn = e.target.closest(".stepper__btn");
    if (sbtn && !sbtn.disabled) {
      var stepper = sbtn.closest(".stepper");
      var valEl = stepper.querySelector(".stepper__value");
      var min = parseInt(stepper.dataset.min || "0", 10);
      var max = parseInt(stepper.dataset.max || "100", 10);
      var step = parseInt(stepper.dataset.step || "1", 10);
      var unit = stepper.dataset.unit || "";
      var cur = parseInt((valEl.textContent || "0").replace(/[^0-9-]/g, ""), 10) || 0;
      cur += sbtn.dataset.dir === "up" ? step : -step;
      cur = Math.max(min, Math.min(max, cur));
      valEl.textContent = cur + unit;
      stepper.querySelector('[data-dir="down"]').disabled = cur <= min;
      stepper.querySelector('[data-dir="up"]').disabled = cur >= max;
      return;
    }
    // Switch
    var sw = e.target.closest(".switch");
    if (sw && !sw.classList.contains("is-disabled")) {
      sw.classList.toggle("is-on");
      return;
    }
    // Outside click closes dropdowns
    if (!e.target.closest(".dropdown")) closeDropdowns();
  });

  function closeDropdowns() {
    document.querySelectorAll(".dropdown.is-open").forEach(function (d) {
      d.classList.remove("is-open");
    });
  }

  window.UI = { initTheme: initTheme, setTheme: setTheme, showToast: showToast };
})();
