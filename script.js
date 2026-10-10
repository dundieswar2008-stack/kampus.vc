const initialLeads = [
  { name: "Olivia Rhye", email: "olivia@orbitstudio.co", company: "Orbit Studio", status: "Qualified", value: 8500, date: "Oct 10, 2026", initials: "OR", tone: "green" },
  { name: "Phoenix Baker", email: "phoenix@layers.com", company: "Layers", status: "New", value: 4200, date: "Oct 09, 2026", initials: "PB", tone: "purple" },
  { name: "Lana Steiner", email: "lana@circooles.com", company: "Circooles", status: "Contacted", value: 6700, date: "Oct 08, 2026", initials: "LS", tone: "orange" },
  { name: "Demi Wilkinson", email: "demi@catalog.com", company: "Catalog", status: "Qualified", value: 12800, date: "Oct 07, 2026", initials: "DW", tone: "blue" },
  { name: "Candice Wu", email: "candice@quotient.co", company: "Quotient", status: "New", value: 3600, date: "Oct 06, 2026", initials: "CW", tone: "pink" },
  { name: "Natali Craig", email: "natali@brightpath.io", company: "Brightpath", status: "Contacted", value: 5900, date: "Oct 05, 2026", initials: "NC", tone: "green" },
  { name: "Drew Cano", email: "drew@formcraft.com", company: "Formcraft", status: "New", value: 2750, date: "Oct 04, 2026", initials: "DC", tone: "orange" }
];

let leads = [...initialLeads];
let showAll = false;
const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

function statusClass(status) {
  return ({ New: "status-new", Contacted: "status-contacted", Qualified: "status-qualified", Proposal: "status-proposal" })[status] || "status-new";
}

function renderLeads() {
  const search = document.getElementById("leadSearch").value.trim().toLowerCase();
  const filter = document.getElementById("leadFilter").value;
  const filtered = leads.filter(lead => {
    const matchesSearch = [lead.name, lead.email, lead.company].some(value => value.toLowerCase().includes(search));
    return matchesSearch && (filter === "all" || lead.status === filter);
  });
  const visible = showAll ? filtered : filtered.slice(0, 5);
  const table = document.getElementById("leadsTable");
  table.innerHTML = visible.map((lead, index) => `
    <tr>
      <td><div class="lead-person"><div class="lead-avatar ${lead.tone || "purple"}">${escapeHTML(lead.initials || initials(lead.name))}</div><div><div class="lead-name">${escapeHTML(lead.name)}</div><div class="lead-email">${escapeHTML(lead.email || "No email provided")}</div></div></div></td>
      <td><span class="company-name">${escapeHTML(lead.company)}</span></td>
      <td><span class="status-pill ${statusClass(lead.status)}">${escapeHTML(lead.status)}</span></td>
      <td><strong>${money(Number(lead.value) || 0)}</strong></td>
      <td>${escapeHTML(lead.date)}</td>
      <td><button class="row-menu" data-lead-index="${leads.indexOf(lead)}" aria-label="Lead actions">•••</button></td>
    </tr>`).join("");
  document.getElementById("leadCount").textContent = `Showing ${visible.length} of ${filtered.length} lead${filtered.length === 1 ? "" : "s"}`;
  document.getElementById("showAllLeads").textContent = showAll ? "Show fewer ↑" : "View all leads →";
  document.getElementById("newLeads").textContent = leads.length + 17;
  table.querySelectorAll(".row-menu").forEach(button => button.addEventListener("click", () => {
    const lead = leads[Number(button.dataset.leadIndex)];
    if (lead) showToast(`${lead.name} · ${lead.status} · ${money(lead.value)}`);
  }));
}

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function drawChart(period = 6) {
  const allLabels = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  const allValues = [4.4, 6.2, 5.6, 8.8, 7.4, 10.7, 9.2, 11.3, 8.9, 12.1, 10.8, 14.1];
  const labels = allLabels.slice(12 - period);
  const values = allValues.slice(12 - period);
  const max = 15;
  const width = 600, height = 220, bottom = 10, top = 8;
  const points = values.map((value, i) => ({
    x: 8 + i * ((width - 16) / Math.max(1, values.length - 1)),
    y: height - bottom - (value / max) * (height - top - bottom)
  }));
  const line = points.map((point, i) => `${i ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  const area = `${line} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  document.getElementById("revenueChart").innerHTML = `
    <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7866ec" stop-opacity=".2"/><stop offset="100%" stop-color="#7866ec" stop-opacity="0"/></linearGradient></defs>
    <path d="${area}" fill="url(#chartFill)"></path>
    <path d="${line}" fill="none" stroke="#7866ec" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>
    ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#fff" stroke="#7866ec" stroke-width="2" vector-effect="non-scaling-stroke"></circle>`).join("")}`;
  document.getElementById("chartLabels").innerHTML = labels.map(label => `<span>${label}</span>`).join("");
}

const dialog = document.getElementById("leadDialog");
function openDialog() {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}
function closeDialog() {
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.getElementById("leadSearch").addEventListener("input", () => { showAll = false; renderLeads(); });
document.getElementById("leadFilter").addEventListener("change", () => { showAll = false; renderLeads(); });
document.getElementById("showAllLeads").addEventListener("click", () => { showAll = !showAll; renderLeads(); });
document.getElementById("addLeadTop").addEventListener("click", openDialog);
document.getElementById("addLeadInline").addEventListener("click", openDialog);
document.getElementById("closeDialog").addEventListener("click", closeDialog);
document.getElementById("cancelDialog").addEventListener("click", closeDialog);
document.getElementById("revenuePeriod").addEventListener("change", event => drawChart(Number(event.target.value)));
document.getElementById("viewDeals").addEventListener("click", () => {
  document.getElementById("deals").scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("Your deal pipeline is up to date.");
});
document.getElementById("leadForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name")).trim();
  const company = String(form.get("company")).trim();
  const value = Number(form.get("value"));
  if (!name || !company || !Number.isFinite(value) || value < 0) return;
  const today = new Date();
  const date = today.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  leads.unshift({
    name, company, value, status: String(form.get("status")),
    email: String(form.get("email") || "").trim(),
    date, initials: initials(name), tone: ["purple", "green", "orange", "blue", "pink"][Math.floor(Math.random() * 5)]
  });
  event.currentTarget.reset();
  showAll = false;
  renderLeads();
  closeDialog();
  showToast(`${name} was added to your leads.`);
});

document.getElementById("mobileMenu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => document.getElementById("sidebar").classList.remove("open")));

renderLeads();
drawChart(6);
