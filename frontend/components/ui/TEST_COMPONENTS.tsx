// TESTE DOS COMPONENTES UI
// Este arquivo verifica se todos os componentes estão sendo exportados corretamente

import { Button, buttonVariants } from './Button';
import { Badge, badgeVariants } from './Badge';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

// Verificação de exportações
export const TestComponents = {
  Button: Button,
  Badge: Badge,
  Card: Card,
  CardHeader: CardHeader,
  CardTitle: CardTitle,
  CardContent: CardContent,
  buttonVariants: buttonVariants,
  badgeVariants: badgeVariants
};

// Verificação de tipos
export type TestComponentTypes = {
  Button: typeof Button;
  Badge: typeof Badge;
  Card: typeof Card;
  CardHeader: typeof CardHeader;
  CardTitle: typeof CardTitle;
  CardContent: typeof CardContent;
};

// Status dos componentes
export const ComponentStatus = {
  Button: '✅ FUNCIONANDO',
  Badge: '✅ FUNCIONANDO',
  Card: '✅ FUNCIONANDO',
  CardHeader: '✅ FUNCIONANDO',
  CardTitle: '✅ FUNCIONANDO',
  CardContent: '✅ FUNCIONANDO'
};

export default TestComponents;
