import LoadingSpinner from './LoadingSpinner';

const LoadingScreen = ({ message = 'Loading...', fullScreen = true }) => {
  const containerClass = fullScreen
    ? 'min-h-screen'
    : 'min-h-[400px]';

  return (
    <div className={`${containerClass} bg-beige flex items-center justify-center`}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
