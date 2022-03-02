import React, { useEffect, useCallback, ReactElement } from 'react';
import { createUseStyles } from 'react-jss';
import { IContactStateItem, IContactStateZustand } from '@src/types/contacts.type';
import { toast } from 'react-toastify';
import useContactsStore from '@src/store/useContactsStore';
import LoadButton from './components/loadButton/LoadButton';
import PersonInfoList from './components/personInfoList/PersonInfoList';
import SelectedContacts from './components/selectedContacts/SelectedContacts';

function MainPage(): ReactElement {
  const classes = useStyles();
  const contactItems = useContactsStore((state: IContactStateZustand) => state.items);
  const fetchContacts = useContactsStore((state: IContactStateZustand) => state.fetchContacts);
  const toggleContactStatus = useContactsStore((state: IContactStateZustand) => state.toggleContactStatus);
  const isLoading = useContactsStore((state: IContactStateZustand) => state.isLoading);
  const shouldShowLoadButton = useContactsStore((state: IContactStateZustand) => state.hasMore);
  const contactsErrorMessage = useContactsStore((state: IContactStateZustand) => state.errorMessage);
  const selectedItemsCount = contactItems.filter((item: IContactStateItem): boolean => !!item.isActive).length;

  const fetchData = useCallback(() => {
    fetchContacts();
  }, [fetchContacts]);

  const onPersonInfoItemClicked = useCallback((itemId: string) => toggleContactStatus(itemId), [toggleContactStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (contactsErrorMessage) {
      toast.error(contactsErrorMessage, {
        theme: 'colored',
      });
    }
  }, [contactsErrorMessage]);

  return (
    <div className={classes.mainPageContainer}>
      <SelectedContacts selectedContactsCount={selectedItemsCount} />
      <div>
        <PersonInfoList contactItems={contactItems} onClick={onPersonInfoItemClicked} />
      </div>
      {shouldShowLoadButton && (
        <div className={classes.loadMore}>
          <LoadButton isLoading={isLoading} onClick={fetchData} />
        </div>
      )}
    </div>
  );
}

const useStyles = createUseStyles({
  mainPageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    margin: '20px 0',
    paddingBottom: 50,
  },
  loadMore: {
    display: 'flex',
    marginTop: 30,

    '& > *': {
      textAlign: 'center',
    },
  },
});

export default MainPage;
