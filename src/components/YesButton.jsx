import PropTypes from 'prop-types';
import { YES_BUTTON_CLASS } from './NoButonsVariants';

export const YesButton = (props) => {
    return <>
        {props.lives !== 0 && !props.accept && <button onClick={props.onClick} className={YES_BUTTON_CLASS}>o SI o</button>}
    </>
};

YesButton.propTypes = {
    onClick: PropTypes.func,
    lives: PropTypes.number,
    accept: PropTypes.bool
};

