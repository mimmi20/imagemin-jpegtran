import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import isJpg from 'is-jpg';
import isProgressive from 'is-progressive';
import test from 'ava';
import imageminJpegtran from './index.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

test('optimize a JPG', async t => {
	const data = await fs.readFile(path.join(__dirname, 'fixture.jpg'));
	const resultData = await imageminJpegtran()(data);
	t.true(resultData.length < data.length);
	t.true(isJpg(resultData));
});

test('throw error when a JPG is corrupt', async t => {
	const data = await fs.readFile(path.join(__dirname, 'fixture-corrupt.jpg'));

	await t.throwsAsync(async () => {
		await imageminJpegtran()(data);
	}, {
		message: /Corrupt JPEG data/,
	});
});

test('progressive option', async t => {
	const data = await fs.readFile(path.join(__dirname, 'fixture.jpg'));
	const resultData = await imageminJpegtran({progressive: true})(data);
	t.true(isProgressive.buffer(resultData));
});
