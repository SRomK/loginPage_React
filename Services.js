import Axios from 'axios';
import { UploadActions } from './Constants';

// const URL_PREFIX = '/api2'; // FOR TEST ON PORT 8602
const URL_PREFIX = '/prwsw';
const TOKEN = 'token';

export default class Services {

	// WEB SERVICES
	static async get(url) {
		let token = this.getToken(); // FIXME SEND THE TOKEN IN AUTHORIZATION HEADER
		token = "955cea7218074a2bad1bd5a38cf2bd16"; 

		url = `${URL_PREFIX}/${url}`;
		if (window.location.href.indexOf('localhost') !== -1) 
			url = 'http://localhost' + url;
		const res = await Axios.get(url);

		return res;
	}
	static async post(url, data, callback) {
		let token = this.getToken();
		// token = "955cea7218074a2bad1bd5a38cf2bd16"; 

		url = `${URL_PREFIX}/${url}`;
		if (window.location.href.indexOf('localhost') !== -1) 
			url = 'http://localhost' + url;

		const res = await Axios({
			method: 'post',
			url,
			data,
			headers: { 'Authorization': token }
		});
		return callback(res.data);
	}
	static async postAsync(url, data) {
		let token = this.getToken()
		// token = "955cea7218074a2bad1bd5a38cf2bd16"; 

		url = `${URL_PREFIX}/${url}`;
		if (window.location.href.indexOf('localhost') !== -1) 
			url = 'http://localhost' + url;

		// console.log(url);

		try {
			const res = await Axios({
				method: 'post',
				url,
				data,
				headers: { 'Authorization': token }
			});

			// If we receive token not found we log out
			if (res.data.error === 'ERROR_TOKEN_NOT_FOUND') {
				console.error(url, data, res)				
				// this.logOut();
				return null;
			}

			return res.data;
		} catch (err) {
			return {status: 'error', error: err.message};
		}
	}
	static logOut() {
		let ev = new CustomEvent('logOut');
        window.dispatchEvent(ev);
	}
	static openPdf(url, data) {
		const token = this.getToken();
		url = `${URL_PREFIX}/${url}`;
		if (window.location.href.indexOf('localhost') !== -1) 
			url = 'http://localhost' + url;

		Axios({
			method: 'post',
			responseType: 'blob',
			url: url,
			data: data,
			headers: { 'Authorization': token }
		})
		.then(response => {
			// Check if there is an error
			if (response.data.type === 'application/json') {
				alert("Error loading the file");
				return;
			}

			//Create a Blob from the PDF Stream
			const file = new Blob([response.data], {type: 'application/pdf'});

			//Build a URL from the file 
			const fileURL = URL.createObjectURL(file);
			
			//Open the URL on new Window
			window.open(fileURL);
		})
		.catch(error => {
			console.log(error);
		});
	}
	/**
	 * 
	 * @param {File} file 
	 * @param {string} action 
	 * @param {number} id this is the id of the folder or of the aircraft or of the user
	 * @returns 
	 */
	static async uploadFile(file, action, id) {
		// Create FormData
		let data = new FormData();
		data.append('file', file);
		data.append('action', action);
		
		// By default we send the property "id", but for some actions we need to modify the id name
		let propertyName = "id";
		switch (action) {
			case UploadActions.UploadAircraftDocument:
				propertyName = "id_aircraft";
				break;
		}

		if (id !== undefined)
			data.append(propertyName, id);
		data.append('token', this.getToken());

		// URL
		let url = `${URL_PREFIX}/UploadFile`;
		if (window.location.href.indexOf('localhost') !== -1) 
			url = 'http://localhost' + url;

		// const config = {
		// 	headers: {
		// 		'content-type': 'multipart/form-data'
		// 	}
		// }
		// Axios.post(url, data, config);

		const res = await Axios({
			method: 'post',
			url,
			data,
			headers: { 
				'Content-Type': 'multipart/form-data',
				'Authorization': this.getToken() 
			}
		});

		return res.data;
	}
		/**
	 * The function of Adding Mail Documents create a temporary folder
	 * on the backend to temporary hold the document before we send it.
	 * When it is sent the file is taken and added into the mails folder.
	 * @param {file} file 
	 * @param {string} action -
	 * @param {id} id // -1 to create new file
	 * @param {docFolder} docFolder // " " To create new
	 */
	static async uploadFileFolder(file, action, id, docFolder) {
		let data = new FormData();
		data.append('file', file);
		data.append('action', action);
		data.append('id', id);
		data.append('doc_folder', docFolder);
		data.append('token', this.getToken());

		const token = this.getToken();
		let url = `${URL_PREFIX}/UploadFile`;
		if (window.location.href.indexOf('localhost') !== -1) 
			url = 'http://localhost' + url;

		const res = await Axios({ method: 'post', url, data, headers: { 'Content-Type': 'multipart/form-data','Authorization': token }});
		return res.data;
	}


	// LOCAL STORAGE
	static getToken() {
		// Look at local storage (if we clicked on remember)
		let token = localStorage.getItem(TOKEN);
		
		// Look a the session storage (we did not click on remember)
		if (token === null)
			token = sessionStorage.getItem(TOKEN);
		
		return token;
	}
}