# IntroVideo

Componente de vídeo introdutório para o projeto AGROTM. Exibe um vídeo responsivo para apresentação do produto.

## Uso

```tsx
import dynamic from 'next/dynamic';
const IntroVideo = dynamic(() => import('@/components/intro/IntroVideo'), { ssr: false });

<IntroVideo />;
```
