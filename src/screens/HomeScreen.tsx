import { useContext, useState } from 'react';
import SearchForm from '../components/Home/SearchForm';
import SearchHistory from '../components/Home/SearchHistory';
import SearchResult from '../components/Home/SearchResult';
import { UserData } from '../github/api';
import { GlobalContext } from '../context/GlobalContext';

function HomeScreen() {
  const [searchResult, setSearchResult] = useState<UserData>({});
  const { loadUserData } = useContext(GlobalContext);

  const searchHistory: UserData[] = Object.values(localStorage)
    .map((value) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    })
    .filter((user) => user?.login)
    .sort(
      ({ last_updated_at: a }, { last_updated_at: b }) =>
        new Date(b).getTime() - new Date(a).getTime()
    );

  if (!searchHistory.length) {
    return null;
  }

  async function onSearch(username: string) {
    const _result = await loadUserData(username);
    setSearchResult(_result);
  }

  return (
    <>
      <SearchForm onSubmit={onSearch} />
      <SearchResult data={searchResult} />
      <SearchHistory items={searchHistory} />
    </>
  );
}

export default HomeScreen;
