import PropTypes from 'prop-types';
import { useState } from 'react';
import { YES_BUTTON_CLASS } from './NoButonsVariants';


export const YesButton = (props) => {
    return <button onClick={props.onClick} className={YES_BUTTON_CLASS}>o Si o</button>;
};

YesButton.propTypes = {
    onClick: PropTypes.func,
};

