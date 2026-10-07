import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container status">
      <h1 className="page-title">Offside!</h1>
      <p>That page doesn't exist.</p>
      <Link to="/" className="more">Back to home →</Link>
    </div>
  );
}
