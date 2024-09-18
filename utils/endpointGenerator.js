const generateUniqueEndpoint = async () => {
  const { customAlphabet } = await import('nanoid');
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);
  return nanoid();
}

module.exports = generateUniqueEndpoint;