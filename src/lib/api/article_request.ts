import { API_BASE_URL, type BaseResponse, handleError } from './config';

import axios from 'axios';
import type { ApiArticle, ApiArticleDetail } from './response_schema';
import type { UpdateArticleSchema } from './request_schema';

export interface ArticleCountData {
	count: number;
}

export async function getArticleCount(): Promise<BaseResponse<ArticleCountData>> {
	return await axios
		.get(`${API_BASE_URL}/article/count`)
		.then(function (response) {
			return response.data;
		})
		.catch(handleError);
}

export async function getArticleCountThisWeek(): Promise<BaseResponse<ArticleCountData>> {
	return await axios
		.get(`${API_BASE_URL}/article/count/this_week`)
		.then(function (response) {
			return response.data;
		})
		.catch(handleError);
}

export async function createArticle(
	title: string,
	content: string | null,
	chapter_id: string
): Promise<BaseResponse<ApiArticle>> {
	const data = {
		title: title,
		content: content || title,
		chapter_id: chapter_id
	};

	console.debug("createArticle", data);

	const config = {
		method: 'post',
		url: API_BASE_URL + '/article/one',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('token')
		},
		data: data
	};

	return axios(config)
		.then(function (response) {
			console.log(JSON.stringify(response.data));
			return response.data;
		})
		.catch(function (error) {
			console.log(error);
			return handleError(error);
		});
}

export async function removeArticle(article_id: string): Promise<BaseResponse<null>> {
	const config = {
		method: 'delete',
		url: API_BASE_URL + '/article/one/' + article_id,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('token')
		}
	};
	return await axios(config)
		.then(function (response) {
			return response.data;
		})
		.catch(handleError);
}

export async function getArticleDetail(id: string): Promise<BaseResponse<ApiArticleDetail>> {
	const config = {
		method: 'get',
		url: `${API_BASE_URL}/article/one/${id}`
	};
	return await axios(config)
		.then(function (response) {
			return response.data;
		})
		.catch(handleError);
}

export async function updateArticleContent(updateArticleSchema: UpdateArticleSchema): Promise<BaseResponse<ApiArticle>> {
	const config = {
		method: 'patch',
		url: `${API_BASE_URL}/article/one/`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		data: updateArticleSchema
	};
	return axios(config)
		.then(function (response) {
			return response.data;
		})
		.catch(handleError);
}

export async function getPublicArticleList(
	page?: number,
	page_size?: number
): Promise<BaseResponse<ApiArticle[]>> {
	const params = new URLSearchParams();
	if (page !== undefined) params.append('page', String(page));
	if (page_size !== undefined) params.append('page_size', String(page_size));
	const url =
		`${API_BASE_URL}/article/public_list` + (params.toString() ? `?${params.toString()}` : '');
	return axios
		.get(url)
		.then(function (response) {
			return response.data;
		})
		.catch(handleError);
}
