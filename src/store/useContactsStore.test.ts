import { IContactStateItem } from '@src/types/contacts.type';
import { renderHook, act } from '@testing-library/react-hooks';
import useContactsStore from './useContactsStore';

const initialStoreValue = [
  {
    id: 'idMockInitial1',
    jobTitle: 'titleMockInitial1',
    emailAddress: 'emailMockInitital1',
    firstNameLastName: 'nameMockInitial1',
  },
  {
    id: 'idMockInitial2',
    jobTitle: 'titleMockInitial2',
    emailAddress: 'emailMockInitital2',
    firstNameLastName: 'nameMockInitial2',
    isActive: true,
  },
] as IContactStateItem[];
const mockApiResponse = [
  {
    id: 'idMock2',
    jobTitle: 'titleMock2',
    emailAddress: 'emailMock2',
    firstNameLastName: 'nameMock2',
  },
  {
    id: 'idMock3',
    jobTitle: 'titleMock3',
    emailAddress: 'emailMock3',
    firstNameLastName: 'nameMock3',
  },
] as IContactStateItem[];
let mockFetchContactsFromApi: () => Promise<IContactStateItem[]>;
jest.mock('@src/services/api/api', () => ({
  __esModule: true,
  default: () => mockFetchContactsFromApi(),
}));

describe('useContactsStore', () => {
  const oryginalState = { ...useContactsStore.getState(), items: initialStoreValue };

  beforeEach(() => {
    useContactsStore.setState(oryginalState);
    mockFetchContactsFromApi = jest.fn(async () => mockApiResponse);
  });

  describe('fetchContacts', () => {
    it('sets isLoading to true', async () => {
      mockFetchContactsFromApi = () => new Promise(() => {});
      const { result } = renderHook(() => useContactsStore());

      expect(result.current.isLoading).toEqual(false);

      await act(async () => {
        result.current.fetchContacts();
      });

      expect(result.current.isLoading).toEqual(true);
    });

    it('sets isLoading to false after fetch', async () => {
      const { result } = renderHook(() => useContactsStore());

      await act(async () => {
        await result.current.fetchContacts();
      });

      expect(result.current.isLoading).toEqual(false);
    });

    it('appends fetched items to store', async () => {
      const { result } = renderHook(() => useContactsStore());

      await act(async () => {
        await result.current.fetchContacts();
      });

      expect(result.current.items).toEqual([...initialStoreValue, ...mockApiResponse]);
    });

    it('sets errorMessage when error is given', async () => {
      mockFetchContactsFromApi = () =>
        new Promise((resolve, reject) => {
          reject(new Error('error message mock'));
        });
      const { result } = renderHook(() => useContactsStore());

      expect(result.current.errorMessage).toEqual('');

      await act(async () => {
        result.current.fetchContacts();
      });

      expect(result.current.errorMessage).toEqual(
        'Error occured with message: Error: error message mock. Try again later...',
      );
    });
  });

  describe('toggleContactStatus', () => {
    it('sets isActive to true when item isActive property is not given', async () => {
      const { result } = renderHook(() => useContactsStore());

      expect(result.current.items[0].isActive).toEqual(undefined);

      await act(async () => {
        result.current.toggleContactStatus('idMockInitial1');
      });

      expect(result.current.items[0].isActive).toEqual(true);
    });

    it('sets isActive to true when item isActive property is true', async () => {
      const { result } = renderHook(() => useContactsStore());

      expect(result.current.items[1].isActive).toEqual(true);

      await act(async () => {
        result.current.toggleContactStatus('idMockInitial2');
      });

      expect(result.current.items[1].isActive).toEqual(false);
    });
  });

  describe('setContactsLoading', () => {
    it('sets isLoading to given value when given true', async () => {
      const { result } = renderHook(() => useContactsStore());

      expect(result.current.isLoading).toEqual(false);

      await act(async () => {
        result.current.setContactsLoading(true);
      });

      expect(result.current.isLoading).toEqual(true);
    });

    it('sets isLoading to given value when given false', async () => {
      const { result } = renderHook(() => useContactsStore());

      expect(result.current.isLoading).toEqual(false);

      await act(async () => {
        result.current.setContactsLoading(false);
      });

      expect(result.current.isLoading).toEqual(false);
    });
  });

  describe('setContactsFetchError', () => {
    it('sets properly sets error message when message is empty', async () => {
      const { result } = renderHook(() => useContactsStore());

      expect(result.current.errorMessage).toEqual('');

      await act(async () => {
        result.current.setContactsFetchError('');
      });

      expect(result.current.errorMessage).toEqual('');
    });

    it('sets properly sets error message when message is not empty', async () => {
      const { result } = renderHook(() => useContactsStore());

      expect(result.current.errorMessage).toEqual('');

      await act(async () => {
        result.current.setContactsFetchError('message mock');
      });

      expect(result.current.errorMessage).toEqual('message mock');
    });
  });
});
