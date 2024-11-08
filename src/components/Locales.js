import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// third-party
import { IntlProvider } from 'react-intl';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import 'dayjs/locale/en';
import moment from 'moment';
import momentTr from 'moment/locale/tr';

// project import
import useConfig from 'hooks/useConfig';
import axios from 'utils/axios';

// load locales files
const loadLocaleData = (locale) => {
  switch (locale) {
    case 'en':
      dayjs.locale('en');
      moment.updateLocale('en', null); // çalışmıyor tekrar bakılacak
      return import('utils/locales/en.json');
    default:
      dayjs.locale('tr');
      moment.updateLocale('tr', momentTr);
      return import('utils/locales/tr.json');
  }
};

// ==============================|| LOCALIZATION ||============================== //

const Locales = ({ children }) => {
  const { i18n } = useConfig();

  const [messages, setMessages] = useState();

  useEffect(() => {
    // axios.defaults.headers.common['Accept-Language'] = i18n === 'tr' ? 'tr-TR' : 'en-US';
    axios.defaults.headers.common['Locale'] = i18n;
    loadLocaleData(i18n).then((d) => {
      setMessages(d.default);
    });
  }, [i18n]);

  return (
    <>
      {messages && (
        <IntlProvider locale={i18n} defaultLocale="tr" messages={messages}>
          {children}
        </IntlProvider>
      )}
    </>
  );
};

Locales.propTypes = {
  children: PropTypes.node
};

export default Locales;
