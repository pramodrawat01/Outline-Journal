import { Link } from 'react-router-dom';

export default function AuthorName({ author }) {
  if (!author.linkable) return <span>{author.name}</span>;
  return (
    <Link to={`/u/${author.username}`} className="relative z-10 transition hover:text-emerald-400">
      {author.name}
    </Link>
  );
}