import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteProfile } from '../../actions/profile';

const Dashboard = ({
  profile: { profile, loading },
  auth: { user },
  getCurrentProfile,
  deleteProfile,
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <FontAwesomeIcon icon={faUser} /> Welcome {user && user.name}
      </p>
      {profile === null ? (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      ) : (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <button
            onClick={() => deleteProfile()}
            className='btn btn-danger my-2'
          >
            Delete Account
          </button>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  deleteProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return { profile: state.profile, auth: state.auth };
};

export default connect(mapStateToProps, { getCurrentProfile, deleteProfile })(
  Dashboard
);
