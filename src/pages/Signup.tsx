import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Author } from '../models/Author';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

function Signup() {
  const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState(defaultImage);
  const [social, setSocial] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const {setAuthUser, setIsLogged} = useAuth();
  const navigate = useNavigate();

  function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const authors = JSON.parse(localStorage.getItem('authors') || '[]');
    if (authors.some((author: Author) => author.name === name.trim())) {
      alert('This name is already used');
      return;
    }
    if (!imageUrl.trim()) setImageUrl(defaultImage);
    const newAuthor = new Author(name.trim(), password, imageUrl.trim(), social.trim())
    localStorage.setItem('authors', JSON.stringify([...authors, newAuthor]));
    setAuthUser(newAuthor);
    setIsLogged(true);
    navigate('/');
  }

  return (
    <section className="signup">
      <div className="container pt-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <h1 className="mb-1 fw-normal text-center mb-5">Welcome to your<br/><span className="text-primary">Hokkien culinary community</span></h1>  
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xr-1">
            <form style={{width: '330px'}} className="float-end" onSubmit={submit}>
              <img src={imageUrl} alt="mdo" width={128} height={128} className="rounded-circle mx-auto d-block mb-3"/>
              <div className="form-floating mb-2">
                <input type="text" className="form-control" id="name" placeholder="Name" onChange={e => setName(e.target.value)} required/>
                <label htmlFor="name">Name</label>
              </div>
              <div className="form-floating mb-2 position-relative">
                <input type={isPassword ? "text" : "password"} className="form-control" id="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                <button type="button" onClick={() => setIsPassword(!isPassword)} className="btn position-absolute top-50 translate-middle-y end-0">
                  <FontAwesomeIcon icon={isPassword ? faEye : faEyeSlash} />
                </button>
                <label htmlFor="password">Password</label>
              </div>
              <div className="form-floating mb-2">
                <input type="text" className="form-control" id="picture" placeholder="Picture" onChange={e => setImageUrl(e.target.value || defaultImage)}/>
                <label htmlFor="picture">Picture URL (optional)</label>
              </div>
              <div className="form-floating mb-4">
                <input type="text" className="form-control" id="social" placeholder="Social" onChange={e => setSocial(e.target.value)}/>
                <label htmlFor="social">Social Link (optional)</label>
              </div>
              <button className="btn btn-primary w-100 py-2 text-uppercase mb-4" type="submit">Join</button>
              <p className="m-0">
                Already have an account?{" "}
                <Link to='/login' className="fw-bold px-1">Sign in</Link>
              </p>
            </form>
          </div>
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img src="https://static.vecteezy.com/system/resources/previews/023/904/864/original/father-and-child-cooking-together-in-the-kitchen-flat-illustration-minimalist-modern-concepts-for-web-page-website-development-mobile-app-vector.jpg" className="img-fluid" alt="Phone image"/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup
