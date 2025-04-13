import { useQuery } from '@tanstack/react-query';

const fetchBlogBySlug = async (slug: string) => {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs/${slug}`, {
    credentials: 'include', 
  });

  if (!res.ok) {
    throw new Error('Error fetching blog');
  }

  const data = await res.json();
  return data.blog;
};

export const useFetchBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => fetchBlogBySlug(slug),
    enabled: !!slug, 
  });
};
