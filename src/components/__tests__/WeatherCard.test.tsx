import { render, screen } from '@testing-library/react';
import { WeatherCard } from '../WeatherCard';
import { mockWeatherMild } from '@/__tests__/fixtures/weatherData';

describe('WeatherCard', () => {
  it('현재 온도를 표시해야 한다', () => {
    render(<WeatherCard data={mockWeatherMild} />);
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it('체감 온도를 표시해야 한다', () => {
    render(<WeatherCard data={mockWeatherMild} />);
    expect(screen.getByText(/14/)).toBeInTheDocument();
  });

  it('강수 확률을 표시해야 한다', () => {
    render(<WeatherCard data={mockWeatherMild} />);
    expect(screen.getByText(/10%/)).toBeInTheDocument();
  });

  it('풍속을 표시해야 한다', () => {
    render(<WeatherCard data={mockWeatherMild} />);
    expect(screen.getByText('10km/h')).toBeInTheDocument();
  });

  it('UV 지수를 표시해야 한다', () => {
    render(<WeatherCard data={mockWeatherMild} />);
    expect(screen.getByText('UV')).toBeInTheDocument();
  });

  it('날씨 상태 텍스트를 표시해야 한다', () => {
    render(<WeatherCard data={mockWeatherMild} />);
    expect(screen.getByText('대체로 맑음')).toBeInTheDocument();
  });

  it('로딩 상태일 때 스켈레톤을 표시해야 한다', () => {
    const { container } = render(<WeatherCard data={null} isLoading />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
