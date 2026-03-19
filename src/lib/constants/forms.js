const REPORT_FORM_BASE =
	'https://docs.google.com/forms/d/e/1FAIpQLScLniPdHJqwF1wlYSl566QnjkOxDNM3CrQafLd_HbgWpMcI3g/viewform';

export const reportMistakeUrl = ({ imagePath, collection }) => {
	const params = new URLSearchParams({
		usp: 'pp_url',
		'entry.1490878758': imagePath ?? '',
		'entry.1770369871': collection ?? '',
	});
	return `${REPORT_FORM_BASE}?${params.toString()}`;
};
