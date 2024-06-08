// scripts/students.js
const axios = require("axios");

let currentPage = 1;
let totalPages = 1;

async function getStudents(page = 1) {
	try {
		const response = await axios.get(
			`http://localhost:3000/api/users/profiles?page=${page}`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
		);
		currentPage = response.data.currentPage;
		totalPages = response.data.totalPages;
		return response.data.users;
	} catch (error) {
		console.error("Error retrieving students:", error);
		throw error;
	}
}

async function updateStudent(studentId, updatedData) {
	try {
		await axios.put(
			`http://localhost:3000/api/admin-history/users/${studentId}`,
			updatedData,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
		);
		await renderStudents(currentPage);
	} catch (error) {
		console.error("Error updating student:", error);
		throw error;
	}
}

async function deleteStudent(studentId) {
	try {
		await axios.delete(
			`http://localhost:3000/api/admin-history/users/${studentId}`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
		);
		await renderStudents(currentPage);
	} catch (error) {
		console.error("Error deleting student:", error);
		throw error;
	}
}

async function renderStudents(page = 1) {
	const students = await getStudents(page);
	const tableBody = document.querySelector("#studentTable tbody");
	tableBody.innerHTML = "";

	students.forEach((student) => {
		const row = document.createElement("tr");
		row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.firstname}</td>
      <td>${student.email}</td>
      <td>${student.campus}</td>
      <td>
        <button class="editButton" data-id="${student.id}">Edit</button>
        <button class="deleteButton" data-id="${student.id}">Delete</button>
      </td>
    `;
		tableBody.appendChild(row);
	});

	// Mettre à jour l'état des boutons de pagination
	document.getElementById("prevButton").disabled = currentPage === 1;
	document.getElementById("nextButton").disabled = currentPage === totalPages;
	document.getElementById(
		"pageInfo"
	).textContent = `Page ${currentPage} sur ${totalPages}`;
}

document.addEventListener("click", async (event) => {
	if (event.target.classList.contains("editButton")) {
		const studentId = event.target.dataset.id;
		const student = await getStudentById(studentId);
		showEditModal(student);
	}

	if (event.target.classList.contains("deleteButton")) {
		const studentId = event.target.dataset.id;
		if (confirm("Are you sure you want to delete this student?")) {
			await deleteStudent(studentId);
		}
	}

	if (event.target.id === "prevButton") {
		if (currentPage > 1) {
			await renderStudents(currentPage - 1);
		}
	}

	if (event.target.id === "nextButton") {
		if (currentPage < totalPages) {
			await renderStudents(currentPage + 1);
		}
	}
});

async function getStudentById(studentId) {
	try {
		const response = await axios.get(
			`http://localhost:3000/api/users/profiles?page=${currentPage}`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
		);
		const students = response.data.users;
		return students.find((student) => student.id === parseInt(studentId));
	} catch (error) {
		console.error("Error retrieving student:", error);
		throw error;
	}
}

function showEditModal(student) {
	const modal = document.getElementById("editModal");
	document.getElementById("studentId").value = student.id;
	document.getElementById("studentName").value = student.name;
	document.getElementById("studentFirstname").value = student.firstname;
	document.getElementById("studentEmail").value = student.email;
	document.getElementById("studentCampus").value = student.campus;
	modal.style.display = "block";
}

const modal = document.getElementById("editModal");
const closeButton = document.querySelector(".close-button");

closeButton.addEventListener("click", () => {
	modal.style.display = "none";
});

window.addEventListener("click", (event) => {
	if (event.target == modal) {
		modal.style.display = "none";
	}
});

document
	.getElementById("editForm")
	.addEventListener("submit", async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const updatedData = Object.fromEntries(formData.entries());
		await updateStudent(
			document.getElementById("studentId").value,
			updatedData
		);
		modal.style.display = "none";
	});

renderStudents();
