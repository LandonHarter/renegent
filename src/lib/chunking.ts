export function chunkText(
	text: string,
	chunkSize: number = 1000,
	overlap: number = 200
) {
	const chunks = [];
	for (let i = 0; i < text.length; i += chunkSize - overlap) {
		chunks.push(text.slice(i, i + chunkSize));
	}
	return chunks;
}
