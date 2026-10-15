/* =========================================================
   Campus Circular — common.js
   ฟังก์ชันที่ทุกหน้าใช้ร่วมกัน (ต้องโหลดหลัง data.js)
   - Store   : อ่าน/เขียน localStorage แบบปลอดภัย
   - Cart    : ตะกร้า (รายการสินค้าของฉัน)
   - Saved   : ของที่กดถูกใจ / เก็บเข้าคลัง
   - Posted  : ของที่ฉันลงไว้เอง (จากหน้า post.html)
   ========================================================= */

// ---------- Store: localStorage ที่ไม่พังถ้าเบราว์เซอร์ปิดไว้ ----------
const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false; // พื้นที่เต็ม หรือถูกปิดไว้ — ทำงานต่อได้แต่จะไม่จำค่า
    }
  }
};

// ---------- ชุดของ id ที่บันทึกไว้ (ใช้ซ้ำกับ Cart และ Saved) ----------
function idSet(key) {
  return {
    all() {
      return Store.get(key, []);
    },
    has(id) {
      return this.all().includes(id);
    },
    add(id) {
      const list = this.all();
      if (!list.includes(id)) list.push(id);
      Store.set(key, list);
    },
    remove(id) {
      Store.set(key, this.all().filter((x) => x !== id));
    },
    toggle(id) {
      this.has(id) ? this.remove(id) : this.add(id);
      return this.has(id);
    }
  };
}

const Cart = idSet("cc-cart");
const Saved = idSet("cc-saved");

// ---------- ของที่ฉันลงเอง ----------
const Posted = {
  all() {
    return Store.get("cc-posted", []);
  },
  add(item) {
    const list = this.all();
    list.unshift(item);
    return Store.set("cc-posted", list);
  }
};

// รวมของตัวอย่าง + ของที่ลงเอง
function allItems() {
  return [...Posted.all(), ...ITEMS];
}

function getItem(id) {
  return allItems().find((item) => item.id === id);
}

// ---------- ตัวช่วยแสดงผล ----------
function formatDistance(m) {
  return m < 1000 ? `${m} เมตร` : `${(m / 1000).toFixed(1)} กิโลเมตร`;
}

function escapeHTML(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

// ป้ายโหมดแบบเม็ดยา (ใช้ในหน้า product / cart / post / chat)
function tagHTML(item, extraClass = "") {
  return `<span class="tag tag--${item.mode} ${extraClass}">${escapeHTML(item.tag)}</span>`;
}

// ---------- กล่องข้อความสั้น ๆ (toast) ----------
function toast(message) {
  let box = document.querySelector(".toast");
  if (!box) {
    box = document.createElement("div");
    box.className = "toast";
    box.setAttribute("role", "status");
    document.body.appendChild(box);
  }
  box.textContent = message;
  box.classList.add("is-visible");
  clearTimeout(box._timer);
  box._timer = setTimeout(() => box.classList.remove("is-visible"), 2200);
}

// ---------- Modal: เปิด/ปิด + กด Esc หรือพื้นหลังเพื่อปิด ----------
function openModal(modal) {
  modal.hidden = false;
  document.body.classList.add("has-modal");
  const focusTarget = modal.querySelector("[data-autofocus], button, a, input");
  if (focusTarget) focusTarget.focus();
}

function closeModal(modal) {
  modal.hidden = true;
  if (!document.querySelector(".modal:not([hidden])")) {
    document.body.classList.remove("has-modal");
  }
}

document.addEventListener("click", (e) => {
  // คลิกพื้นหลังมืด หรือปุ่มที่มี data-close
  const modal = e.target.closest(".modal");
  if (modal && (e.target === modal || e.target.closest("[data-close]"))) {
    closeModal(modal);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const open = [...document.querySelectorAll(".modal:not([hidden])")].pop();
  if (open && !open.hasAttribute("data-locked")) closeModal(open);
});

// ปุ่มแจ้งเตือนใน header (ยังไม่มีหน้าในดีไซน์)
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-notify]")) {
    e.preventDefault();
    toast("ยังไม่มีการแจ้งเตือนใหม่");
  }
});

// ปุ่มย้อนกลับ: ถ้ามาจากหน้าในเว็บนี้ให้ย้อนกลับ ไม่งั้นไปหน้า main
document.addEventListener("click", (e) => {
  const back = e.target.closest("[data-back]");
  if (!back) return;
  e.preventDefault();
  if (document.referrer && new URL(document.referrer).origin === location.origin) {
    history.back();
  } else {
    location.href = back.getAttribute("href") || "main.html";
  }
});
