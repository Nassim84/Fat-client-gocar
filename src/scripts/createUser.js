document
	.getElementById("createUserForm")
	.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = {
			firstname: document.getElementById("firstname").value,
			name: document.getElementById("name").value,
			email: document.getElementById("email").value,
			role: document.getElementById("role").value,
			campus: document.getElementById("campus").value,
		};

		try {
			const response = await fetch(
				"http://localhost:3000/api/admin-history/users",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store token in localStorage
					},
					body: JSON.stringify(formData),
				}
			);

			if (response.ok) {
				const user = await response.json();
				alert("User created successfully!");
				// Optionally, redirect or update the UI
			} else {
				const error = await response.json();
				alert(`Error: ${error.message}`);
			}
		} catch (error) {
			console.error("Error creating user:", error);
			alert("Server error. Please try again later.");
		}
	});
