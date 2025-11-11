# Rotas Removidas do AgroISync

## Rotas Duplicadas Removidas
1. `/about` -> use `/sobre`
2. `/plans` -> use `/planos`
3. `/contact` -> use `/contato`
4. `/store` -> use `/loja`
5. `/weather` -> use `/clima`
6. `/supplies` -> use `/insumos`

## Rotas Antigas/Descontinuadas Removidas
1. `/marketplace/*` -> redirecionado para `/produtos/*`
2. `/agroconecta/*` -> redirecionado para `/frete/*`
3. `/signup/old` -> use `/signup`
4. `/api-key` -> use `/api`
5. `/clima-insumos` -> use `/clima`

## Rotas de Teste/Desenvolvimento Removidas
1. `/tecnologia` -> use `/crypto`
2. `/usuario-geral` -> removida (não utilizada)
3. `/signup/type` -> fluxo descontinuado
4. `/signup/general` -> use `/signup/unified`

## Próximos Passos
1. Atualize todos os links internos para usar as novas rotas
2. Atualize a documentação para refletir apenas as rotas ativas
3. Configure redirecionamentos 301 para as rotas antigas por 3 meses
4. Monitore o tráfego para garantir que não há links quebrados