const { ipcRenderer } = require("electron");

document
	.getElementById("loginForm")
	.addEventListener("submit", async (event) => {
		event.preventDefault();

		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;

		try {
			const response = await ipcRenderer.invoke("login", { email, password });
			const token = response.token;
			const role = response.role;

			if (role !== "admin") {
				alert("Access denied. Admin role required.");
				return;
			}

			localStorage.setItem("token", token);

			window.location.href = "admin-dashboard.html";
		} catch (error) {
			console.error("Login error:", error);
			alert("Invalid email or password");
		}
	});
