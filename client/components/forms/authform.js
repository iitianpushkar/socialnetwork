const AuthForm = ({
  handlesubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  page,
  username,
  setusername,
  about,
  setabout,
  profileupdate
}) => {
  return (
    <div className="container">
      <form onSubmit={handlesubmit}>
        {profileupdate && ( <div className="form-group p-2"> 
          <small>
            <label className="form-label">Username</label>
            </small>
            <input
              value={username}
              onChange={(e) => setusername(e.target.value)}
              type="text"
              className="form-control"
              
            />
            </div>)}

            {profileupdate && (<div className="form-group p-2">
          <small>
            <label className="form-label">About</label>
            </small>
            <input
              value={about}
              onChange={(e) => setabout(e.target.value)}
              type="text"
              className="form-control"
              
            />
            </div>)} 
       
          
          {page !== "login" && (
            <div className="container">
              <label className="form-label">Your Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="form-control"
                id="exampleInputname1"
              />
            </div>
          )}
          <div className="container">
            <label className="form-label">Email address</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              disabled={profileupdate}
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="container">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              className="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <div>
          <button
            type="submit"
            className="container-fluid btn btn-primary mt-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
