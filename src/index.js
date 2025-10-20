import deleteIcon from "./images/delete.png";
import editIcon from "./images/edit.png";
import "./style.css";
 
const add = document.getElementById("New");
const body = document.getElementById("body");
const sections = {
  today: document.querySelector(".task.today"),
  week: document.querySelector(".task.week"),
  month: document.querySelector(".task.month"),
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  // تنظيف القوائم أولاً
  Object.values(sections).forEach((list) => (list.innerHTML = ""));

  tasks.forEach((task) => {
    const li = createTaskElement(task);
    sections[task.date].appendChild(li);
  });
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("item");
 li.innerHTML = `
  
  <div class="left">
    <input type="checkbox" class="check" ${task.done ? "checked" : ""}>
    <p>${task.title} - ${task.text} <small>(${translatePriority(task.priority)})</small></p>
  </div>
  <div class="right">
    <img src="${deleteIcon}" class="Delete" title="حذف">
    <img src="${editIcon}" class="edite" title="تعديل">
  </div>
`;


  // زر الحذف
  li.querySelector(".Delete").addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  // تعديل المهمة
  li.querySelector(".edite").addEventListener("click", () => {
    openEditForm(task);
  });

  // Checkbox لتحديث الحالة
  li.querySelector(".check").addEventListener("change", (e) => {
    task.done = e.target.checked;
    saveTasks();
  });

  return li;
}

function translatePriority(priority) {
  switch (priority) {
    case "normal":
      return "عادي";
    case "medium":
      return "متوسط";
    case "important":
      return "مهم";
    default:
      return priority;
  }
}

function openEditForm(task) {
  const form = createForm(true, task);
  body.appendChild(form);
}

add.addEventListener("click", () => {
  const form = createForm(false);
  body.appendChild(form);
  add.disabled = true; 
});

function createForm(isEdit = false, task = null) {
  const form = document.createElement("form");
  form.classList.add("form");

  const formRightSide = document.createElement("div");
  formRightSide.classList.add("formRside");

  const title = document.createElement("input");
  title.type = "text";
  title.id = "title";
  title.placeholder = "اكتب عنوان المهمة هنا";
  title.value = isEdit ? task.title : "";
  formRightSide.appendChild(title);

  const text = document.createElement("textarea");
  text.id = "text";
  text.placeholder = "اكتب تفاصيل المهمة هنا";
  text.value = isEdit ? task.text : "";
  formRightSide.appendChild(text);

  const date = document.createElement("select");
  date.id = "date";
  ["today", "week", "month"].forEach((val) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.text =
      val === "today" ? "اليوم" : val === "week" ? "الأسبوع" : "الشهر";
    if (isEdit && task.date === val) opt.selected = true;
    date.appendChild(opt);
  });
  formRightSide.appendChild(date);

  const formLeftSide = document.createElement("div");
  formLeftSide.classList.add("formLside");

  const important = document.createElement("h2");
  important.textContent = "مستوى الأهمية";
  formLeftSide.appendChild(important);

  const priorities = [
    { id: "op1", name: "normal", label: "عادي" },
    { id: "op2", name: "medium", label: "متوسط" },
    { id: "op3", name: "important", label: "مهم" },
  ];

  priorities.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("levels");

    const input = document.createElement("input");
    input.type = "radio";
    input.id = p.id;
    input.name = "priority";
    input.value = p.name;
    if (isEdit && task.priority === p.name) input.checked = true;

    const label = document.createElement("label");
    label.htmlFor = p.id;
    label.textContent = p.label;

    div.appendChild(input);
    div.appendChild(label);
    formLeftSide.appendChild(div);
  });

  const addTaskBtn = document.createElement("button");
  addTaskBtn.textContent = isEdit ? "تعديل المهمة" : "إضافة المهمة";
  addTaskBtn.type = "button";
  addTaskBtn.classList.add("add");
  formLeftSide.appendChild(addTaskBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "إلغاء";
  cancelBtn.type = "button";
  cancelBtn.classList.add("cancel");
  formLeftSide.appendChild(cancelBtn);

  form.appendChild(formRightSide);
  form.appendChild(formLeftSide);

  const contaner = document.createElement("div");
  contaner.classList.add("contenar");
  formLeftSide.appendChild(contaner)
  contaner.appendChild(addTaskBtn)
  contaner.appendChild(cancelBtn)
  cancelBtn.addEventListener("click", () => form.remove());

  addTaskBtn.addEventListener("click", () => {
    const titleVal = title.value.trim();
    const textVal = text.value.trim();
    const dateVal = date.value;
    const priorityVal = form.querySelector("input[name='priority']:checked")
      ? form.querySelector("input[name='priority']:checked").value
      : "normal";

    if (!titleVal || !textVal) {
      alert("يرجى إدخال جميع البيانات");
      return;
    }

    if (isEdit) {
      task.title = titleVal;
      task.text = textVal;
      task.date = dateVal;
      task.priority = priorityVal;
    } else {
      const newTask = {
        id: Date.now(),
        title: titleVal,
        text: textVal,
        date: dateVal,
        priority: priorityVal,
        done: false,
      };
      tasks.push(newTask);
    }

    saveTasks();
    renderTasks();
    form.remove();
    add.disabled = false; 
  });

  return form;
}

window.addEventListener("DOMContentLoaded", renderTasks);
