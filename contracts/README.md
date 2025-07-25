# AGROTM Smart Contracts

## Solidity (ERC20/ERC721)

### Deploy (Remix ou Hardhat)

1. Compile AGROTM.sol
2. Deploy AGROTMToken (ERC20)
3. Deploy AGROTMNFT (ERC721)
4. Salve os endereços para integração no backend/frontend

### Verificação

- Use Etherscan para verificar o contrato após deploy

### Integração

- Use os ABIs e endereços nos arquivos .env e integração backend/frontend

---

## Anchor (Solana Staking)

### Deploy

1. Instale Anchor: `cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked`
2. Compile: `anchor build`
3. Deploy: `anchor deploy`
4. Salve o programId para integração

### Integração

- Use o programId e instruções Anchor para integração com frontend/backend

---

## PT-BR

Veja instruções acima em inglês. Para dúvidas, consulte a documentação oficial do Solidity, OpenZeppelin e Anchor.

---

## 中文

deploy、验证和集成请参考上方英文说明。如有疑问请查阅Solidity、OpenZeppelin和Anchor官方文档。
