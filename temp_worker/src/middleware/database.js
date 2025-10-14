// Middleware para injetar o banco de dados D1 nas requisiÃ§Ãµes
export const injectDatabase = env => {
  return (req, res, next) => {
    // [AGROISYNC_FIX] Usar binding AGROISYNC_DB conforme definido no wrangler.toml.
    // Evita erro "Couldn't find a D1 DB with the name ou binding" quando binding não coincide.
    req.db = env.AGROISYNC_DB || env.DB;
    next();
  };
};
