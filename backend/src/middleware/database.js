// Middleware para injetar o banco de dados D1 nas requisições
export const injectDatabase = (env) => {
  return (req, res, next) => {
    req.db = env.DB;
    next();
  };
};
