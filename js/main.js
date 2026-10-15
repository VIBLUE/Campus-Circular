/* =========================================================
   Campus Circular — main.js
   หน้าที่: วาดการ์ดจาก ITEMS (data.js) และทำให้ตัวกรองใช้งานได้จริง
   ต้องโหลดหลัง data.js และ common.js
   ========================================================= */

// ---------- 1. สถานะของหน้า ----------
const state = {
  mode: "all",          // โหมดที่เลือก
  category: null,       // หมวดหมู่ที่เลือก (null = ทุกหมวด)
  maxKm: 5,             // ระยะทางสูงสุดจากสไลเดอร์
  query: "",            // คำค้นหา
  sort: "near"          // วิธีเรียง
};
// ของที่กด + เก็บเข้าคลังจะถูกจำไว้ใน Saved (common.js) ข้ามหน้าได้

// ---------- 2. อ้างอิง element ----------
const grid = document.getElementById("card-grid");
const emptyState = document.getElementById("empty-state");
const feedMeta = document.getElementById("feed-meta");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const range = document.getElementById("distance-range");
const rangeValue = document.getElementById("distance-value");

// ---------- 3. สร้างการ์ด 1 ใบ ----------
function cardHTML(item) {
  const isSaved = Saved.has(item.id);
  return `
    <article class="card" data-mode="${item.mode}">
      <div class="card__media">
        <img class="card__img" src="${item.img}" alt="${escapeHTML(item.title)}" loading="lazy">
        <span class="card__tag">${escapeHTML(item.tag)}</span>
      </div>
      <div class="card__body">
        <span class="card__chip">${escapeHTML(item.chip)}</span>
        <h3 class="card__title">
          <a class="card__link" href="product.html?id=${item.id}">${escapeHTML(item.title)}</a>
        </h3>
        <p class="card__place">${escapeHTML(item.place)} ${formatDistance(item.distance)}</p>
        <p class="card__note" style="--note:${item.noteColor}">${escapeHTML(item.note)}</p>
      </div>
      <button class="card__save" type="button" data-id="${item.id}"
              aria-pressed="${isSaved}" aria-label="${isSaved ? "นำออกจากคลัง" : "เก็บเข้าคลัง"}: ${escapeHTML(item.title)}">
        <img src="images/add.svg" alt="">
      </button>
    </article>`;
}

// ---------- 4. กรอง + เรียง + วาดใหม่ ----------
function getVisibleItems() {
  const q = state.query.trim().toLowerCase().replace(/[\s-]/g, "");

  const list = allItems().filter((item) => {
    if (state.mode !== "all" && item.mode !== state.mode) return false;
    if (state.category && item.category !== state.category) return false;
    if (item.distance > state.maxKm * 1000) return false;
    if (q) {
      // ค้นได้ทั้งชื่อ สถานที่ และรหัสวิชา (ENG101 / eng-101 ก็เจอ)
      const haystack = `${item.title} ${item.place} ${item.code || ""} ${item.note}`
        .toLowerCase().replace(/[\s-]/g, "");
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sorters = {
    near: (a, b) => a.distance - b.distance,
    far: (a, b) => b.distance - a.distance,
    saved: (a, b) => Number(Saved.has(b.id)) - Number(Saved.has(a.id)),
    new: (a, b) => b.id - a.id
  };
  return list.sort(sorters[state.sort]);
}

function render() {
  const items = getVisibleItems();
  grid.innerHTML = items.map(cardHTML).join("");
  emptyState.hidden = items.length > 0;
  feedMeta.textContent = `${items.length} รายการ · อัพเดทล่าสุด 5 นาทีที่แล้ว`;
}

// ---------- 5. Event ----------
// ปุ่มโหมด
document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.mode = btn.dataset.mode;
    document.querySelectorAll(".mode-btn").forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active);
    });
    render();
  });
});

// หมวดหมู่ (กดซ้ำ = ยกเลิก)
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = state.category === btn.dataset.category ? null : btn.dataset.category;
    state.category = next;
    document.querySelectorAll(".category-btn").forEach((b) => {
      const active = b.dataset.category === next;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active);
    });
    render();
  });
});

// สไลเดอร์ระยะทาง
range.addEventListener("input", () => {
  state.maxKm = Number(range.value);
  rangeValue.textContent = range.value;
  render();
});

// ค้นหา
searchInput.addEventListener("input", () => {
  state.query = searchInput.value;
  render();
});

// กด Enter ในช่องค้นหา: อยู่หน้านี้อยู่แล้ว ไม่ต้องโหลดหน้าใหม่
searchInput.form.addEventListener("submit", (e) => e.preventDefault());

// เรียงตาม
sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  render();
});

// ปุ่ม + บนการ์ด (ใช้ event delegation เพราะการ์ดถูกวาดใหม่บ่อย)
grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".card__save");
  if (!btn) return;
  const nowSaved = Saved.toggle(Number(btn.dataset.id));
  toast(nowSaved ? "เก็บเข้าคลังแล้ว" : "นำออกจากคลังแล้ว");
  render();
});

// Textbook matcher: กดแล้วไปพิมพ์รหัสวิชาในช่องค้นหา
document.getElementById("matcher-btn").addEventListener("click", () => {
  searchInput.value = "ENG-";
  searchInput.focus();
  state.query = searchInput.value;
  render();
});

// Fast Track (ยังไม่มีฟังก์ชันในดีไซน์ ตอนนี้แค่สลับสถานะปุ่ม)
document.querySelector(".fast-track").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.setAttribute("aria-pressed", btn.getAttribute("aria-pressed") !== "true");
});

// ---------- 6. เริ่มทำงาน ----------
// ถ้ามาจากช่องค้นหาในหน้า Homepage (main.html?q=...) ให้ใส่คำค้นให้เลย
const initialQuery = new URLSearchParams(location.search).get("q");
if (initialQuery) {
  searchInput.value = initialQuery;
  state.query = initialQuery;
}

render();
