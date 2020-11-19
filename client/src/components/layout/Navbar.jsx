import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faCode,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = (props) => {
  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <FontAwesomeIcon icon={faUser} /> Dashboard
        </Link>
      </li>
      <li>
        <a href='#!' onClick={props.logout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </a>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <FontAwesomeIcon icon={faCode} /> DevConnector
        </Link>
      </h1>
      {!props.auth.loading && (
        <Fragment>
          {props.auth.isAuthenticated ? authLinks : guestLinks}
        </Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, { logout })(Navbar);
