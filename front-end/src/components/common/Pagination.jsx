import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // Show max 5 pages at a time
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;

    if (currentPage <= 3) {
      return [...pages.slice(0, 5), '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-primary hover:bg-primary hover:text-white border border-primary'
          }`}
      >
        <FaChevronLeft />
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-primary-light border border-gray-200'
              }`}
          >
            {page}
          </button>
        )
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-colors ${currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-primary hover:bg-primary hover:text-white border border-primary'
          }`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
