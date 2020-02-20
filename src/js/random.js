const generateRandomIdString = prefix => Math.random().toString(36).replace('0.', prefix || '');

export default generateRandomIdString;
