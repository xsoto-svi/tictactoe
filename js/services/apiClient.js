export class ApiClient {
	constructor(baseURL = '') {
		this.baseURL = baseURL;
	}

	async request(path, options = {}) {
		const url = `${this.baseURL}${path}`;

		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			}
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}

		return this.parseResponse(response);
	}

	async parseResponse(response) {
		const contentType = response.headers.get("content-type");

		if (contentType?.includes("application/json")) {
			return response.json();
		}

		return response.text();
	}

	get(path, options = {}) {
		return this.request(path, {
			...options,
			method: "GET",
		});
	}

	post(path, body, options = {}) {
		return this.request(path, {
			...options,
			method: "POST",
			body: JSON.stringify(body),
		});
	}

	put(path, body, options = {}) {
		return this.request(path, {
			...options,
			method: "PUT",
			body: JSON.stringify(body),
		});
	}

	patch(path, body, options = {}) {
		return this.request(path, {
			...options,
			method: "PATCH",
			body: JSON.stringify(body),
		});
	}

	delete(path, options = {}) {
		return this.request(path, {
			...options,
			method: "DELETE",
		});
	}
}
