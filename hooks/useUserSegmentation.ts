import { useState, useEffect } from 'react';

interface UserSegment {
  id: string;
  name: string;
  count: number;
  percentage: number;
  criteria: string[];
}

export function useUserSegmentation() {
  const [segments, setSegments] = useState<UserSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSegments = async () => {
      setLoading(true);
      try {
        // Fetch real user segmentation data from backend analytics
        const response = await fetch('/api/users/segmentation');
        if (!response.ok) {
          throw new Error('Failed to fetch user segmentation data');
        }
        
        const data = await response.json();
        setSegments(data.segments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar segmentação');
      } finally {
        setLoading(false);
      }
    };

    fetchSegments();
  }, []);

  return { segments, loading, error };
} 