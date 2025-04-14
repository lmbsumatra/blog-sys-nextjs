import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ButtonNavigation } from "../button/ButtonNavigation";
import { Button } from "../ui/button";
import { useDeleteBlogBySlug } from "@/src/hooks/useDeleteBySlug";

interface blog {
  blog: {
    id: number;
    slug: string;
    banner: string;
    description: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  isYou: boolean;
}

export const BlogCard = ({ blog, isYou }: blog) => {
  const router = useRouter();
  const { mutate: deleteBlog, isError: deleteError } = useDeleteBlogBySlug();

  const handleDelete = (slug: string) => {
    // if (isDeleting) return;
    deleteBlog(slug);
  };

  return (
    <div
      key={blog.id}
      className="w-[428px] p-2 bg-white rounded-md hover:shadow-sm cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/blog/${blog.slug}`);
      }}
    >
      {/* blog thumbnail + content */}
      <div className="flex gap-4">
        {/* thumbnail */}
        <img
          src={
            blog.banner
              ? blog.banner.startsWith(`http`)
                ? blog.banner
                : `http://localhost:3001/${blog.banner}`
              : "https://images.pexels.com/photos/7123047/pexels-photo-7123047.jpeg"
          }
          className="object-cover h-36 w-[168px] rounded-[8px]"
          alt="Blog Thumbnail"
        />

        {/* blogdescription */}
        <div className="flex flex-col justify-between gap-2 flex-grow">
          <div>
            <h3 className="text-lg font-semibold">This is sample title</h3>
            <p className="text-sm text-gray-600">
              {blog.description || "No description available."}
            </p>
          </div>

          {/* author */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/path-to-user-image.jpg" alt="User" />
              <AvatarFallback className="font-bold">
                {blog.user ? `${blog.user.firstName.slice(0, 1)}` : "A"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {blog.user
                ? `${blog.user.firstName} ${blog.user.lastName}`
                : "Anonymous"}
            </span>
          </div>

          {/* other deets */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(blog.createdAt), {
                addSuffix: true,
              })}
            </span>
            <img src="/assets/icons/heart.svg" className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* action btns */}
      {isYou ? (
        <>
          <ButtonNavigation label="Edit Blog" path={`/edit/${blog.slug}`} />
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(blog.slug);
            }}
          >
            Delete
          </Button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
