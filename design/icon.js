import React from 'react';
import PropTypes from 'prop-types';

const config = {
    svg: {
        display: 'flex-inline',
        margin: '0 auto'
    }
};

const Icons = props => (
    <svg
        style={config.svg}
        width={`${props.size}`}
        height={`${props.size}`}
        viewBox={`0 0 512 512`}
        className={props.className}
    >
        <path d={props.icon} />
    </svg>
);

Icons.propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    color: PropTypes.string,
    className: PropTypes.string.isRequired
};

Icons.defaultProps = {
    size: 32
};