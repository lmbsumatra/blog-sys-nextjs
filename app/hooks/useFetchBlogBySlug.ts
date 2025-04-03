import { useQuery } from '@tanstack/react-query';

const fetchBlogBySlug = async (slug: string) => {
  console.log('Fetching blog with slug:', slug);
  const res = await fetch(`/api/blog/${slug}`);
  if (!res.ok) {
    throw new Error('Error fetching blog');
  }
  const data = await res.json();
  console.log('Fetched data:', data);
  return data.blog;
};

export const useFetchBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => fetchBlogBySlug(slug),
  });
};