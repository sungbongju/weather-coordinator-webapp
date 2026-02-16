import { useWeatherStore } from '../weatherStore';
import { mockWeatherMild } from '@/__tests__/fixtures/weatherData';

describe('weatherStore', () => {
  beforeEach(() => {
    useWeatherStore.getState().reset();
  });

  it('초기 상태가 올바르게 설정되어야 한다', () => {
    const state = useWeatherStore.getState();

    expect(state.weatherData).toBeNull();
    expect(state.location).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setWeatherData로 날씨 데이터를 설정할 수 있어야 한다', () => {
    useWeatherStore.getState().setWeatherData(mockWeatherMild);

    const state = useWeatherStore.getState();
    expect(state.weatherData).toEqual(mockWeatherMild);
    expect(state.error).toBeNull();
  });

  it('setLoading으로 로딩 상태를 변경할 수 있어야 한다', () => {
    useWeatherStore.getState().setLoading(true);
    expect(useWeatherStore.getState().isLoading).toBe(true);

    useWeatherStore.getState().setLoading(false);
    expect(useWeatherStore.getState().isLoading).toBe(false);
  });

  it('setError로 에러를 설정할 수 있어야 한다', () => {
    useWeatherStore.getState().setError('Something went wrong');

    const state = useWeatherStore.getState();
    expect(state.error).toBe('Something went wrong');
    expect(state.isLoading).toBe(false);
  });

  it('setLocation으로 위치를 설정할 수 있어야 한다', () => {
    const location = { latitude: 37.5665, longitude: 126.978 };
    useWeatherStore.getState().setLocation(location);

    expect(useWeatherStore.getState().location).toEqual(location);
  });

  it('reset으로 상태를 초기화할 수 있어야 한다', () => {
    useWeatherStore.getState().setWeatherData(mockWeatherMild);
    useWeatherStore.getState().setLocation({ latitude: 37, longitude: 127 });
    useWeatherStore.getState().setLoading(true);
    useWeatherStore.getState().setError('error');

    useWeatherStore.getState().reset();

    const state = useWeatherStore.getState();
    expect(state.weatherData).toBeNull();
    expect(state.location).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
