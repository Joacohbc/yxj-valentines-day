import PropTypes from 'prop-types';
import { memo, useState } from 'react';

const NO_BUTTON_CLASS = (isDisabled) => `${!isDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font`;

// Create a Hook to Manage all No Buttons in the App
const useNoButton = () => {
    const [ className, setClassName ] = useState(NO_BUTTON_CLASS(false));
    const [ style, setStyle ] = useState({});
    const [ text, setText ] = useState('NO ME AGARRAS');
    const [ onClick, setOnClick ] = useState(null);
    const [ isDisabled, setIsDisabled ] = useState(false);
    const [ onMouseOver, setOnMouseOver ] = useState(() => {});
    const [ onMouseOut, setOnMouseOut ] = useState(() => {});
    const [ onTouchStart, setOnTouchStart ] = useState(() => {});
    const [ onTouchCancel, setOnTouchCancel ] = useState(() => {});

    return {
        className,
        setClassName,
        style,
        setStyle,
        text,
        setText,
        onClick,
        setOnClick,
        isDisabled,
        setIsDisabled,
        onMouseOver,
        setOnMouseOver,
        onMouseOut,
        setOnMouseOut,
        onTouchStart,
        setOnTouchStart,
        onTouchCancel,
        setOnTouchCancel
    };
}

const NoButtonBasic = memo((props) => {
    return <button 
                className={props.className}
                disabled={props.isDisabled}
                onClick={props.onClick}
                style={props.style}
                onMouseOver={props.onMouseOver}
                onMouseOut={props.onMouseOut}
                onTouchStart={props.onTouchStart}
                onTouchCancel={props.onTouchCancel}> {props.text} </button>;
});

NoButtonBasic.propTypes = {
    isDisabled: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchCancel: PropTypes.func,
    className: PropTypes.string,
    text: PropTypes.string
};

NoButtonBasic.displayName = 'NoButtonBasic';

export {
    NoButtonBasic,
    NO_BUTTON_CLASS,
    useNoButton
};
