import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import './FriendFeatures.css';

export default function PollShare({ url }) {
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    setImage('');
    setMessage('');
    QRCode.toDataURL(url, { width: 400, margin: 4 })
      .then(data => { if (active) setImage(data); })
      .catch(() => {
        if (active) setMessage('QR generation failed. Use the link.');
      });
    return () => { active = false; };
  }, [url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Link copied');
    } catch {
      setMessage('Select the link above and copy it manually.');
    }
  };

  return (
    <section className="friend-share" aria-label="Share poll">
      <label>Poll link
        <input readOnly value={url}
          onFocus={e => e.target.select()} />
      </label>
      <button type="button" className="friend-button" onClick={copy}>
        Copy link
      </button>
      {image && <>
        <img src={image} alt="QR code for this poll's voting link" />
        <a className="friend-button" href={image}
          download="votespace-poll-qr.png">Download QR</a>
      </>}
      <p role="status">{message}</p>
    </section>
  );
}