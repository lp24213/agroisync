-- Validar integridade do banco AgroSync
-- Rodar manualmente no D1 Studio ou via wrangler

-- Verifica tabelas essenciais
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'freights', COUNT(*) FROM freights
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions;

-- Verifica integridade das referências
SELECT 'Produtos sem usuário' as check_type, COUNT(*) as count 
FROM products p 
LEFT JOIN users u ON p.user_id = u.id 
WHERE u.id IS NULL;

SELECT 'Mensagens sem usuário origem' as check_type, COUNT(*) as count
FROM messages m
LEFT JOIN users u ON m.from_user_id = u.id
WHERE u.id IS NULL;

SELECT 'Mensagens sem usuário destino' as check_type, COUNT(*) as count
FROM messages m
LEFT JOIN users u ON m.to_user_id = u.id
WHERE u.id IS NULL;

-- Verifica dados inválidos
SELECT 'E-mails duplicados' as check_type, email, COUNT(*) as count
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

SELECT 'CPFs duplicados' as check_type, cpf, COUNT(*) as count
FROM users 
WHERE cpf IS NOT NULL
GROUP BY cpf 
HAVING COUNT(*) > 1;

SELECT 'CNPJs duplicados' as check_type, cnpj, COUNT(*) as count
FROM users 
WHERE cnpj IS NOT NULL
GROUP BY cnpj 
HAVING COUNT(*) > 1;

-- Verifica produtos com preço ou quantidade inválida
SELECT 'Produtos com preço inválido' as check_type, COUNT(*) as count
FROM products
WHERE price <= 0 OR price IS NULL;

SELECT 'Produtos com quantidade inválida' as check_type, COUNT(*) as count
FROM products
WHERE quantity < 0;