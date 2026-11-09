import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyPolls } from '../api/pollApi';
import PollShare from './PollShare';
import './FriendFeatures.css';

export default function MyPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setPolls(await getMyPolls());
    } catch (err) {
      setPolls([]);
      setError(err.response?.status === 401
        ? 'Session expired. Log out and sign in again.'
        : 'Could not load your polls. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="friend-panel" aria-label="My Polls">
      <h2>My Polls</h2>
      <button type="button" className="friend-button"
        onClick={load} disabled={loading}>Refresh polls</button>

      {loading && <p role="status">Loading polls...</p>}
      {error && <p role="alert" className="friend-error">{error}</p>}

      {!loading && !error && polls.length === 0 &&
        <p>No polls yet. Create your first poll above.</p>}

      {!loading && !error && polls.map(poll => (
        <article className="friend-poll" key={poll._id}>
          <h3>{poll.question}</h3>
          <p>Created: {new Date(poll.createdAt).toLocaleString()}</p>
          <p>Total votes: {poll.options.reduce(
            (sum, option) => sum + option.votes, 0)}</p>
          <Link className="friend-button" to={`/poll/${poll._id}`}>
            Open poll
          </Link>
          <PollShare url={`${window.location.origin}/poll/${poll._id}`} />
        </article>
      ))}
    </section>
  );
}