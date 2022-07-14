import { useTranslation } from "react-i18next";

function LanguageSelector(props) {

    const { i18n } = useTranslation()

    return (
        <>
            <img src="https://www.countryflagicons.com/FLAT/64/BR.png"
                onClick={() => i18n.changeLanguage("pt")}
                title="Portuguese"
                alt="Portuguese"
            />
            <img src="https://www.countryflagicons.com/FLAT/64/US.png"
                onClick={() => i18n.changeLanguage("en")}
                title="English"
                alt="English"
            />
        </>
    );
}

export default LanguageSelector;