function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
}
export function findBestMatch(input, candidates) {
    if (!candidates || candidates.length === 0)
        return null;
    let bestMatch = null;
    let minDistance = Infinity;
    for (const candidate of candidates) {
        const distance = levenshteinDistance(input, candidate);
        const threshold = candidate.length < 4 ? 1 : 3;
        if (distance < minDistance && distance <= threshold) {
            minDistance = distance;
            bestMatch = candidate;
        }
    }
    return bestMatch;
}
//# sourceMappingURL=FuzzyMatcher.js.map