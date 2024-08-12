import 'dotenv/config';
import { create } from 'xmlbuilder';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const BASE_URL = process.env.VITE_BASE_URL;
const WEBSITE_URL = process.env.VITE_WEBSITE_URL;

const config = {
	baseUrl: WEBSITE_URL,
	changeFreq: {
		root: 'daily',
		contributors: 'weekly',
		recipes: 'weekly',
		users: 'weekly'
	},
	priority: {
		root: '1.0',
		contributors: '0.8',
		recipes: '0.8',
		users: '0.8'
	}
};

function generateSitemap(recipes, users) {
	const urlset = create('urlset', { version: '1.0', encoding: 'UTF-8' })
		.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

	const addUrl = (loc, lastmod, changefreq, priority) => {
		urlset.ele('url')
			.ele('loc', loc).up()
			.ele('lastmod', lastmod).up()
			.ele('changefreq', changefreq).up()
			.ele('priority', priority).up();
	};

	// Add root path
	addUrl(`${config.baseUrl}/`, new Date().toISOString(), config.changeFreq.root, config.priority.root);
	addUrl(`${config.baseUrl}/contributors`, new Date().toISOString(), config.changeFreq.contributors, config.priority.contributors);
	recipes.forEach(recipe => {
		addUrl(`${config.baseUrl}/recipe/${recipe.rid}`, new Date(recipe.time_last_modified).toISOString(), config.changeFreq.recipes, config.priority.recipes);
	});
	users.forEach(user => {
		addUrl(`${config.baseUrl}/user/${user.username}`, new Date().toISOString(), config.changeFreq.users, config.priority.users);
	});

	return urlset.end({ pretty: true });
}

async function generateSitemapFile() {
	try {
		const recipes = await getRecipes();
		const users = await getUsers();
		const sitemap = generateSitemap(recipes, users);
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const filePath = path.join(__dirname, '..', 'sitemap.xml');
		fs.writeFileSync(filePath, sitemap);
	} catch (error) {
		console.error('Error generating sitemap:', error);
	}
}

function generateRobotsTxt() {
	const disallowedRoutes = config.disallowedRoutes.map(route => `Disallow: ${route}`).join('\n');
	return `User-agent: *
	${disallowedRoutes}

	Sitemap: ${config.baseUrl}/sitemap.xml`;
}

const convertRecipeDates = (recipe) => {
	recipe.time_last_modified = new Date(recipe.time_last_modified);
	return recipe;
};

const getRecipes = () => {
	return axios.get(`${BASE_URL}/recipes`)
		.then(response => response.data.map(convertRecipeDates))
		.catch(error => {
			console.error('Error fetching recipes', error);
			return [];
		});
};

const getUsers = () => {
	return axios.get(`${BASE_URL}/users`)
		.then(response => response.data)
		.catch(error => {
			console.error('Error fetching users', error);
			return [];
		});
};

generateSitemapFile();