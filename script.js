import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, doc,
  updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { firebaseConfig } from "./firebase-config.js";

const dateLine   = document.getElementById("dateLine");
const addForm    = document.getElementById("addForm");
const taskInput  = document.getElementById("taskInput");
const taskList   = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const countLine  = document.getElementById("countLine");
const clearDone  = document.getElementById("clearDone");
const statusLine = document.getElementById("statusLine");

dateLine.textContent = new Date().toLocaleDateString("en-IN", {
  weekday: "long", day: "numeric", month: "long", year: "numeric"
});

const esc = (s) => s.replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let tasksRef = null;
let cache = [];

const notConfigured = Object.values(firebaseConfig)
  .some((v) => typeof v === "string" && v.startsWith("PASTE_"));

if (notConfigured) {
  statusLine.textContent = "Add your Firebase config to firebase-config.js, then reload — the app works fully offline of the cloud until then.";
} else {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  tasksRef = collection(db, "tasks");

  onSnapshot(
    query(tasksRef, orderBy("createdAt", "desc")),
    (snap) => {
      cache = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      render();
      statusLine.textContent = "Synced live with Firestore.";
    },
    () => {
      statusLine.textContent = "Couldn't reach Firestore — check your config values and security rules.";
    }
  );
}

function render() {
  taskList.innerHTML = "";
  const open = cache.filter((t) => !t.done).length;
  const done = cache.length - open;

  emptyState.classList.toggle("hidden", cache.length > 0);
  clearDone.classList.toggle("hidden", done === 0);
  countLine.textContent = cache.length
    ? `${open} open · ${done} done`
    : "";

  for (const t of cache) {
    const li = document.createElement("li");
    if (t.done) li.classList.add("done");
    li.innerHTML = `
      <button class="check" data-act="toggle" data-id="${t.id}" aria-label="toggle done"></button>
      <span class="label">${esc(t.text || "")}</span>
      <button class="del" data-act="del" data-id="${t.id}" aria-label="delete">×</button>`;
    taskList.appendChild(li);
  }
}

taskList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn || !tasksRef) return;
  const ref = doc(tasksRef, btn.dataset.id);
  if (btn.dataset.act === "toggle") {
    const t = cache.find((x) => x.id === btn.dataset.id);
    await updateDoc(ref, { done: !t?.done });
  } else if (btn.dataset.act === "del") {
    await deleteDoc(ref);
  }
});

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  if (!tasksRef) {
    statusLine.textContent = "Add your Firebase config first — tasks can't sync yet.";
    return;
  }
  taskInput.value = "";
  await addDoc(tasksRef, { text, done: false, createdAt: serverTimestamp() });
});

clearDone.addEventListener("click", async () => {
  if (!tasksRef) return;
  await Promise.all(cache.filter((t) => t.done).map((t) => deleteDoc(doc(tasksRef, t.id))));
});
