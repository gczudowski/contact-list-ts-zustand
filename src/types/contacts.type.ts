export interface IContact {
  id: string;
  jobTitle: string;
  emailAddress: string;
  firstNameLastName: string;
}

export interface IContactStateItem extends IContact {
  isActive?: boolean;
}

export interface IContactState {
  items: IContactStateItem[];
  isLoading: boolean;
  hasMore: boolean;
  errorMessage: string;
}

export interface IContactStateZustand {
  items: IContactStateItem[];
  isLoading: boolean;
  hasMore: boolean;
  errorMessage: string;
  fetchContacts: () => Promise<void>;
  toggleContactStatus: (itemId: string) => void;
  setContactsLoading: (isLoading: boolean) => void;
  setContactsFetchError: (errorMessage: string) => void;
  appendItems: (newItems: IContact[]) => void;
}
