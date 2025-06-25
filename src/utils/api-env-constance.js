const envString = uni.getStorageSync('api-env');
const env = envString ? envString.substr(1, envString.length - 2) : 'com';

export const apiUrl = (env !== 'com' ? 'https://httpbin.org' : 'https://httpbin.org');

export const ossSignUrl = (env !== 'com' ? 'https://httpbin.org' : 'https://httpbin.org');

export const ossUrl = (env !== 'com' ? 'https://httpbin.org' : 'https://httpbin.org');

export const uploadedUrl = (env !== 'com' ? 'https://httpbin.org' : 'https://httpbin.org');
