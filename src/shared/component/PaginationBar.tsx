import { useMemo, useState } from "react";
import Modal from "./Modal";
import { toast } from "react-toastify";


type PaginationBarProps = {
  totalPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage?: number;
};

const PaginationBar = ({ totalPage, setPage, currentPage }: PaginationBarProps) => {
  const safeTotalPage = useMemo(() => Math.max(1, totalPage), [totalPage]);
  const [isGoToPageOpen, setIsGoToPageOpen] = useState(false);
  const [toPage, setToPage] = useState("");
  if (!currentPage){
    currentPage = 1;
  }

  const handleChangePage = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), safeTotalPage);
    setPage(nextPage);
    setIsGoToPageOpen(false);
  };

  const handleGoToPage = (toPage: number) => {
    if(isNaN(toPage) || toPage < 1 || toPage > safeTotalPage) {
      toast.error(`Please enter a valid page number between 1 and ${safeTotalPage}`);
    }
    else{
      setPage(toPage);
    }

    setIsGoToPageOpen(false);
  };



  return (
    <nav className="flex justify-end items-center gap-2 mt-6">
      <button
        onClick={() => handleChangePage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2"
      >
        &lt; Previous
      </button>

      {
       (
          <div
          >
            <button onClick={() => setIsGoToPageOpen(true)} className="flex items-center gap-1 text-sm text-gray-1000 underline hover:text-blue-700 px-2">
              Page {currentPage} of {safeTotalPage}
            </button>

            <Modal
            isOpen={isGoToPageOpen}
            onClose={() => setIsGoToPageOpen(false)}
            >
              <input 
                type="number" 
                value={toPage}
                onChange={(e) => setToPage(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                placeholder="go to page"
                min="1"
                max={safeTotalPage}
              />
              <button 
                onClick={() => handleGoToPage(Number(toPage))}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Go to page
              </button>
            </Modal>
          </div>
        )
      }

      <button
        onClick={() => handleChangePage(currentPage + 1)}
        disabled={currentPage >= safeTotalPage}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2"
      >
        Next &gt;
      </button>
    </nav>
  );
};

export default PaginationBar;
