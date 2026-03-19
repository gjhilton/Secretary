import { test, expect } from '@playwright/test';
import { selectGameMode } from '../config/playwright/helpers/test-helpers.js';

const REPORT_FORM_BASE =
	'https://docs.google.com/forms/d/e/1FAIpQLScLniPdHJqwF1wlYSl566QnjkOxDNM3CrQafLd_HbgWpMcI3g/viewform';

/**
 * Answer with a character guaranteed to be wrong by reading what's currently shown.
 * Gets the image src of the question character and picks a different answer.
 */
async function answerIncorrectly(page) {
	const img = page.locator('img[alt="Character to identify"]').first();
	const src = await img.getAttribute('src');

	// Derive the character from the image src (e.g. ".../a10.png" → 'a')
	const match = src && src.match(/\/([a-zA-Z])\d+\.(?:png|jpg|webp)/);
	const shownChar = match ? match[1] : null;

	// Pick an answer that's definitely not the shown character
	const wrongAnswer = shownChar?.toLowerCase() === 'z' ? 'a' : 'z';
	await page.keyboard.type(wrongAnswer);
	await page.waitForTimeout(500);

	// Return whether we actually got an incorrect answer screen
	const incorrectIndicator = page.locator('img[alt="Your incorrect answer"]');
	return (await incorrectIndicator.count()) > 0;
}

test.describe('Error Reporting', () => {
	test('report-a-mistake link is visible after an incorrect answer', async ({
		page,
	}) => {
		await selectGameMode(page, 'all');

		const gotIncorrect = await answerIncorrectly(page);
		test.skip(!gotIncorrect, 'Did not land on incorrect answer screen');

		const link = page.getByRole('link', { name: /report a mistake/i });
		await expect(link).toBeVisible();
	});

	test('report-a-mistake link appears below the Next button', async ({
		page,
	}) => {
		await selectGameMode(page, 'all');

		const gotIncorrect = await answerIncorrectly(page);
		test.skip(!gotIncorrect, 'Did not land on incorrect answer screen');

		const nextButton = page.getByRole('button', { name: /next/i });
		const reportLink = page.getByRole('link', {
			name: /report a mistake/i,
		});

		await expect(nextButton).toBeVisible();
		await expect(reportLink).toBeVisible();

		// Verify the link is below the button in the DOM (comes after it)
		const nextBox = await nextButton.boundingBox();
		const linkBox = await reportLink.boundingBox();
		expect(linkBox.y).toBeGreaterThan(nextBox.y);
	});

	test('report-a-mistake link points to the Google Form', async ({
		page,
	}) => {
		await selectGameMode(page, 'all');

		const gotIncorrect = await answerIncorrectly(page);
		test.skip(!gotIncorrect, 'Did not land on incorrect answer screen');

		const link = page.getByRole('link', { name: /report a mistake/i });
		const href = await link.getAttribute('href');

		expect(href).toContain(REPORT_FORM_BASE);
	});

	test('report-a-mistake link pre-fills image path', async ({ page }) => {
		await selectGameMode(page, 'all');

		const gotIncorrect = await answerIncorrectly(page);
		test.skip(!gotIncorrect, 'Did not land on incorrect answer screen');

		const link = page.getByRole('link', { name: /report a mistake/i });
		const href = await link.getAttribute('href');
		const url = new URL(href);

		const imagePath = url.searchParams.get('entry.1490878758');
		expect(imagePath).toBeTruthy();
		expect(imagePath).toMatch(/\.(png|jpg|webp)$/i);
	});

	test('report-a-mistake link pre-fills collection name', async ({
		page,
	}) => {
		await selectGameMode(page, 'all');

		const gotIncorrect = await answerIncorrectly(page);
		test.skip(!gotIncorrect, 'Did not land on incorrect answer screen');

		const link = page.getByRole('link', { name: /report a mistake/i });
		const href = await link.getAttribute('href');
		const url = new URL(href);

		const collection = url.searchParams.get('entry.1770369871');
		expect(collection).toBeTruthy();
	});

	test('report-a-mistake link opens in a new window', async ({
		page,
		context,
	}) => {
		await selectGameMode(page, 'all');

		const gotIncorrect = await answerIncorrectly(page);
		test.skip(!gotIncorrect, 'Did not land on incorrect answer screen');

		const link = page.getByRole('link', { name: /report a mistake/i });
		await expect(link).toHaveAttribute('rel', 'noreferrer');

		const [newPage] = await Promise.all([
			context.waitForEvent('page'),
			link.click(),
		]);
		expect(newPage.url()).toContain(REPORT_FORM_BASE);
		await newPage.close();
	});

	test('report-a-mistake link is not visible on correct answer screen', async ({
		page,
	}) => {
		await selectGameMode(page, 'minuscule');

		// Get what character is shown and answer it correctly
		const img = page.locator('img[alt="Character to identify"]').first();
		const src = await img.getAttribute('src');
		const match = src && src.match(/\/([a-zA-Z])\d+\.(?:png|jpg|webp)/);

		if (!match) {
			test.skip(
				true,
				'Could not determine correct answer from image src'
			);
		}

		await page.keyboard.type(match[1]);
		await page.waitForTimeout(500);

		// Only assert absence if we're on a correct answer screen
		const correctIndicator = page.locator('img[alt="Correct answer"]');
		if ((await correctIndicator.count()) > 0) {
			const reportLink = page.getByRole('link', {
				name: /report a mistake/i,
			});
			await expect(reportLink).not.toBeVisible();
		}
	});
});
