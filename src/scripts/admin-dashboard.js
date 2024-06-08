const axios = require("axios");

fetch("http://localhost:3000/api/users/count")
	.then((response) => response.json())
	.then((data) => {
		document.getElementById("total-users").textContent = data.count;
	});

async function getAdminHistories() {
	try {
		const response = await axios.get(
			"http://localhost:3000/api/admin-history",
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error retrieving admin histories:", error);
		throw error;
	}
}
async function getAdminInfo() {
	try {
		const response = await axios.get(
			`http://localhost:3000/api/users/profile`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error retrieving admin info:", error);
		throw error;
	}
}

async function renderAdminHistories() {
	const adminHistories = await getAdminHistories();
	const carouselElement = document.getElementById("actions-carousel");
	carouselElement.innerHTML = "";

	const adminInfo = await getAdminInfo();

	adminHistories.sort((a, b) => b.timestamp - a.timestamp);

	// Prendre les 3 premières actions
	const recentActions = adminHistories.slice(0, 3);

	for (const action of recentActions) {
		const actionElement = document.createElement("div");
		actionElement.classList.add("action-item");

		const actionText = `L'admin ${adminInfo.name} ${
			adminInfo.firstname
		} a réalisé l'action ${action.action} le ${new Date(
			action.timestamp
		).toLocaleString()}`;

		let affectedDataText = "";

		if (action.action === "update") {
			affectedDataText = `Données affectées : 
			- Anciennes données :
			  - ID : ${action.affectedData.old.id}
			  - Nom : ${action.affectedData.old.name} 
			  - Rôle : ${action.affectedData.old.role}
			  - Email : ${action.affectedData.old.email}
			  - Campus : ${action.affectedData.old.campus}
			  - Mot de passe : ${action.affectedData.old.password}
			  - Date de création : ${new Date(
					action.affectedData.old.createdAt
				).toLocaleString()}
			- Nouvelles données :
			  - ID : ${action.affectedData.new.id}
			  - Nom : ${action.affectedData.new.name} 
			  - Rôle : ${action.affectedData.new.role}
			  - Email : ${action.affectedData.new.email}
			  - Campus : ${action.affectedData.new.campus}
			  - Mot de passe : ${action.affectedData.new.password}
			  - Date de création : ${new Date(
					action.affectedData.new.createdAt
				).toLocaleString()}`;
		} else {
			affectedDataText = `Données affectées : 
			- ID : ${action.affectedData.id}
			- Nom : ${action.affectedData.name} 
			- Rôle : ${action.affectedData.role}
			- Email : ${action.affectedData.email}
			- Campus : ${action.affectedData.campus}
			- Mot de passe : ${action.affectedData.password}
			- Date de création : ${new Date(
				action.affectedData.createdAt
			).toLocaleString()}`;
		}

		actionElement.innerHTML = `
		<p>${actionText}</p>
		<pre>${affectedDataText}</pre>
	  `;

		carouselElement.appendChild(actionElement);
	}
}

renderAdminHistories();
