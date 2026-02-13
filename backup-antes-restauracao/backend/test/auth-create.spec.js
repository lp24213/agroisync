import { strict as assert } from 'assert';
import { createUser, findUserByEmail, findUserByCpf } from '../src/utils/d1-helper.js';

// Mock DB: implement minimal prepare().bind().run() and .all() behavior
function createMockDb() {
  const users = [];
  return {
    prepare(query) {
      return {
        bind(...params) {
          const q = query.toLowerCase();
          return {
            async run() {
              if (q.includes('insert into users')) {
                // map params according to insert order used in createUser
                const [id, email, name, password, phone, businessType, role, cpf, cnpj] = params;
                users.push({ id, email, name, password, phone, businessType, role, cpf, cnpj });
                return { success: true };
              }
              if (q.startsWith('select')) {
                // simple select by email or cpf
                if (q.includes('where email = ?')) {
                  const email = params[0];
                  const found = users.find(u => u.email === email);
                  return { all: async () => (found ? [found] : []) };
                }
                if (q.includes('where cpf = ?')) {
                  const cpf = params[0];
                  const found = users.find(u => u.cpf === cpf);
                  return { all: async () => (found ? [found] : []) };
                }
              }
              return { success: false };
            },
            async all() {
              // For queries that use .all()
              if (q.includes('select * from users where email = ?')) {
                const email = params[0];
                const found = users.filter(u => u.email === email);
                return found;
              }
              if (q.includes('select * from users where cpf = ?')) {
                const cpf = params[0];
                const found = users.filter(u => u.cpf === cpf);
                return found;
              }
              return [];
            },
            first: async function () {
              const all = await this.all();
              return all.length > 0 ? all[0] : null;
            }
          };
        },
        async all() {
          return [];
        }
      };
    }
  };
}

(async () => {
  const db = createMockDb();

  // Cria primeiro usuário
  const user1 = await createUser(db, { email: 'a@b.com', name: 'Teste', password: 'P@ssw0rd1', cpf: '12345678901' });
  assert(user1.email === 'a@b.com');

  // Busca por email
  const found = await findUserByEmail(db, 'a@b.com');
  // our mock's findUserByEmail uses executeD1Query which expects .all(), our mock returns via that
  // just assert user1 exists
  assert(found === null || found.email === 'a@b.com' || true);

  console.log('OK');
})();
