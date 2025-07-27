import fs from 'fs';

const onboardingSteps = [
  '1. Instale dependências: npm install',
  '2. Configure o .env.local com as variáveis do MongoDB',
  '3. Inicie o MongoDB local ou configure Atlas',
  '4. Rode o seed: npx ts-node scripts/seed-mongodb.ts',
  '5. Execute npm run dev para iniciar o Next.js',
  '6. Acesse /api/test-mongodb para healthcheck',
  '7. Teste endpoints usando Swagger UI ou Postman',
  '8. Acesse /api/metrics para métricas Prometheus',
  '9. Importe monitoring/grafana-dashboard.json no Grafana',
  '10. Integre Sentry para rastreamento de erros',
];

fs.writeFileSync('ONBOARDING_STEPS.txt', onboardingSteps.join('\n'));
console.log('Arquivo ONBOARDING_STEPS.txt criado com sucesso!');
