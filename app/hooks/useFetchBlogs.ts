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
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,  
  });

  return { data, error, isLoading, isError };
};
