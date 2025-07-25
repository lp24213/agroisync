# Instruções para Corrigir Problemas nos Testes e no Hardhat

## Problemas Identificados

1. **Problemas nos arquivos de teste com `toBeInTheDocument`**:
   - Os arquivos de teste estão usando o matcher `toBeInTheDocument()` do `@testing-library/jest-dom`, mas faltam as definições de tipos para esses matchers.

2. **Problema no `hardhat.config.ts`**:
   - O arquivo está importando `HardhatUserConfig` de "hardhat/config", mas a dependência do Hardhat não está instalada.

## Correções Realizadas

1. **Atualização do arquivo `types/jest.d.ts`**:
   - Adicionadas definições de tipos explícitas para os matchers do Jest DOM, incluindo `toBeInTheDocument()`.

2. **Atualização do arquivo `package.json`**:
   - Adicionadas as dependências necessárias para o Hardhat:
     - `hardhat`: ^2.17.1
     - `@nomicfoundation/hardhat-toolbox`: ^3.0.0
     - `@nomiclabs/hardhat-ethers`: ^2.2.3
     - `dotenv`: ^16.3.1

## Como Aplicar as Correções

### 1. Atualizar o arquivo `types/jest.d.ts`

Substitua o conteúdo do arquivo `types/jest.d.ts` pelo seguinte:

```typescript
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(className: string): R;
      toHaveStyle(css: string): R;
      toHaveFocus(): R;
      toBeChecked(): R;
      toBeEmpty(): R;
      toBeInvalid(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
    }
  }
}
```

### 2. Atualizar o arquivo `package.json`

Adicione as seguintes dependências na seção `devDependencies` do arquivo `package.json`:

```json
"hardhat": "^2.17.1",
"@nomicfoundation/hardhat-toolbox": "^3.0.0",
"@nomiclabs/hardhat-ethers": "^2.2.3",
"dotenv": "^16.3.1"
```

### 3. Instalar as novas dependências

Após atualizar o arquivo `package.json`, execute o seguinte comando para instalar as novas dependências:

```bash
npm install
```

### 4. Verificar se os testes estão funcionando corretamente

Execute o seguinte comando para verificar se os testes estão funcionando corretamente:

```bash
npm test
```

### 5. Fazer commit e push das alterações

Após aplicar as correções e verificar que tudo está funcionando corretamente, faça commit e push das alterações:

```bash
git add types/jest.d.ts package.json
git commit -m "Correção de problemas nos testes e no Hardhat"
git push origin main
```

## Explicação das Correções

1. **types/jest.d.ts**:
   - O arquivo original apenas importava `@testing-library/jest-dom`, mas não declarava explicitamente os tipos para os matchers do Jest DOM.
   - A correção adiciona uma declaração global para o namespace `jest` e define a interface `Matchers<R>` com todos os matchers do Jest DOM, incluindo `toBeInTheDocument()`.

2. **package.json**:
   - O arquivo original não incluía as dependências necessárias para o Hardhat.
   - A correção adiciona as dependências do Hardhat e suas ferramentas, bem como a dependência `dotenv` para carregar variáveis de ambiente.
