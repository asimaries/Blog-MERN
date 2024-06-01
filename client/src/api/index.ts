import axios from 'axios';

import getGoogleOAuthURL from "./getGoogleOAuthURL";

const baseURL = `${import.meta.env.VITE_API_URL}`;
const axiosapi = axios.create({
	baseURL, headers: {
		'Content-Type': 'application/json',
	}, withCredentials: true
});
const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true
})

export function requestPrivate(url: string, options?: object) {
	return api(url, options)
		.then(res => res.data)
}

export function request(url: string, options?: object) {
	return axiosapi(url, options)
		.then(res => res.data)
		.catch(error => {
			// console.log(errorf)
			return Promise.reject(error || "error")
		})
}

// function getBlogs() {
// 	return request('/blog/allBlog')
// }

function getUserBlog(id: string) {
	return request(`/blog/allBlog/${id}`)
}

function signin({ account, password }: { account: string, password: string }) {
	return axiosapi.post('/auth/signin', { account, password }, {
		headers: {
			'Content-Type': 'application/json',
		}
	})
}

function getUserProfile() {
	api('/profile')
}

function getBlogs() {
	return request('/blog/allBlog')
}

export function getBlogById(id: string) {
	return requestPrivate(`/blog/${id}`)
}

// function getGoogleOAuthURL() { }
// export default api
export {
	getGoogleOAuthURL,
	api,
	axiosapi,
	getBlogs,
	getUserBlog,
	signin
}