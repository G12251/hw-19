const addressFilter = document.querySelector(".address-filter");
const addressSelect = document.querySelector(".address-select");
const studentForm = document.querySelector(".student-form");
const studentsTableBody = document.querySelector(".students-table tbody");
const studentModal = document.querySelector("#studentModal");
const addStudentBtn = document.querySelector(".add-student-btn");
const openModalBtn = document.querySelector(".open-modal-btn");
const searchStudent = document.querySelector(".search-student");

let studentsJson = localStorage.getItem(STUDENTS);
let students = JSON.parse(studentsJson) || [];

let selected = null;
let search = "";
let regions = localStorage.getItem(REGIONS) || "all";

addressFilter.innerHTML = `<option value='all'>All</option>`;

address.map((gr) => {
  addressFilter.innerHTML += `<option ${regions === gr ? 'selected' : ''} value="${gr}">${gr}</option>`;
  addressSelect.innerHTML += `<option value="${gr}">${gr}</option>`;
});

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
 
  if (this.checkValidity()) {
    let student = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      isMarried: this.isMarried.checked,
      position: this.position.value,
      salary: this.salary.value,
    };
    if (selected === null) {
      students.push(student);
    } else {
      students[selected] = student;
    }
    getStudents()
    bootstrap.Modal.getInstance(studentModal).hide();
    this.reset();
  } else {
    this.classList.add("was-validated");
  }
  localStorage.setItem("students", JSON.stringify(students));
  getStudents();
});

const getStudentRow = ({ firstName, lastName, address, isMarried , position, salary}, i) => {
  return `
    <tr>
      <td>${i + 1}</td>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${address}</td>
      <td>${isMarried ? "yes" : "no"}</td>
      <td>${position}</td>
      <td>${salary}</td>

      <td class="text-end">
        <button
          data-bs-toggle="modal"
          data-bs-target="#studentModal"
          class="btn btn-primary"
          onClick="editStudent(${i})"
        >
          Edit
        </button>
        <button class="btn btn-danger" onClick="deleteStudent(${i})">Delete</button>
      </td>
    </tr>
  `;
};

function getStudents() {
  let results = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search)
  );

  
  if (regions !== "all") {
    results = results.filter((student) => student.group === regions);
  }
  
  console.log(results)
  
  studentsTableBody.innerHTML = "";

  if (results.length !== 0) {
    results.map((student, i) => {
      studentsTableBody.innerHTML += getStudentRow(student, i);
    });
  } else {
    studentsTableBody.innerHTML = `
      <td colspan="6">
        <div class="text-center alert alert-primary" role="alert">
          No students !
        </div>
      </td>
    `;
  }
}

getStudents();

function deleteStudent(i) {
  let isDelete = confirm("Do you want to delete this student !");
  if (isDelete) {
    students.splice(i, 1);
    localStorage.setItem(STUDENTS, JSON.stringify(students));
    getStudents();
  }
}

function editStudent(i) {
  selected = i;
  let {firstName, lastName, address, isMarried , position, salary } = students[i];
  studentForm.firstName.value = firstName;
  studentForm.lastName.value = lastName;
  studentForm.address.value = address;
  studentForm.isMarried.checked = isMarried;
    studentForm.position.value = position;
    studentForm.salary.value = salary;
  addStudentBtn.textContent = "Save";
}

openModalBtn.addEventListener("click", () => {
  studentForm.reset();
  selected = null;
  addStudentBtn.textContent = "Add";
});

searchStudent.addEventListener("keyup", function () {
  search = this.value.trim().toLowerCase();
  getStudents();
});

addressFilter.addEventListener("change", function () {
  regions = this.value;
  localStorage.setItem(REGIONS, this.value);
  getStudents();
});