import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getAllProfiles } from '../../actions/profile';

const Profiles = ({ getAllProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getAllProfiles();
  }, [getAllProfiles]);

  return (
    <Fragment>
      <h1 className='large text-primary'>Developers</h1>
      <p className='lead'>
        <FontAwesomeIcon icon={faConnectdevelop} /> Browse and connect with
        developers
      </p>
      {loading ? (
        <Spinner />
      ) : (
        <div className='profiles'>
          {profiles.length > 0 &&
            profiles.map((profile) => (
              <ProfileItem key={profile._id} profile={profile} />
            ))}
        </div>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getAllProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { profile: state.profile };
};

export default connect(mapStateToProps, { getAllProfiles })(Profiles);
