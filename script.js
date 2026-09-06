document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

const EMAIL = "paulofelipedesigns@gmail.com";
const body = document.body;
const menuButton = document.querySelector(".menu-button");
const menuPanel = document.querySelector(".menu-panel");
const menuLabel = document.querySelector(".menu-button__label");
const wordmark = document.querySelector(".wordmark");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
const menuLinks = [...document.querySelectorAll(".menu-panel a")];
const emailButtons = [...document.querySelectorAll("[data-email-copy]")];
const toast = document.querySelector("#toast");
const toastMessage = toast.querySelector(".toast__message");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let toastTimer;

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menuLabel.textContent = open ? "Fechar" : "Menu";
  menuPanel.setAttribute("aria-hidden", String(!open));
  body.classList.toggle("menu-open", open);
  main.inert = open;
  footer.inert = open;
  wordmark.tabIndex = open ? -1 : 0;

  if (open) {
    window.setTimeout(() => menuLinks[0]?.focus(), reduceMotion.matches ? 0 : 380);
  } else if (menuPanel.contains(document.activeElement)) {
    menuButton.focus();
  }
}

menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    return;
  }

  if (event.key === "Tab" && menuButton.getAttribute("aria-expanded") === "true") {
    const focusable = [menuButton, ...menuLinks, ...emailButtons.filter((item) => menuPanel.contains(item))];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

function showToast(message) {
  window.clearTimeout(toastTimer);
  toastMessage.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

async function copyEmail(button) {
  let copied = false;

  try {
    await navigator.clipboard.writeText(EMAIL);
    copied = true;
  } catch {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = EMAIL;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    body.appendChild(temporaryInput);
    temporaryInput.select();
    copied = document.execCommand("copy");
    temporaryInput.remove();
  }

  if (copied) {
    button.classList.remove("is-copied");
    void button.offsetWidth;
    button.classList.add("is-copied");
    showToast("E-mail copiado: " + EMAIL);
  } else {
    showToast("Não foi possível copiar. E-mail: " + EMAIL);
  }
}

emailButtons.forEach((button) => {
  button.addEventListener("click", () => copyEmail(button));
});

const revealItems = [...document.querySelectorAll(".reveal")];

if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelector("#current-year").textContent = new Date().getFullYear();

document.addEventListener("contextmenu", (event) => {
  if (event.target.closest(".protected-media")) {
    event.preventDefault();
    showToast("Visualização protegida");
  }
});

document.addEventListener("dragstart", (event) => {
  if (event.target.closest(".protected-media")) {
    event.preventDefault();
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const command = event.ctrlKey || event.metaKey;
  const blockedShortcut =
    (command && ["s", "u", "p"].includes(key)) ||
    (command && event.shiftKey && ["i", "j", "c"].includes(key)) ||
    event.key === "F12";

  if (blockedShortcut) {
    event.preventDefault();
    showToast("Conteúdo do portfólio protegido");
  }
});
