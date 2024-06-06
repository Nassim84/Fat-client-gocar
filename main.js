const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	win.loadFile(path.join(__dirname, "src/views/login.html"));
}

ipcMain.handle("login", async (event, { email, password }) => {
	try {
		const response = await axios.post("http://localhost:3000/api/auth/login", {
			email,
			password,
		});
		return response.data;
	} catch (error) {
		throw new Error("Invalid email or password");
	}
});

app.whenReady().then(createWindow);
