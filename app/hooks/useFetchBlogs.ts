import { useQuery } from '@tanstack/react-query';

const fetchBlogs = async () => {
  const res = await fetch('/api/blog'); 
  if (!res.ok) {
    throw new Error('Error fetching blogs');
  }
  const data = await res.json();
  return data.blogs;
};

export const useFetchBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,  
  });
};
