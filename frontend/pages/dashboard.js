import React from 'react';
import { Layout } from '../src/components/layout/layout';
import { GrainsDashboard } from '../src/components/grains/grains-dashboard';


export default function DashboardPage() {
  return (
    <Layout>
      <GrainsDashboard />
    </Layout>
  );
}
