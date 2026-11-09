import { useState } from 'react';
import { createPoll } from '../api/pollApi';
import PollShare from './PollShare';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [pollLink, setPollLink] = useState('');
  const [error, setError] = useState('');

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (!question.trim() || filteredOptions.length < 2) {
      setError('Enter a question and at least 2 options');
      return;
    }
    try {
      const poll = await createPoll(question, filteredOptions);
      setPollLink(`${window.location.origin}/poll/${poll._id}`);
      setQuestion('');
      setOptions(['', '']);
    } catch (err) {
      setError('Failed to create poll');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create a poll</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={styles.input}
          />
          {options.map((opt, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              style={styles.input}
            />
          ))}
          <button type="button" onClick={addOption} style={styles.secondaryBtn}>
            + Add option
          </button>
          <button type="submit" style={styles.submitBtn}>
            Create Poll
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {pollLink && <PollShare url={pollLink} />}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #10B981 0%, #065F46 100%)',
    padding: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '420px'
  },
  title: {
    margin: '0 0 20px',
    fontSize: '22px',
    color: '#065F46',
    fontWeight: '700'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #D1FAE5',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#F0FDF9'
  },
  secondaryBtn: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #10B981',
    backgroundColor: '#fff',
    color: '#059669',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#10B981',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  error: {
    color: '#DC2626',
    fontSize: '13px',
    marginTop: '12px'
  },
  linkBox: {
    marginTop: '20px',
    padding: '14px',
    backgroundColor: '#F0FDF9',
    borderRadius: '10px'
  },
  linkLabel: {
    fontSize: '13px',
    color: '#065F46',
    margin: '0 0 8px',
    fontWeight: '600'
  },
  linkRow: {
    display: 'flex',
    gap: '8px'
  },
  linkInput: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #D1FAE5',
    fontSize: '12px',
    backgroundColor: '#fff'
  },
  copyBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#10B981',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default CreatePoll;