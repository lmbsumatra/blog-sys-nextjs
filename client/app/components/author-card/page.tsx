interface AuthorCardProps {
    author: {
      name: string;
      avatar: string;
    };
  }
  
  const AuthorCard = ({ author }: AuthorCardProps) => {
    return (
      <div className="flex items-center mt-8">
        <img
          src={author.avatar}
          alt="Author Avatar"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <p className="text-lg font-semibold">{author.name}</p>
          <p className="text-sm text-gray-500">Author</p>
        </div>
      </div>
    );
  };
  
  export default AuthorCard;
  