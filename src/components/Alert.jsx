import { createContext, useState } from "react";

export const Alert = (prop) => {
    return (
        <div 
            className={`absolute max-w-sm mx-3 top-3 z-10 px-4 py-2 text-sm text-center bg-rose-50 text-rose-400 rounded-lg border-rose-50 yxj-font ${prop.show && 'animate-fade' }`}
            hidden={!prop.show}
            role="alert"
            onClick={prop.onClick}>
                <span>{prop.title}</span> <span className="font-medium">{prop.content}</span>
        </div>
    )
}

export const AlertContext = createContext({
    showAlert(title, text) {},
    hideAlert() {}
});

export const AlertProvider = ({ children }) => {

    const [ show, setShow ] = useState(false);
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');

    const showAlert = (title, content, autoHide = true) => {
        let id = null;
        return (() => {
            setShow(true);
            setTitle(title);
            setContent(content);
            if (!autoHide) return;

            clearTimeout(id);
            id = setTimeout(() => {
                setShow(false);
            }, 3000);
        })();
    }

    const hideAlert = () => {
        setShow(false);
    }

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            <div className="flex justify-center"><Alert show={show} content={content} title={title} onClick={hideAlert} /></div>
            {children}
        </AlertContext.Provider>
    )
}
