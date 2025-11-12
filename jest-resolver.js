// jest-resolver.js
import { resolve as defaultResolve } from 'jest-resolve';

export default function (path, options) {
  // If the path ends with .js, try without it
  if (path.endsWith('.js')) {
    const pathWithoutExt = path.slice(0, -3);
    try {
      return defaultResolve(pathWithoutExt, options);
    } catch (e) {
      // If that fails, try with .js
    }
  }
  
  // Default resolution
  return defaultResolve(path, options);
}