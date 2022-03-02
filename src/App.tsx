import React, { ReactElement } from 'react';
import { createUseStyles } from 'react-jss';
import CONFIG from 'config';
import MainPage from '@src/pages/mainPage/MainPage';
import { MediaQueries } from '@src/types/css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App(): ReactElement {
  const classes = useStyles();

  return (
    <div className={classes.appContainer}>
      <div className={classes.appContent}>
        <ToastContainer />
        <MainPage />
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  appContent: {
    width: '340px',

    [CONFIG.MEDIA_QUERIES[MediaQueries.SM] as string]: {
      width: '280px',
    },
  },
});

export default App;
