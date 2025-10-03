// Middleware para injetar o banco de dados D1 nas requisiÃ§Ãµes
export const injectDatabase = env => {
  return (req, res, next) => {
    req.db = env.DB;
    next();
  };
};
