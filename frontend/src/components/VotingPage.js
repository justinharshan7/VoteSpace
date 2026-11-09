import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getPoll, votePoll } from '../api/pollApi';

function VotingPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sending, setSending] = useState(false);
  const votePending = useRef(false);
  const revision = useRef(0);

  useEffect(() => {
    let active = true;
    let timer;
    const refresh = async () => {
      const startedAtRevision = revision.current;
      try {
        if (!votePending.current) {
          const updated = await getPoll(id);
          if (active && !votePending.current &&
              startedAtRevision === revision.current) {
            setPoll(updated);
            setLastUpdated(new Date());
            setError('');
          }
        }
      } catch (err) {
        if (active && !votePending.current &&
            startedAtRevision === revision.current) {
          setError(err.response?.status === 404
            ? 'Poll not found.'
            : 'Connection lost. Retrying automatically...');
        }
      } finally {
        if (active) timer = setTimeout(refresh, 3000);
      }
    };
    refresh();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [id]);

  const handleVote = async (optionIndex) => {
    if (votePending.current || voted) return;
    votePending.current = true;
    revision.current += 1;
    setSending(true);
    setError('');
    try {
      const updated = await votePoll(id, optionIndex);
      setPoll(updated);
      setSelected(optionIndex);
      setVoted(true);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Vote failed. Check the results before retrying.');
    } finally {
      votePending.current = false;
      setSending(false);
    }
  };

  if (!poll) {
    return <p role="status" style={{ textAlign: 'center',
      marginTop: '40px', color: '#065F46' }}>
      {error || 'Loading poll...'}
    </p>;
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div style={{
      maxWidth: '420px',
      margin: '60px auto',
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      fontFamily: 'sans-serif'
    }}>
      <p style={{ fontSize: '13px', color: '#888', margin: '0 0 4px' }}>Poll</p>
      <h2 style={{ fontSize: '18px', margin: '0 0 20px', color: '#111' }}>{poll.question}</h2>

      <p role="status" style={{ color: '#065F46', fontSize: '13px' }}>
        Live Results - updates every 3 seconds
        {lastUpdated && ` | ${lastUpdated.toLocaleTimeString()}`}
      </p>
      {error && <p role="alert" style={{ color: '#B91C1C' }}>
        {error}
      </p>}
      {sending && <p role="status">Sending vote...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {poll.options.map((opt, index) => {
          const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isSelected = selected === index;

          return (
            <button
              key={opt._id || index}
              type="button"
              disabled={voted || sending}
              onClick={() => handleVote(index)}
              style={{
                position: 'relative',
                height: '44px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
                background: '#f3f4f6',
                width: '100%',
                padding: 0,
                textAlign: 'left',
                fontFamily: 'inherit',
                color: '#111',
                opacity: 1,
                cursor: voted || sending ? 'default' : 'pointer'
              }}
            >
              <div style={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: `${percent}%`,
                background: isSelected ? '#10B981' : '#A7F3D0',
                transition: 'width 0.6s ease-out'
              }} />
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
                padding: '0 14px',
                fontSize: '14px',
                fontWeight: isSelected ? 600 : 400,
                color: '#111'
              }}>
                <span>{isSelected && '✓ '}{opt.text}</span>
                <span>{opt.votes} votes ({percent}%)</span>
              </div>
            </button>
          );
        })}
      </div>

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '16px' }}>
        {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default VotingPage;