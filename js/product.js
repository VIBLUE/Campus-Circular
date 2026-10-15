/* =========================================================
   Campus Circular — product.js (หน้ารายละเอียดสินค้า)
   เปิดด้วย product.html?id=1 .. 12
   ========================================================= */

const params = new URLSearchParams(location.search);
const item = getItem(Number(params.get("id"))) || ITEMS[0];
const root = document.getElementById("product");

document.title = `${item.title} — Campus Circular`;

// ---------- breadcrumb ----------
document.getElementById("breadcrumb").innerHTML = `
  <li><a href="main.html">หน้าแรก</a></li>
  <li><a href="main.html">${escapeHTML(CATEGORY_LABEL[item.category] || "อื่น ๆ")}</a></li>
  <li aria-current="page">${escapeHTML(item.title)}</li>`;

// ---------- ข้อมูลรายละเอียด (หมวด สภาพ จุดนัดรับ ลดขยะ) ----------
function specsHTML(it) {
  return `
    <div><dt>สภาพ</dt><dd>${escapeHTML(it.condition || "สภาพดี")}</dd></div>
    <div><dt>หมวดหมู่</dt><dd>${escapeHTML(CATEGORY_LABEL[it.category] || "-")}</dd></div>
    <div><dt>จุดนัดรับ</dt><dd>${escapeHTML(it.pickup || it.place)}</dd></div>
    <div><dt>ลดขยะได้</dt><dd class="is-impact">${escapeHTML(it.reduce || "-")}</dd></div>`;
}

// ---------- วาดหน้า ----------
function render() {
  const gallery = item.gallery && item.gallery.length ? item.gallery : [item.img];
  const liked = Saved.has(item.id);
  const inCart = Cart.has(item.id);
  const likes = (item.likes || 0) + (liked ? 1 : 0);

  root.innerHTML = `
    <section class="gallery" aria-label="รูปสินค้า">
      <div class="gallery__main">
        <img id="main-img" src="${gallery[0]}" alt="${escapeHTML(item.title)}">
      </div>
      ${gallery.length > 1 ? `
      <div class="gallery__thumbs">
        ${gallery.slice(1, 4).map((src, i) => `
          <button class="gallery__thumb" type="button" data-src="${src}"
                  aria-label="ดูรูปที่ ${i + 2}">
            <img src="${src}" alt="">
          </button>`).join("")}
      </div>` : ""}
    </section>

    <section class="info">
      ${tagHTML(item)}
      <h1 class="info__title">${escapeHTML(item.title)}</h1>
      <p class="info__meta">ลงไว้เมื่อ ${escapeHTML(item.posted || "ไม่นานมานี้")} · มีคนถูกใจ ${likes} คน</p>
      ${item.price ? `<p class="info__price">${escapeHTML(item.price)}</p>` : ""}
      <p class="info__desc">${(item.desc || []).map(escapeHTML).join("<br>")}</p>

      <dl class="specs">${specsHTML(item)}</dl>

      <div class="seller">
        <img class="seller__avatar" src="${SELLER.avatar}" alt="">
        <p class="seller__name">${escapeHTML(item.seller || SELLER.name)}</p>
        <a class="seller__link" href="chat.html">ดูโปรไฟล์</a>
        <p class="seller__stats"><img src="images/star.svg" alt="">${SELLER.rating} ส่งต่อสำเร็จ ${SELLER.deals} ครั้ง</p>
        <p class="seller__verify"><img src="images/verified.svg" alt="">ยืนยันอีเมล @rmutt.ac.th แล้ว</p>
      </div>

      <div class="actions">
        <button class="btn btn--primary" type="button" id="add-cart">
          ${inCart ? "อยู่ในตะกร้าแล้ว" : "ใส่ตะกร้าเลย"}
        </button>
        <button class="btn btn--outline" type="button" id="like-btn" aria-pressed="${liked}">
          <img src="images/heart.svg" alt="">${liked ? "ถูกใจแล้ว" : "ถูกใจไว้ก่อน"}
        </button>
      </div>
    </section>`;
}

render();

// ---------- event ----------
root.addEventListener("click", (e) => {
  // กด thumbnail = สลับรูปเล็กกับรูปใหญ่ (กดกลับได้ทุกรูป)
  const thumb = e.target.closest(".gallery__thumb");
  if (thumb) {
    const mainImg = document.getElementById("main-img");
    const oldMain = mainImg.getAttribute("src");
    mainImg.src = thumb.dataset.src;
    thumb.dataset.src = oldMain;
    thumb.querySelector("img").src = oldMain;
    return;
  }

  // ถูกใจ
  if (e.target.closest("#like-btn")) {
    const nowLiked = Saved.toggle(item.id);
    toast(nowLiked ? "เก็บเข้าคลังแล้ว" : "นำออกจากคลังแล้ว");
    render();
    return;
  }

  // ใส่ตะกร้า → เปิดป๊อปอัปยืนยัน
  if (e.target.closest("#add-cart")) {
    Cart.add(item.id);
    render();
    showOrderModal();
  }
});

function showOrderModal() {
  const modal = document.getElementById("order-modal");
  document.getElementById("order-img").src = (item.gallery && item.gallery[0]) || item.img;
  document.getElementById("order-img").alt = item.title;
  document.getElementById("order-title").textContent = item.title;
  document.getElementById("order-specs").innerHTML = specsHTML(item);
  openModal(modal);
}
