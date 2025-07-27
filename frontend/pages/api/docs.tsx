import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
      return (
    <div style={{ height: '100vh', background: '#111' }}>
      <SwaggerUI url="/openapi.yaml" docExpansion="list" defaultModelsExpandDepth={1} />
    </div>
  );
}
