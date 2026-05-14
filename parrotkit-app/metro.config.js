const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

const existingEnhanceMiddleware = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware, server) => {
  const enhancedMiddleware = existingEnhanceMiddleware
    ? existingEnhanceMiddleware(middleware, server)
    : middleware;

  return (req, res, next) => {
    const requestUrl = req.url ?? '';
    const pathname = requestUrl.split('?')[0];

    if (pathname === '/assets/recipe-create' || pathname.startsWith('/assets/recipe-create/')) {
      res.statusCode = 204;
      res.end();
      return;
    }

    return enhancedMiddleware(req, res, next);
  };
};

module.exports = withNativeWind(config, { input: './global.css' });
