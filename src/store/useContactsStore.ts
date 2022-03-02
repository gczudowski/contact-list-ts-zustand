import create from 'zustand';
import fetchContactsFromApi from '@src/services/api/api';
import { IContactStateZustand, IContactStateItem } from '@src/types/contacts.type';

const sortContactItems = (firstItem: IContactStateItem, secondItem: IContactStateItem): number => {
  if (!!firstItem.isActive === !!secondItem.isActive) {
    return parseInt(firstItem.id, 10) - parseInt(secondItem.id, 10);
  }

  return firstItem.isActive ? -1 : 1;
};

const useStore = create<IContactStateZustand>((set, get) => ({
  items: [],
  isLoading: false,
  hasMore: true,
  errorMessage: '',
  fetchContacts: async () => {
    get().setContactsLoading(true);

    try {
      const response = await fetchContactsFromApi();

      set(({ items }) => ({
        items: [...items, ...response],
      }));
    } catch (error) {
      get().setContactsFetchError(`Error occured with message: ${error}. Try again later...`);
    } finally {
      get().setContactsLoading(false);
    }
  },
  toggleContactStatus(itemId: string) {
    set(({ items }) => ({
      items: items
        .map((item: IContactStateItem) => {
          if (item.id === itemId) {
            return { ...item, isActive: !item.isActive };
          }
          return item;
        })
        .sort(sortContactItems),
    }));
  },
  setContactsLoading(isLoading: boolean) {
    set({
      isLoading,
    });
  },
  setContactsFetchError(errorMessage: string) {
    set({
      errorMessage,
    });
  },
}));

export default useStore;
