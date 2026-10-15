/* =========================================================
   Campus Circular — cart.js (รายการสินค้าของฉัน)
   ขั้นตอน: ติ๊กเลือกของ → ยืนยันจุดนัดพบ → กำลังติดต่อผู้ลงของ
   ========================================================= */

const list = document.getElementById("cart-list");
const confirmBtn = document.getElementById("confirm-btn");

// ของที่ติ๊กเลือกไว้ (ค่าเริ่มต้น = เลือกทุกชิ้น)
let selected = new Set(Cart.all());

// ---------- ผู้ลงของ ----------
document.getElementById("seller-avatar").src = SELLER.avatar;
document.getElementById("seller-name").textContent = SELLER.name;
document.getElementById("seller-stats").textContent = `${SELLER.rating} ส่งต่อสำเร็จ ${SELLER.deals} ครั้ง`;
document.getElementById("seller-closet").innerHTML =
  SELLER.closet.map((src) => `<img src="${src}" alt="ของในคลังของผู้ลงของ">`).join("");

// ---------- รายการในตะกร้า ----------
function render() {
  const items = Cart.all().map(getItem).filter(Boolean);

  if (!items.length) {
    list.innerHTML = `
      <div class="cart-empty">
        <p>ยังไม่มีของในรายการ ลองไปเลือกดูก่อนนะ</p>
        <a class="btn btn--primary" href="main.html">ดูของที่หมุนเวียนอยู่ตอนนี้</a>
      </div>`;
  } else {
    list.innerHTML = items.map((item) => {
      const on = selected.has(item.id);
      return `
        <article class="cart-row">
          <button class="check" type="button" role="checkbox" aria-checked="${on}"
                  data-id="${item.id}" aria-label="เลือก ${escapeHTML(item.title)}">
            <img src="images/check.svg" alt="">
          </button>
          <a class="cart-row__thumb" href="product.html?id=${item.id}">
            <img src="${item.img}" alt="">
          </a>
          <div>
            <h2 class="cart-row__title"><a href="product.html?id=${item.id}">${escapeHTML(item.title)}</a></h2>
            <p class="cart-row__place">${escapeHTML(item.place)} ${formatDistance(item.distance)}</p>
            ${tagHTML(item, "tag--sm")}
            <button class="cart-row__remove" type="button" data-remove="${item.id}">ลบออก</button>
          </div>
        </article>`;
    }).join("");
  }

  confirmBtn.disabled = selected.size === 0;
}

list.addEventListener("click", (e) => {
  const check = e.target.closest(".check");
  if (check) {
    const id = Number(check.dataset.id);
    selected.has(id) ? selected.delete(id) : selected.add(id);
    render();
    return;
  }

  const remove = e.target.closest("[data-remove]");
  if (remove) {
    const id = Number(remove.dataset.remove);
    Cart.remove(id);
    selected.delete(id);
    toast("ลบออกจากรายการแล้ว");
    render();
  }
});

render();

// ---------- ป๊อปอัป 1: ยืนยันจุดนัดพบ ----------
const meetModal = document.getElementById("meet-modal");
const pickGrid = document.getElementById("pick-grid");
const pickupSelect = document.getElementById("pickup-select");
const pickupValue = document.getElementById("pickup-value");
let picked = new Set();

pickupSelect.innerHTML = PICKUP_POINTS.map((p) => `<option>${escapeHTML(p)}</option>`).join("");

function renderPicks() {
  pickGrid.innerHTML = [...selected].map(getItem).filter(Boolean).map((item) => {
    const on = picked.has(item.id);
    return `
      <div class="pick ${on ? "" : "is-off"}">
        <div class="pick__img"><img src="${item.img}" alt=""></div>
        <p class="pick__name">${escapeHTML(item.title)}</p>
        <button class="pick__tick" type="button" data-id="${item.id}" aria-pressed="${on}"
                aria-label="${on ? "ไม่เอา" : "เอา"} ${escapeHTML(item.title)}">
          <img src="images/tick.svg" alt="">
        </button>
      </div>`;
  }).join("");
  document.getElementById("meet-confirm").disabled = picked.size === 0;
}

confirmBtn.addEventListener("click", () => {
  picked = new Set(selected);
  // ใช้จุดนัดรับของชิ้นแรกเป็นค่าเริ่มต้น ถ้าอยู่ในรายการ
  const first = getItem([...picked][0]);
  const match = first && PICKUP_POINTS.find((p) => p === first.pickup);
  pickupSelect.value = match || PICKUP_POINTS[0];
  pickupValue.textContent = pickupSelect.value;
  renderPicks();
  openModal(meetModal);
});

pickGrid.addEventListener("click", (e) => {
  const tick = e.target.closest(".pick__tick");
  if (!tick) return;
  const id = Number(tick.dataset.id);
  picked.has(id) ? picked.delete(id) : picked.add(id);
  renderPicks();
});

pickupSelect.addEventListener("change", () => {
  pickupValue.textContent = pickupSelect.value;
});

// ---------- ป๊อปอัป 2: กำลังติดต่อผู้ลงของ ----------
document.getElementById("meet-confirm").addEventListener("click", () => {
  const items = [...picked].map(getItem).filter(Boolean);

  // บันทึกคำสั่งซื้อล่าสุด (หน้าแชทจะใช้แสดงป้ายโหมด) แล้วเอาออกจากตะกร้า
  Store.set("cc-last-order", { ids: [...picked], pickup: pickupSelect.value });
  picked.forEach((id) => { Cart.remove(id); selected.delete(id); });

  closeModal(meetModal);
  document.getElementById("done-items").innerHTML =
    items.map((item) => `<img src="${item.img}" alt="${escapeHTML(item.title)}">`).join("");

  const doneModal = document.getElementById("done-modal");
  const spinner = document.getElementById("done-spinner");
  const sub = document.getElementById("done-sub");
  spinner.hidden = false;
  sub.hidden = true;
  openModal(doneModal);

  // จำลองการรอผู้ลงของตอบรับ
  setTimeout(() => {
    spinner.hidden = true;
    sub.hidden = false;
  }, 1500);

  render();
});
