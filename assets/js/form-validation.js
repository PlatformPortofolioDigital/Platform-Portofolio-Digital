// assets/js/form-validation.js
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const msgEl = document.getElementById("message");

  const errName = document.getElementById("errName");
  const errEmail = document.getElementById("errEmail");
  const errMessage = document.getElementById("errMessage");

  const alertBox = document.getElementById("formAlert");
  const btn = document.getElementById("btnSubmit");

  function showAlert(text, type) {
    if (!alertBox) return;
    alertBox.className = "form-alert " + (type || "info");
    alertBox.textContent = text;
    alertBox.style.display = "block";
  }

  function hideAlert() {
    if (!alertBox) return;
    alertBox.style.display = "none";
    alertBox.textContent = "";
  }

  function setError(input, errEl, msg) {
    input.style.borderColor = "#ef4444";
    errEl.textContent = msg;
  }

  function clearError(input, errEl) {
    input.style.borderColor = "";
    errEl.textContent = "";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function validate() {
    let ok = true;
    hideAlert();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = msgEl.value.trim();

    if (name.length < 3) {
      setError(nameEl, errName, "Nama minimal 3 karakter.");
      ok = false;
    } else clearError(nameEl, errName);

    if (!isValidEmail(email)) {
      setError(emailEl, errEmail, "Email tidak valid. Contoh: nama@email.com");
      ok = false;
    } else clearError(emailEl, errEmail);

    if (message.length < 10) {
      setError(msgEl, errMessage, "Pesan minimal 10 karakter.");
      ok = false;
    } else clearError(msgEl, errMessage);

    return ok;
  }

  // realtime validation
  [nameEl, emailEl, msgEl].forEach((el) => el.addEventListener("input", validate));

  // sukses redirect dari FormSubmit
  const params = new URLSearchParams(window.location.search);
  if (params.get("success") === "1") {
    showAlert("✅ Pesan kamu berhasil terkirim! Silakan cek email secara berkala, admin akan membalas secepatnya.", "success");

    // bersihin query success dari URL biar notif gak muncul terus
    window.history.replaceState({}, document.title, window.location.pathname);

    // reset form biar bersih
    form.reset();
  }

  form.addEventListener("submit", function (e) {
    if (!validate()) {
      e.preventDefault();
      showAlert("⚠️ Masih ada yang salah. Tolong cek lagi form kamu ya.", "error");
      return;
    }

    // kalau valid: BIAR POST JALAN
    btn.disabled = true;
    const old = btn.textContent;
    btn.textContent = "Mengirim...";

    // fallback kalau user balik tanpa reload
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = old;
    }, 8000);
  });
})();
