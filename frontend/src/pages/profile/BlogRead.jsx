import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaRegEdit, FaTrash } from 'react-icons/fa';
import { deleteBlog, getMyBlog } from '../../services/blogService';
import JournalReader from '../../components/editor/JournalReader';
import ConfirmModal from '../../components/common/ConfirmModal';
import { imgT } from '../../utils/publicUtils';

const BACK = '/profile';

export default function BlogRead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMyBlog(id)
      .then(setBlog)
      .catch((err) =>
        setError(err.response?.status === 404 ? 'Blog not found.' : 'Could not load this blog.')
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteBlog(id);
      navigate(BACK, { replace: true });
    } catch {
      setError('Could not delete this blog.');
      setDeleting(false)
      setConfirmOpen(false)
    }
  };

  if (loading) return <p className="text-sm text-white/40">Loading…</p>;

  if (!blog) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-400">{error || 'Blog not found.'}</p>
        <Link to={BACK} className="text-sm text-emerald-400">
          ← Back to my profile
        </Link>
      </div>
    );
  }

  const published = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <Link to={BACK} className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
          <FaArrowLeft size={11} /> My profile
          
        </Link>
        <Link
          to={`/edit-blog/${blog._id}`}
          className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-1.5 md:py-2.5 text-xs md:text-sm font-medium  text-white/50 hover:text-white transition hover:bg-white/5"
        >
          <FaRegEdit size={11} /> Edit
        </Link>

      </div>

       {blog.coverImage && (
        <img
          src={imgT(blog.coverImage, 'c_limit,w_1400')}
          alt=""
          className="max-h-96 w-full rounded-2xl border border-white/10 object-cover"
        />
      )}

      <article className=" rounded-2xl border border-white/10 bg-[#141414] py-6 px-3 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-white/40">
              {published} · {blog.readTime} min read
            </p>
            <h1 className="mt-2 break-words text-3xl font-semibold">{blog.title}</h1>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-white/60">
            {blog.visibility}
          </span>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          {blog.content ? (
            <JournalReader key={blog._id} content={blog.content} />
          ) : (
            <p className="text-sm text-white/40">No text in this blog.</p>
          )}
        </div>
      </article>

      <div className="flex items-center justify-end">
        
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex items-center gap-2 text-xs text-white/30 transition hover:text-red-400"
        >
          <FaTrash size={11} /> Delete
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        variant="danger"
        title="Delete this blog?"
        description="It will be removed for good, including from the public feed. This cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}