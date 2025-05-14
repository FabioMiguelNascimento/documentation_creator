export const fileNameUtils = {
  sanitizeFileName(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },

  getUniqueFileName(fileName: string, existingNames: string[]): string {
    const base = this.sanitizeFileName(fileName);
    let result = base;
    let counter = 1;

    while (existingNames.includes(result)) {
      result = `${base}-${counter}`;
      counter++;
    }

    return result;
  },

  normalize(fileName: string = ''): string {
    if (!fileName) return '';
    
    const specialCharsMap: { [key: string]: string } = {
      'ç': 'c',
      'á': 'a',
      'à': 'a',
      'ã': 'a',
      'â': 'a',
      'é': 'e',
      'ê': 'e',
      'í': 'i',
      'ó': 'o',
      'ô': 'o',
      'õ': 'o',
      'ú': 'u',
      'ü': 'u',
      'ñ': 'n'
    };

    return String(fileName)
      .normalize('NFD')
      .toLowerCase()
      .split('')
      .map(char => specialCharsMap[char] || char)
      .join('')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  },

  sanitizeForUrl(text: string): string {
    return this.normalize(text);
  }
};

